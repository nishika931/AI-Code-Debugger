from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.code_runner import run_python_code

from agents.supervisor import debug_code


app = FastAPI(
    title="AI Debugger Agent",
    description="Agentic AI coding debugging assistant"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DebugRequest(BaseModel):
    code: str
    problem: str


@app.get("/")
def root():
    return {
        "message": "AI Debugger Agent is running"
    }


@app.post("/debug")
def debug(request: DebugRequest):

    result = debug_code(
        request.code,
        request.problem
    )

    return result

class RunRequest(BaseModel):
    code: str


@app.post("/run")
def run_code(request: RunRequest):
    result = run_python_code(request.code)
    return result