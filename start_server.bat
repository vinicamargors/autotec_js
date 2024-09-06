@echo off
:: Verifica se o script está sendo executado como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando privilégios administrativos...
    powershell -Command "Start-Process cmd -ArgumentList '/c \"%~dp0start_server.bat\"' -Verb runAs"
    exit /b
)

:: Navega até o diretório da aplicação
cd /d "%~dp0"

:: Inicia o servidor Node.js
echo Iniciando o servidor Node.js...
npm start

:: Mantém o prompt aberto após a execução
echo Pressione qualquer tecla para sair...
pause
