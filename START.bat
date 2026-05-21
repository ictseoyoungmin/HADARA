@echo off
setlocal
set ROOT=%~dp0
cd /d "%ROOT%"
if not exist node_modules (
  echo [HADARA] node_modules not found. Running npm install...
  npm install
)
npm run dev -- %*
