from services.llm import llm
import json


def analyze_code(code: str, problem: str):
    prompt = f"""
You are an expert code analysis agent.

Analyze the following Python code and the user's reported problem.

SOURCE CODE:
{code}

USER PROBLEM:
{problem}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "bug_type": "Syntax Error | Runtime Error | Logical Error | No Error",
    "error": "specific error name or description",
    "severity": "Low | Medium | High",
    "location": "line number or code section",
    "root_cause": "short explanation of the root cause",
    "explanation": "clear explanation of what is wrong"
}}

Do not include markdown.
Do not include ```json.
"""

    response = llm.invoke(prompt)

    content = response.content.strip()

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        return {
            "bug_type": "Unknown",
            "error": "Unable to parse analysis",
            "severity": "Medium",
            "location": "Unknown",
            "root_cause": content,
            "explanation": content
        }