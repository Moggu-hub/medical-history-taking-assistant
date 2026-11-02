@echo off
chcp 65001 >nul
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%LOCALAPPDATA%\Programs\Git\ucrt64\bin;%PATH%"
echo ====================================================
echo  Medical History Assistant - GitHub Sync Backup
echo  Repository: https://github.com/Moggu-hub/medical-history-taking-assistant.git
echo ====================================================
echo.
echo Connecting to GitHub and pushing 'main' branch...
echo (If a browser window or login prompt appears, please authorize your GitHub account)
echo.
git push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ====================================================
    echo  [SUCCESS] Backup to GitHub completed successfully!
    echo ====================================================
) else (
    echo ====================================================
    echo  [NOTICE] If push failed due to authentication, you can also use a GitHub Personal Access Token (PAT).
    echo ====================================================
)
echo.
pause
