# 🤖 AI Code Debugger

An **Agentic AI-powered coding debugger** that analyzes Python code, identifies errors, generates fixes, executes the code, and verifies the result through an automated feedback loop.

## ✨ Features

* 🧠 AI-based code and error analysis
* 🔍 Root-cause explanation
* 🛠️ Automatic code correction
* 🔄 Feedback-based debugging loop
* ✅ Execution verification
* 🔀 Conditional agent routing
* 📊 Agent workflow visualization
* 💻 Monaco code editor

## 🔄 How It Works

                    ┌─────────────────────┐
                    │        User         │
                    │  Code + Problem     │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │   Analyzer Agent    │
                    │  Analyze & Find Bug │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │   Executor Agent   │
                    │    Run Code        │
                    └──────────┬──────────┘
                               ↓
                       ┌──────────────┐
                       │   Execution  │
                       │    Result    │
                       └──────┬───────┘
                              ↓
                     ┌──────────────────┐
                     │    Successful?   │
                     └───────┬──────────┘
                       YES   │    NO
                        ↓    │     ↓
              ┌────────────┐ │ ┌──────────────────┐
              │Verification│ │ │   Cycle < 2 ?    │
              └─────┬──────┘ │ └────────┬─────────┘
                    │         │       YES│      NO
                    │         │          ↓         ↓
                    │         │   ┌────────────┐ ┌──────────────┐
                    │         │   │  Fix Agent │ │ Verification │
                    │         │   │ Generate   │ │ Final Result │
                    │         │   │    Fix     │ └──────────────┘
                    │         │   └─────┬──────┘
                    │         │         ↓
                    │         │   ┌────────────┐
                    │         │   │  Execute   │
                    │         │   │   Again    │
                    │         │   └─────┬──────┘
                    │         │         │
                    │         └─────────┘
                    │
                    ↓
             ┌───────────────┐
             │  Final Result │
             └───────────────┘

The system can perform multiple debugging cycles when execution fails.

## 🤖 Agentic AI

The project uses:

* **Multi-Agent System** — Analyzer, Executor, Fixer, Verification
* **Tool Use** — Python code execution
* **Shared State** — LangGraph state
* **Conditional Routing** — Dynamically chooses the next step
* **Feedback Loop** — Execution results are used to generate fixes
* **Iterative Debugging** — Retests corrected code

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* Monaco Editor
* Axios
* CSS

**Backend**

* Python
* FastAPI
* Pydantic

**AI & Agents**

* Groq (`openai/gpt-oss-20b`)
* LangChain
* LangGraph

## 📁 Project Structure

```text
AI-Code-Debugger/
│
├── backend/
│   ├── agents/
│   │   ├── analyzer.py
│   │   ├── fixer.py
│   │   └── supervisor.py
│   │
│   ├── graph/
│   │   ├── state.py
│   │   └── graph.py
│   │
│   ├── services/
│   │   ├── llm.py
│   │   └── code_runner.py
│   │
│   ├── main.py
│   └── requirements.txt
│
└── frontend/
    └── ...
```

## ⚙️ Setup

### Backend

```bash
cd backend
python -m venv venv
```

Activate the environment and install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env`:

```env
GROQ_API_KEY=your_groq_api_key
```

Run the backend:

```bash
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🎯 Example

**Input:**

```python
def divide(a, b):
    return a / b

print(divide(10, 0))
```

**Problem:**

```text
The program gives an error when I run it.
```

The system analyzes the error, generates a correction, executes the corrected code, and displays the verification result.

## 👩‍💻 Auth
