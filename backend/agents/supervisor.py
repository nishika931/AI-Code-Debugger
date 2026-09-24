from graph.graph import debug_graph


def debug_code(code: str, problem: str):

    initial_state = {
        "code": code,
        "problem": problem,

        "analysis": {},
        "execution": {},

        "fixed_code": "",
        "fix_explanation": "",

        "cycle": 0,
        "agent_steps": []
    }

    final_state = debug_graph.invoke(initial_state)

    analysis = final_state.get("analysis", {})
    execution = final_state.get("execution", {})

    original_code = code

    fixed_code = (
        final_state.get("fixed_code")
        or original_code
    )

    if execution.get("success"):
        status = "fixed"
        verification_message = (
            "Code executed successfully after the AI debugging workflow."
        )
    else:
        status = "failed"
        verification_message = (
            "The code still contains an issue after debugging cycles."
        )

    return {
        "status": status,

        "bug": {
            "type": analysis.get(
                "bug_type",
                "Unknown"
            ),

            "error": analysis.get(
                "error",
                "Unknown"
            ),

            "severity": analysis.get(
                "severity",
                "Medium"
            ),

            "location": analysis.get(
                "location",
                "Unknown"
            ),

            "root_cause": analysis.get(
                "root_cause",
                ""
            )
        },

        "analysis": analysis.get(
            "explanation",
            ""
        ),

        "original_code": original_code,

        "fixed_code": fixed_code,

        "fix_explanation": final_state.get(
            "fix_explanation",
            ""
        ),

        "verification": {
            "success": execution.get(
                "success",
                False
            ),

            "message": verification_message,

            "output": execution.get(
                "output",
                ""
            ),

            "error": execution.get(
                "error",
                ""
            )
        },

        "agent_workflow": final_state.get(
            "agent_steps",
            []
        )
    }