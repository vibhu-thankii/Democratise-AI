import os
import google.generativeai as genai
from dotenv import load_dotenv
from tqdm import tqdm

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL = genai.GenerativeModel('models/gemini-1.5-pro-latest')

# Define which folders to ignore
IGNORE_DIRS = {'__pycache__', 'venv', 'node_modules', '.git'}

def get_all_code_files(base_path, extensions=('.py', '.js', '.ts')):
    code_files = []
    for root, dirs, files in os.walk(base_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        for file in files:
            if file.endswith(extensions):
                code_files.append(os.path.join(root, file))
    return code_files

def summarize_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    prompt = f"Summarize this code file. Include: purpose, key functions/classes, and how it fits into a backend system:\n\n{content}"
    try:
        response = MODEL.generate_content(prompt)
        return f"## {os.path.basename(filepath)}\nPath: `{filepath}`\n\n{response.text}\n"
    except Exception as e:
        return f"## {os.path.basename(filepath)}\nPath: `{filepath}`\n\nError summarizing: {e}\n"

def main():
    base_path = input("Enter your backend folder path (e.g. ./backend): ").strip()
    output_file = "backend-summary.md"
    
    files = get_all_code_files(base_path)
    print(f"Found {len(files)} code files. Summarizing...")

    with open(output_file, 'w', encoding='utf-8') as out:
        out.write(f"# Backend Summary for {base_path}\n\n")
        for file in tqdm(files):
            summary = summarize_file(file)
            out.write(summary + "\n\n")

    print(f"\n✅ Summary written to {output_file}")

if __name__ == "__main__":
    main()
