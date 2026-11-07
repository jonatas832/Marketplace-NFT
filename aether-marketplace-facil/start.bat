@echo off
title Aether NFT Marketplace
cd /d "%~dp0"
echo ==========================================
echo       AETHER NFT MARKETPLACE
echo ==========================================
where node >nul 2>nul
if errorlevel 1 (
  echo ERRO: Node.js nao encontrado.
  echo Instale a versao LTS em https://nodejs.org/
  pause
  exit /b 1
)
if not exist node_modules (
  echo Instalando dependencias pela primeira vez...
  call npm install
  if errorlevel 1 (
    echo Falha ao instalar dependencias.
    pause
    exit /b 1
  )
)
echo Iniciando o marketplace...
call npm run dev
pause