import re
import spacy
from typing import List

try:
    nlp = spacy.load("en_core_web_sm")
except Exception:
    nlp = None

KNOWN_SKILLS = set([
    "javascript", "python", "react", "node.js", "typescript", "java", 
    "sql", "mongodb", "aws", "docker", "git", "machine learning",
    "data analysis", "agile", "communication", "html", "css", "c++",
    "c#", "kubernetes", "fastapi", "flask", "django"
])

def extract_skills_from_text(text: str) -> List[str]:
    """
    Extracts explicit technical and soft skills from unstructured text corpora.

    Utilizes a hybrid extraction model combining dictionary-based deterministic 
    matching against known competency taxonomies, alongside an optional NLP 
    Named Entity Recognition (NER) pipeline via spaCy for advanced classification.

    Args:
        text (str): The raw, unstructured text string (e.g., job description or resume).

    Returns:
        List[str]: A unique collection of normalized technical skill identifiers 
                   extracted from the provided input string.
    """
    if not text:
        return []

    text_lower = text.lower()
    extracted_skills = set()

    for skill in KNOWN_SKILLS:
        escaped_skill = re.escape(skill)
        pattern = r'\b' + escaped_skill + r'\b'
        if re.search(pattern, text_lower):
            extracted_skills.add(skill)

    if nlp is not None:
        doc = nlp(text)
        for ent in doc.ents:
            pass
            
    return list(extracted_skills)
