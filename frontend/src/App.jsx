import { useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import axios from "axios";
import "./App.css";

const DEFAULT_CODE = `def divide(a, b):
    return a / b

print(divide(10, 0))`;

const DEFAULT_PROBLEM = "The program gives an error when I run it.";
const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [problem, setProblem] = useState(DEFAULT_PROBLEM);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("analysis");

  const debugCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);
    setActiveTab("analysis");

    try {
      axios.post(`${API_URL}/debug`, {
    code,
    problem
   });

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Backend connection failed. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };


  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setProblem(DEFAULT_PROBLEM);
    setResult(null);
    setActiveTab("analysis");
  };

  const verificationSuccess =
    result?.verification?.success === true;

  return (
    <div className="app">

      {/* TOP NAVBAR */}
      <header className="navbar">

        <div className="brand">
          <div className="brand-icon">⌘</div>

          <div>
            <div className="brand-name">AI Debugger</div>
            <div className="brand-subtitle">
              Agentic Coding Assistant
            </div>
          </div>
        </div>

        <div className="nav-center">
          <span className="online-dot"></span>
          Agent System Online
        </div>

        <div className="nav-right">
          <span className="language-badge">Python</span>

          <button
            className="reset-btn"
            onClick={resetCode}
          >
            ↻ Reset
          </button>
        </div>

      </header>


      {/* MAIN WORKSPACE */}
      <main className="workspace">

        {/* LEFT EDITOR */}
        <section className="editor-panel">

          <div className="panel-top">

            <div className="file-info">
              <span className="python-icon">PY</span>
              <span>main.py</span>
            </div>

            <div className="editor-actions">

              <button
                className="debug-button"
                onClick={debugCode}
                disabled={loading}
              >
                {loading ? "⟳ Debugging..." : "🐛 Debug"}
              </button>

            </div>

          </div>


          <div className="editor-container">

            <Editor
              height="100%"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 15,
                minimap: {
                  enabled: false
                },
                automaticLayout: true,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                padding: {
                  top: 18
                },
                smoothScrolling: true,
                cursorBlinking: "smooth",
                roundedSelection: false
              }}
            />

          </div>


          {/* PROBLEM INPUT */}
          <div className="problem-section">

            <div className="problem-header">
              <span>🐛 Problem Description</span>
              <span className="optional">Optional</span>
            </div>

            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the bug or error..."
            />

          </div>

        </section>


        {/* RIGHT AI PANEL */}
        <section className="ai-panel">

          <div className="ai-header">

            <div className="ai-title">
              <div className="ai-icon">✦</div>

              <div>
                <h2>AI Debugger</h2>
                <span>Multi-agent analysis</span>
              </div>
            </div>

            <div className="status-pill">
              <span></span>
              Ready
            </div>

          </div>


          {/* LOADING */}
          {loading && (

            <div className="loading-view">

              <div className="loading-icon">✦</div>

              <h2>AI is debugging...</h2>

              <p>
                Multiple agents are analyzing and
                testing your code.
              </p>


              <div className="workflow-loading">

                <WorkflowItem
                  icon="🔍"
                  title="Analyzer Agent"
                  text="Analyzing source code"
                  active
                />

                <WorkflowItem
                  icon="🧪"
                  title="Executor Agent"
                  text="Testing program"
                />

                <WorkflowItem
                  icon="🔧"
                  title="Fix Agent"
                  text="Generating correction"
                />

                <WorkflowItem
                  icon="✓"
                  title="Verification Agent"
                  text="Retesting solution"
                />

              </div>

            </div>

          )}


          {/* EMPTY STATE */}
          {!loading && !result && (

            <div className="empty-view">

              <div className="empty-icon">
                🐛
              </div>

              <h2>Ready to Debug</h2>

              <p>
                Submit your Python code and describe
                the problem. The AI agents will analyze,
                repair and verify your solution.
              </p>

              <div className="feature-list">

                <div>✓ Detect bugs</div>
                <div>✓ Explain root cause</div>
                <div>✓ Generate fixes</div>
                <div>✓ Verify execution</div>

              </div>

            </div>

          )}


          {/* RESULTS */}
          {!loading && result && (

            <div className="results">

              {/* STATUS */}
              <div
                className={
                  verificationSuccess
                    ? "verification success"
                    : "verification failure"
                }
              >

                <div className="verification-icon">
                  {verificationSuccess ? "✓" : "!"}
                </div>

                <div>

                  <strong>
                    {verificationSuccess
                      ? "Fix Verified"
                      : "Issue Still Detected"}
                  </strong>

                  <p>
                    {result.verification?.message}
                  </p>

                </div>

              </div>


              {/* BUG SUMMARY */}
              <div className="card">

                <div className="card-title">
                  <span>🐛</span>
                  Bug Summary
                </div>

                <div className="bug-grid">

                  <InfoItem
                    label="Type"
                    value={result.bug?.type}
                  />

                  <InfoItem
                    label="Severity"
                    value={result.bug?.severity}
                    badge
                  />

                  <InfoItem
                    label="Error"
                    value={result.bug?.error}
                  />

                  <InfoItem
                    label="Location"
                    value={result.bug?.location}
                  />

                </div>

              </div>


              {/* ROOT CAUSE */}
              <div className="card">

                <div className="card-title">
                  <span>🎯</span>
                  Root Cause
                </div>

                <p className="root-cause">
                  {result.bug?.root_cause}
                </p>

              </div>


              {/* TABS */}
              <div className="result-tabs">

                <button
                  className={
                    activeTab === "analysis"
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveTab("analysis")}
                >
                  🧠 Analysis
                </button>

                <button
                  className={
                    activeTab === "fixed"
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveTab("fixed")}
                >
                  🔧 Fixed Code
                </button>

                <button
                  className={
                    activeTab === "diff"
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveTab("diff")}
                >
                  ⇄ Diff
                </button>

                <button
                  className={
                    activeTab === "console"
                      ? "active"
                      : ""
                  }
                  onClick={() => setActiveTab("console")}
                >
                  🧪 Console
                </button>

              </div>


              {/* ANALYSIS TAB */}
              {activeTab === "analysis" && (

                <div className="tab-content">

                  <h3>Why this happened</h3>

                  <p>
                    {result.analysis}
                  </p>

                  <div className="explanation-box">

                    <div className="explanation-title">
                      💡 AI Explanation
                    </div>

                    <p>
                      {result.fix_explanation}
                    </p>

                  </div>

                </div>

              )}


              {/* FIXED CODE */}
              {activeTab === "fixed" && (

                <div className="code-result">

                  <div className="code-result-header">
                    <span>✓ AI Generated Fix</span>

                    <button
                      onClick={() =>
                        setCode(result.fixed_code)
                      }
                    >
                      Use Fix
                    </button>
                  </div>

                  <Editor
                    height="300px"
                    language="python"
                    theme="vs-dark"
                    value={result.fixed_code}
                    options={{
                      readOnly: true,
                      minimap: {
                        enabled: false
                      },
                      fontSize: 13
                    }}
                  />

                </div>

              )}


              {/* DIFF */}
              {activeTab === "diff" && (

                <div className="diff-container">

                  <DiffEditor
                    height="330px"
                    language="python"
                    theme="vs-dark"
                    original={result.original_code}
                    modified={result.fixed_code}
                    options={{
                      readOnly: true,
                      renderSideBySide: true,
                      minimap: {
                        enabled: false
                      },
                      fontSize: 13
                    }}
                  />

                </div>

              )}


              {/* CONSOLE */}
              {activeTab === "console" && (

                <div className="console-result">

                  <div className="console-title">
                    <span>●</span>
                    Execution Result
                  </div>

                  {result.verification?.output && (

                    <pre>
                      {result.verification.output}
                    </pre>

                  )}

                  {result.verification?.error && (

                    <pre className="console-error">
                      {result.verification.error}
                    </pre>

                  )}

                  {!result.verification?.output &&
                    !result.verification?.error && (

                      <span className="muted">
                        No console output.
                      </span>

                  )}

                </div>

              )}


              {/* AGENT WORKFLOW */}
              <div className="card workflow-card">

                <div className="card-title">
                  <span>⚡</span>
                  Agent Workflow
                </div>

                <div className="workflow">

                  {result.agent_workflow?.map(
                    (item, index) => (

                      <div
                        className="workflow-item"
                        key={index}
                      >

                        <div className="workflow-number">
                          ✓
                        </div>

                        <div className="workflow-line"></div>

                        <div>

                          <strong>
                            {item.agent}
                          </strong>

                          <p>
                            {item.message}
                          </p>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

        </section>

      </main>


      {/* BOTTOM STATUS BAR */}
      <footer className="statusbar">

        <div>
          <span className="status-green"></span>
          Backend Connected
        </div>

        <div>
          Agentic Debugging Pipeline
        </div>

        <div>
          Python • AI Debugger
        </div>

      </footer>

    </div>
  );
}


/* SMALL COMPONENTS */

function WorkflowItem({
  icon,
  title,
  text,
  active
}) {
  return (
    <div
      className={
        active
          ? "loading-agent active"
          : "loading-agent"
      }
    >
      <span>{icon}</span>

      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>

    </div>
  );
}


function InfoItem({
  label,
  value,
  badge
}) {
  return (
    <div className="info-item">

      <span>{label}</span>

      {badge ? (
        <strong className="severity">
          {value}
        </strong>
      ) : (
        <strong>{value || "Unknown"}</strong>
      )}

    </div>
  );
}


export default App;c