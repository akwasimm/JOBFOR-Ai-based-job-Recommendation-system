from typing import Dict, List, Any

def analyze_skill_gap(user_skills: List[str], target_role_skills: List[str]) -> Dict[str, Any]:
    """
    Executes a differential cross-examination to isolate capability deficits between applicant vectors
    and normalized employer requisitions.

    Utilizes Cartesian set theory operations to identify intersections (competency overlap) and 
    relative complements (capability deficits/surpluses) informing individual upskilling vectors.

    Args:
        user_skills (List[str]): Operational identifiers representing the applicant's current capability tier.
        target_role_skills (List[str]): Prerequisite technical identifiers prescribed by the employer entity.

    Returns:
        Dict[str, Any]: Analytical schema encapsulating:
            - match_percentage (float): Fractional coefficient of fulfilled requirements.
            - missing_skills (List[str]): Deficit array of unrecognized employer prerequisites.
            - matched_skills (List[str]): Intersection array confirming overlapping competences.
            - extra_skills (List[str]): Surplus array of unrequested applicant proficiencies.
    """
    user_set = set([s.lower() for s in user_skills if s])
    role_set = set([s.lower() for s in target_role_skills if s])

    if not role_set:
        return {
            "match_percentage": 100.0,
            "missing_skills": [],
            "matched_skills": list(user_set),
            "extra_skills": list(user_set)
        }

    matched = user_set.intersection(role_set)
    missing = role_set.difference(user_set)
    extra = user_set.difference(role_set)

    match_percentage = (len(matched) / len(role_set)) * 100.0

    return {
        "match_percentage": round(match_percentage, 2),
        "missing_skills": list(missing),
        "matched_skills": list(matched),
        "extra_skills": list(extra)
    }
