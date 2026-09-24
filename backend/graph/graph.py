from langgraph.graph import StateGraph, END

from graph.state import DebugState

from agents.analyzer import analyze_code
from agents.fixer import generate_fix
from services.code_runner import run_python_code

def analyzer_node(state: DebugState):

    analysis = analyze_code(
        state["code"],
        state["problem"]
    )

    steps = list(state.get("agent_steps", []))

    steps.append({
        "agent": "Analyzer Agent",
        "status": "completed",
        "message": "Analyzed source code and identified potential issues."
    })

    return {
        "analysis": analysis,
        "agent_steps": steps
    }



def executor_node(state: DebugState):

    current_code = state.get("fixed_code") or state["code"]

    execution = run_python_code(current_code)

    steps = list(state.get("agent_steps", []))

    steps.append({
        "agent": "Executor Agent",
        "status": "completed",
        "message": "Executed the current version of the code."
    })

    return {
        "execution": execution,
        "agent_steps": steps
    }



def fixer_node(state: DebugState):

    current_code = state.get("fixed_code") or state["code"]

    fix_result = generate_fix(
        current_code,
        state["analysis"],
        state["execution"]["error"]
    )

    cycle = state.get("cycle", 0) + 1

    steps = list(state.get("agent_steps", []))

    steps.append({
        "agent": "Fix Agent",
        "status": "completed",
        "message": f"Generated correction (cycle {cycle})."
    })

    return {
        "fixed_code": fix_result["fixed_code"],
        "fix_explanation": fix_result["explanation"],
        "cycle": cycle,
        "agent_steps": steps
    }



def verification_node(state: DebugState):

    execution = state.get("execution", {})

    steps = list(state.get("agent_steps", []))

    if execution.get("success"):
        message = "Corrected code passed execution verification."
    else:
        message = "Code still contains an issue after debugging cycles."

    steps.append({
        "agent": "Verification Agent",
        "status": "completed",
        "message": message
    })

    return {
        "agent_steps": steps
    }



def route_after_execution(state: DebugState):

    execution = state.get("execution", {})
    cycle = state.get("cycle", 0)

    if execution.get("success"):
        return "verification"

    if cycle >= 2:
        return "verification"

    return "fix"



workflow = StateGraph(DebugState)

workflow.add_node("analyzer", analyzer_node)
workflow.add_node("executor", executor_node)
workflow.add_node("fixer", fixer_node)
workflow.add_node("verification", verification_node)

# Start
workflow.set_entry_point("analyzer")

workflow.add_edge("analyzer", "executor")

workflow.add_conditional_edges(
    "executor",
    route_after_execution,
    {
        "fix": "fixer",
        "verification": "verification"
    }
)

workflow.add_edge("fixer", "executor")

workflow.add_edge("verification", END)

debug_graph = workflow.compile()