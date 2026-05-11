@echo off
echo ============================================
echo  DoorGrill Super — Gerando PNGs...
echo ============================================
cd /d "%~dp0"
node capture.js
echo.
echo Pressione qualquer tecla para fechar.
pause > nul
