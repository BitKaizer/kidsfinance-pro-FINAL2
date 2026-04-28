@echo off
echo ================================================
echo   KidsFinance Pro - Automatisch zu GitHub laden
echo ================================================
echo.

:: Git installieren falls nicht vorhanden
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git wird installiert...
    winget install Git.Git -e --source winget
    echo Bitte dieses Fenster schliessen und nochmal starten!
    pause
    exit
)

echo Git gefunden!
echo.
echo Bitte gib deine GitHub Infos ein:
echo.
set /p GITHUB_USER=Dein GitHub Benutzername (z.B. BitKaizer): 
set /p REPO_NAME=Repo Name (z.B. kidsfinance-pro): 
echo.
echo Deine Email fuer Git (dieselbe wie bei GitHub):
set /p GIT_EMAIL=Email: 
set /p GIT_NAME=Dein Name: 

echo.
echo Starte Upload...
echo.

:: Git konfigurieren
git config --global user.email "%GIT_EMAIL%"
git config --global user.name "%GIT_NAME%"

:: In den richtigen Ordner wechseln (Ordner wo diese .bat Datei liegt)
cd /d "%~dp0"

:: Git initialisieren und hochladen
git init
git add .
git commit -m "KidsFinance Pro - Erster Upload"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
git push -u origin main --force

echo.
echo ================================================
echo   FERTIG! Gehe jetzt zu:
echo   https://github.com/%GITHUB_USER%/%REPO_NAME%/actions
echo   und warte bis der Build fertig ist (ca. 5 Min)
echo ================================================
echo.
pause
