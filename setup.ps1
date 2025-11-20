# StudyBuddy Setup Script
# This script helps set up the development environment

Write-Host "StudyBuddy Setup Script" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "npm not found" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "PostgreSQL found: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "PostgreSQL not found in PATH. Make sure PostgreSQL 14+ is installed" -ForegroundColor Yellow
}

# Check Ollama
Write-Host "Checking Ollama..." -ForegroundColor Yellow
try {
    $ollamaVersion = ollama --version
    Write-Host "Ollama found: $ollamaVersion" -ForegroundColor Green
} catch {
    Write-Host "Ollama not found. Please install from https://ollama.ai" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "Dependencies installed" -ForegroundColor Green

# Setup .env file
Write-Host ""
if (Test-Path ".env") {
    Write-Host ".env file already exists, skipping..." -ForegroundColor Yellow
} else {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ".env file created" -ForegroundColor Green
    Write-Host "Please edit .env file with your database credentials" -ForegroundColor Yellow
}

# Check if Ollama model is available
Write-Host ""
Write-Host "Checking Ollama model..." -ForegroundColor Yellow
try {
    $ollamaList = ollama list 2>&1
    if ($ollamaList -match "llama3.1:8b") {
        Write-Host "llama3.1:8b model found" -ForegroundColor Green
    } else {
        Write-Host "llama3.1:8b model not found" -ForegroundColor Yellow
        Write-Host "  Run: ollama pull llama3.1:8b" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Could not check Ollama models. Make sure Ollama is running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================" -ForegroundColor Cyan
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Edit .env file with your database credentials" -ForegroundColor White
Write-Host "2. Pull Ollama model: ollama pull llama3.1:8b" -ForegroundColor White
Write-Host "3. Setup database: npm run db:generate; npm run db:push; npm run db:seed" -ForegroundColor White
Write-Host "4. Start dev server: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor Cyan
