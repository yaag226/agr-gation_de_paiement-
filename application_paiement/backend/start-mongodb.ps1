# Script PowerShell pour démarrer MongoDB sur Windows

Write-Host "🚀 Script de démarrage MongoDB" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

# Vérifier si MongoDB est installé
Write-Host "📋 Vérification de l'installation de MongoDB..." -ForegroundColor Yellow

$mongoPath = "C:\Program Files\MongoDB\Server"
$mongodExe = $null

# Chercher mongod.exe dans les versions installées
if (Test-Path $mongoPath) {
    $versions = Get-ChildItem $mongoPath -Directory | Sort-Object Name -Descending
    foreach ($version in $versions) {
        $testPath = Join-Path $version.FullName "bin\mongod.exe"
        if (Test-Path $testPath) {
            $mongodExe = $testPath
            Write-Host "✅ MongoDB trouvé: $mongodExe" -ForegroundColor Green
            break
        }
    }
}

if (-not $mongodExe) {
    Write-Host "❌ MongoDB n'est pas installé!" -ForegroundColor Red
    Write-Host "`n📥 Téléchargez MongoDB depuis:" -ForegroundColor Yellow
    Write-Host "   https://www.mongodb.com/try/download/community`n" -ForegroundColor Cyan

    $response = Read-Host "Voulez-vous ouvrir le lien de téléchargement? (O/N)"
    if ($response -eq "O" -or $response -eq "o") {
        Start-Process "https://www.mongodb.com/try/download/community"
    }
    exit 1
}

# Vérifier si MongoDB est déjà en cours d'exécution
Write-Host "`n🔍 Vérification si MongoDB est déjà en cours d'exécution..." -ForegroundColor Yellow

$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB est déjà en cours d'exécution!" -ForegroundColor Green
    Write-Host "   PID: $($mongoProcess.Id)" -ForegroundColor Cyan
    exit 0
}

# Vérifier si le service MongoDB existe
$mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "✅ Le service MongoDB est déjà démarré!" -ForegroundColor Green
        exit 0
    } else {
        Write-Host "🔧 Démarrage du service MongoDB..." -ForegroundColor Yellow
        try {
            Start-Service MongoDB
            Write-Host "✅ Service MongoDB démarré avec succès!" -ForegroundColor Green
            exit 0
        } catch {
            Write-Host "⚠️  Impossible de démarrer le service. Tentative de démarrage manuel..." -ForegroundColor Yellow
        }
    }
}

# Créer le dossier de données si nécessaire
$dataPath = "C:\data\db"
if (-not (Test-Path $dataPath)) {
    Write-Host "`n📁 Création du dossier de données: $dataPath" -ForegroundColor Yellow
    try {
        New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
        Write-Host "✅ Dossier créé!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors de la création du dossier: $_" -ForegroundColor Red
        Write-Host "   Essayez de créer manuellement le dossier: $dataPath" -ForegroundColor Yellow
        exit 1
    }
}

# Démarrer MongoDB manuellement
Write-Host "`n🚀 Démarrage de MongoDB..." -ForegroundColor Yellow
Write-Host "   Chemin: $mongodExe" -ForegroundColor Cyan
Write-Host "   Data: $dataPath`n" -ForegroundColor Cyan

try {
    Start-Process -FilePath $mongodExe -ArgumentList "--dbpath=`"$dataPath`"" -NoNewWindow -PassThru
    Start-Sleep -Seconds 2

    # Vérifier si le processus a démarré
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "✅ MongoDB démarré avec succès!" -ForegroundColor Green
        Write-Host "   PID: $($mongoProcess.Id)" -ForegroundColor Cyan
        Write-Host "`n📝 MongoDB est maintenant en cours d'exécution sur: mongodb://localhost:27017" -ForegroundColor Green
        Write-Host "`n⚠️  IMPORTANT: Ne fermez pas cette fenêtre tant que vous utilisez MongoDB!" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Échec du démarrage de MongoDB" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors du démarrage: $_" -ForegroundColor Red
    exit 1
}
