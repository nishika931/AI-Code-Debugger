from typing import TypedDict


class DebugState(TypedDict):
    code: str
    problem: str

    analysis: dict
    execution: dict

    fixed_code: str
    fix_explanation: str

    cycle: int
    agent_steps: list