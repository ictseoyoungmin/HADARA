@echo off
setlocal
set ROOT=%~dp0
cd /d "%ROOT%"
npm run dev -- %*
