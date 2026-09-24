import subprocess
import tempfile
import os


def run_python_code(code: str):

    file_path = None

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".py",
            delete=False
        ) as file:

            file.write(code)
            file_path = file.name

        result = subprocess.run(
            ["python", file_path],
            capture_output=True,
            text=True,
            timeout=5
        )

        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        }

    except subprocess.TimeoutExpired:
        return {
            "success": False,
            "output": "",
            "error": "Execution timed out."
        }

    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": str(e)
        }

    finally:
        if file_path and os.path.exists(file_path):
            os.remove(file_path)