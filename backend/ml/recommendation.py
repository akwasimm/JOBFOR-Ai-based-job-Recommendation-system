from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import List, Dict, Any

def calculate_job_matches(user_skills: List[str], jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Computes mathematical compatibility coefficients evaluating user capabilities against active job requisitions.

    Implements a content-based recommendation clustering methodology utilizing Term Frequency-Inverse 
    Document Frequency (TF-IDF) vectorization and Cosine Similarity to determine contextual alignment 
    between an applicant's skill matrix and the unstructured linguistic data of available positions.

    Args:
        user_skills (List[str]): Disaggregated array of technical proficiencies possessed by the user.
        jobs (List[Dict[str, Any]]): A collection of hierarchical job requisition objects, requiring 
                                     'id' and either 'description' or 'skills_required' keys.

    Returns:
        List[Dict[str, Any]]: A deterministically ordered list of dictionary objects containing 
                              'job_id' and 'match_score', sorted in descending order of similarity.
    """
    if not jobs:
        return []
    
    if not user_skills:
        return [{"job_id": job.get("id"), "match_score": 0.0} for job in jobs]

    user_doc = " ".join([skill.lower() for skill in user_skills])

    job_docs = []
    job_ids = []
    
    for job in jobs:
        job_ids.append(job.get("id"))
        
        skills_req = job.get("skills_required")
        if skills_req is None:
            skills_req = []
        elif isinstance(skills_req, str):
            skills_req = [skills_req]
            
        job_skill_text = " ".join([s.lower() for s in skills_req])
        job_desc = str(job.get("description", "")).lower()
        
        full_doc = f"{job_skill_text} {job_desc}"
        job_docs.append(full_doc)

    documents = [user_doc] + job_docs

    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        tfidf_matrix = vectorizer.fit_transform(documents)
    except ValueError:
        return [{"job_id": jid, "match_score": 0.0} for jid in job_ids]

    cosine_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    recommendations = []
    for idx, job_id in enumerate(job_ids):
        score = round(float(cosine_similarities[idx]) * 100, 2)
        recommendations.append({
            "job_id": job_id,
            "match_score": score
        })
        
    recommendations.sort(key=lambda x: x["match_score"], reverse=True)

    return recommendations
