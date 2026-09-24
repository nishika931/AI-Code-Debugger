from services.llm import llm
import json


def generate_fix(code: str, analysis: dict, execution_error: str):

    prompt = f"""
You are an expert debugging repair agent.

Original Python code:
{code}

Code analysis:
{json.dumps(analysis, indent=2)}

Execution error:
{execution_error}

Generate a corrected version of the code.

Return ONLY valid JSON:

{{
    "fixed_code": "complete corrected Python code",
    "explanation": "explain exactly what was changed and why it fixes the problem"
}}

Rules:
- Preserve the original functionality.
- Fix the identified problem.
- Return the complete corrected code.
- Do not use markdown.
- Do not use ```python.
"""

    response = llm.invoke(prompt)

    content = response.content.strip()

    try:
        result = json.loads(content)

        return {
            "fixed_code": result.get("fixed_code", code),
            "explanation": result.get(
                "explanation",
                "The identified issue was corrected."
            )
        }

    except json.JSONDecodeError:

        if content.startswith("```"):
            content = content.replace("```python", "")
            content = content.replace("```", "")
            content = content.strip()

        return {
            "fixed_code": content,
            "explanation": "The AI generated a corrected version of the code."
        }