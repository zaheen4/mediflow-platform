# Fix Backend .gitignore

## Goal
The backend `.gitignore` references `myenv/` but the README instructs users to create `mediflowenv/`. Fix this mismatch and ensure all necessary patterns are covered.

## Files to Touch
- `backend/.gitignore`

## Current State
The file has `myenv/` at the bottom but the README says:
```
python -m venv mediflowenv
```
(Note: The backend is now Node.js, so venv references should be removed entirely.)

## Steps

1. Replace the entire contents of `backend/.gitignore` with:
```
# Node.js
node_modules/
npm-debug.log
yarn-error.log

# Logs
logs/
*.log
*.log.*

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# dotenv environment variables file
.env

# MacOS
.DS_Store

# IDEs and editors
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Miscellaneous
*.swp
*.swo
*.bak
*.tmp

# Build directories
dist/
build/

# Python leftovers (if any)
__pycache__/
*.pyc
*.pyo
venv/
env/
mediflowenv/
```

## Verification
- `mediflowenv/` and `__pycache__/` are now covered
- `.env` is already covered (confirm with a `git status` in the backend folder)
