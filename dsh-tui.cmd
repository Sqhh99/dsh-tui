@echo off
rem Launch the dsh-tui profile through the official dsh CLI.
rem --resume reads ~/.dsh-tui\resume.txt then ~/.dsh-cc\resume.txt
rem and sets DSH_TUI_RESUME_SESSION.
setlocal
if not defined NODE_ENV set "NODE_ENV=production"
set "WORKSPACE=%DSH_TUI_WORKSPACE%"
if "%WORKSPACE%"=="" set "WORKSPACE=%DSH_CC_WORKSPACE%"
if "%WORKSPACE%"=="" set "WORKSPACE=%CD%"
cd /d "%WORKSPACE%"

where dsh >nul 2>nul
if errorlevel 1 (
  echo [dsh-tui] dsh CLI not found. Install: npm install -g @deepseek-ai/dsh 1>&2
  exit /b 1
)

set "ARGS="
:parse
if "%~1"=="" goto :run
if /i "%~1"=="--resume" (
  if exist "%USERPROFILE%\.dsh-tui\resume.txt" (
    set /p DSH_TUI_RESUME_SESSION=<"%USERPROFILE%\.dsh-tui\resume.txt"
  ) else if exist "%USERPROFILE%\.dsh-cc\resume.txt" (
    set /p DSH_TUI_RESUME_SESSION=<"%USERPROFILE%\.dsh-cc\resume.txt"
  )
) else (
  set "ARGS=%ARGS% "%~1""
)
shift
goto :parse

:run
rem Ctrl+C's restart leaves with exit code 75 (RESTART_EXIT_CODE in
rem src/update.ts). Relaunch here rather than letting the TUI respawn itself,
rem so repeated restarts do not stack one live process each. DSH_TUI_LAUNCHER
rem is what tells the TUI this loop is watching.
set "DSH_TUI_LAUNCHER=1"
:relaunch
@dsh --profile dsh-tui %ARGS%
if errorlevel 76 goto :done
if not errorlevel 75 goto :done
rem The TUI wrote the session id before leaving; resume the same conversation.
if exist "%USERPROFILE%\.dsh-tui\resume.txt" (
  set /p DSH_TUI_RESUME_SESSION=<"%USERPROFILE%\.dsh-tui\resume.txt"
) else if exist "%USERPROFILE%\.dsh-cc\resume.txt" (
  set /p DSH_TUI_RESUME_SESSION=<"%USERPROFILE%\.dsh-cc\resume.txt"
)
goto :relaunch

:done
endlocal
