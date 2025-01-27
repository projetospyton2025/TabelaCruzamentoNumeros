# PowerShell Script (TabelaCruzamentoNumeros.ps1):
```powershell
# Create project structure
$projectPath = Get-Location
Write-Host "Setting up project in: $projectPath" -ForegroundColor Green

# Create directories
$directories = @(
    "static/css",
    "static/js",
    "templates"
)

# Criar os arquivos principais
Write-Host "Criando arquivos iniciais do projeto..." -ForegroundColor Cyan
New-Item -ItemType File -Path "$projectDir\TabelaCruzamentoNumeros.ps1" -Force
New-Item -ItemType File -Path "$projectDir\app.py" -Force
New-Item -ItemType File -Path "$projectDir\static\css\style.css" -Force
New-Item -ItemType File -Path "$projectDir\static\js\main.js" -Force
New-Item -ItemType File -Path "$projectDir\templates\index.html" -Force


foreach ($dir in $directories) {
    New-Item -Path $dir -ItemType Directory -Force
    Write-Host "Created directory: $dir" -ForegroundColor Cyan
}

# Create virtual environment
python -m venv venv
Write-Host "Created virtual environment" -ForegroundColor Green

# Activate virtual environment
.\venv\Scripts\Activate
Write-Host "Activated virtual environment" -ForegroundColor Green

# Create requirements.txt if it doesn't exist
if (-not (Test-Path "requirements.txt")) {
    @"
flask==2.0.1
pandas==1.3.3
openpyxl==3.0.9
"@ | Out-File -FilePath "requirements.txt" -Encoding utf8
    Write-Host "Created requirements.txt with basic dependencies" -ForegroundColor Yellow
}

# Install dependencies
pip install -r requirements.txt
Write-Host "Installed dependencies" -ForegroundColor Green

Write-Host "Setup complete! Your project is ready." -ForegroundColor Green
```