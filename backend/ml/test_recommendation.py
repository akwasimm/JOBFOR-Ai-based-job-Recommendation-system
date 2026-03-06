import pytest
from recommendation import calculate_job_matches

def test_calculate_job_matches_empty():
    assert calculate_job_matches([], []) == []
    
    # Empty jobs but user has skills
    assert calculate_job_matches(["python"], []) == []
    
    # User has no skills but jobs exist
    jobs = [{"id": 1, "skills_required": ["python"]}]
    res = calculate_job_matches([], jobs)
    assert len(res) == 1
    assert res[0]['match_score'] == 0.0

def test_calculate_job_matches_perfect_match():
    user = ["python", "react"]
    jobs = [
        {"id": 1, "skills_required": ["python", "react"]},
        {"id": 2, "skills_required": ["java"]}
    ]
    res = calculate_job_matches(user, jobs)
    assert res[0]['job_id'] == 1
    assert res[0]['match_score'] > res[1]['match_score']
    assert res[1]['match_score'] == 0.0 # No overlap with java

def test_calculate_job_matches_missing_fields():
    # Jobs with missing skills/desc
    user = ["python"]
    jobs = [
        {"id": 1},  # No text
        {"id": 2, "skills_required": []},
        {"id": 3, "description": ""}
    ]
    res = calculate_job_matches(user, jobs)
    for r in res:
        assert r['match_score'] == 0.0

def test_calculate_job_matches_weird_chars():
    user = ["c++", "c#", "node.js"]
    jobs = [
        {"id": 1, "description": "Looking for c++ and node.js"}
    ]
    res = calculate_job_matches(user, jobs)
    assert res[0]['match_score'] > 0.0
