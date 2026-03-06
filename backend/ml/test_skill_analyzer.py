import pytest
from skill_analyzer import analyze_skill_gap

def test_analyze_skill_gap_empty_inputs():
    # Both empty
    res = analyze_skill_gap([], [])
    assert res['match_percentage'] == 100.0
    assert res['missing_skills'] == []
    
    # User empty, role has skills
    res = analyze_skill_gap([], ["Python", "React"])
    assert res['match_percentage'] == 0.0
    assert set(res['missing_skills']) == {"python", "react"}

    # User has skills, role empty
    res = analyze_skill_gap(["Python"], [])
    assert res['match_percentage'] == 100.0
    assert set(res['extra_skills']) == {"python"}

def test_analyze_skill_gap_case_insensitivity():
    # Case differences
    res = analyze_skill_gap(["PYTHON", "rEacT"], ["python", "React"])
    assert res['match_percentage'] == 100.0
    assert res['missing_skills'] == []

def test_analyze_skill_gap_duplicates():
    # Duplicates should be handled
    res = analyze_skill_gap(["Python", "python"], ["python", "python", "React"])
    assert res['match_percentage'] == 50.0  # (python matches, react is missing: 1/2)
    assert res['missing_skills'] == ["react"]

def test_analyze_skill_gap_none_values():
    # User array has empty strings
    res = analyze_skill_gap(["", "python", None], ["python"])
    assert res['match_percentage'] == 100.0
