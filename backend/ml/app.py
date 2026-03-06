from fastapi import FastAPI, HTTPException, UploadFile, File
import fitz
from pydantic import BaseModel
from typing import List, Dict, Any

from nlp_processor import extract_skills_from_text
from recommendation import calculate_job_matches
from skill_analyzer import analyze_skill_gap

app = FastAPI(title="Job Search Assistant - ML Service")

class JobDescription(BaseModel):
    """
    Schema representation encapsulating the attributes requisite for generic role evaluation definitions.
    """
    text: str

class SkillExtractionRequest(BaseModel):
    """
    Payload parameter constraints designated for the entity-relation skill extraction processes.
    """
    text: str

class MatchRequest(BaseModel):
    """
    Structured model determining the inputs resolving heuristic matching functions against datasets.
    """
    user_skills: List[str]
    jobs: List[Dict[str, Any]] 

class SkillGapRequest(BaseModel):
    """
    Defines the requisite data interface needed for determining capability discrepancies in career progression.
    """
    user_skills: List[str]
    target_role_skills: List[str]

@app.get("/")
def read_root():
    """
    Diagnostic heartbeat indicator serving confirmation of functional application layer deployment.
    """
    return {"status": "ok", "service": "ML Service"}

@app.post("/extract-skills")
def extract_skills(req: SkillExtractionRequest):
    """
    Executes deep semantic parsing over arbitrary character inputs resolving isolated expertise signatures.
    """
    try:
        skills = extract_skills_from_text(req.text)
        return {"skills": skills}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/recommend-jobs")
def recommend_jobs(req: MatchRequest):
    """
    Applies vector space similarity approximations rendering normalized scores across composite user profiles.
    """
    try:
        recommendations = calculate_job_matches(req.user_skills, req.jobs)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-skill-gap")
def analyze_gap(req: SkillGapRequest):
    """
    Computes comparative capability constraints delineating areas of competency shortage against idealized profiles.
    """
    try:
        gap_analysis = analyze_skill_gap(req.user_skills, req.target_role_skills)
        return {"gap_analysis": gap_analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)):
    """
    Acts as the main ingest node for unstructured proprietary applicant CVs executing optical parsing.
    Generates vectorized capability classifications.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    try:
        contents = await file.read()
        
        doc = fitz.open(stream=contents, filetype="pdf")
        
        text = ""
        for page in doc:
            text += page.get_text()
            
        doc.close()
        
        extracted_skills = extract_skills_from_text(text)
        
        return {
            "success": True,
            "filename": file.filename,
            "skills": extracted_skills
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
