# Verifica se o script está sendo executado como administrador
function Test-IsAdmin {
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-IsAdmin)) {
    Write-Host "Solicitando privilégios administrativos..."
    Start-Process powershell -ArgumentList "-File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Navega até o diretório da aplicação
Set-Location -Path $PSScriptRoot

# Inicia o servidor Node.js
Write-Host "Iniciando o servidor Node.js..."
Start-Process -FilePath "npm" -ArgumentList "start" -NoNewWindow -Wait

# Abre o navegador padrão para localhost:3000
Start-Process "http://localhost:3000"

# Mantém o prompt aberto após a execução
Write-Host "Servidor iniciado. Pressione qualquer tecla para sair..."
[System.Console]::ReadKey() | Out-Null
