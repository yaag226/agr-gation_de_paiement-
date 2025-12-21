@echo off
REM Script de Configuration Automatique pour Windows
REM Application d'Agrégation de Paiement

echo ==========================================
echo Configuration de l'Application de Paiement
echo ==========================================
echo.

REM Vérifier Node.js
echo [INFO] Verification de Node.js...
where node >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [OK] Node.js %NODE_VERSION% installe
) else (
    echo [ERREUR] Node.js n'est pas installe. Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier npm
echo [INFO] Verification de npm...
where npm >nul 2>nul
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
    echo [OK] npm %NPM_VERSION% installe
) else (
    echo [ERREUR] npm n'est pas installe
    pause
    exit /b 1
)

REM Vérifier MongoDB
echo [INFO] Verification de MongoDB...
where mongod >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] MongoDB est installe
    set MONGO_INSTALLED=true
) else (
    echo [WARN] MongoDB n'est pas installe ou n'est pas dans le PATH
    echo [WARN] Options:
    echo [WARN]   1. Installer MongoDB localement (voir SETUP_GUIDE.md)
    echo [WARN]   2. Utiliser MongoDB Atlas (cloud gratuit)
    echo [WARN]   3. Utiliser Docker: docker run -d -p 27017:27017 mongo:6.0
    set MONGO_INSTALLED=false
)

echo.
echo ==========================================
echo Installation des Dependances
echo ==========================================
echo.

REM Installation Backend
echo [INFO] Installation des dependances backend...
cd backend
if not exist "node_modules" (
    call npm install
    if %errorlevel% equ 0 (
        echo [OK] Dependances backend installees
    ) else (
        echo [ERREUR] Echec de l'installation des dependances backend
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependances backend deja installees
)

REM Configuration Backend .env
if not exist ".env" (
    echo [INFO] Creation du fichier .env backend...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Fichier .env backend cree a partir de .env.example
        echo [WARN] N'oubliez pas de modifier .env avec vos propres valeurs
    ) else (
        echo [ERREUR] Fichier .env.example introuvable
    )
) else (
    echo [OK] Fichier .env backend existe deja
)

cd ..

REM Installation Frontend
echo [INFO] Installation des dependances frontend...
cd frontend
if not exist "node_modules" (
    call npm install
    if %errorlevel% equ 0 (
        echo [OK] Dependances frontend installees
    ) else (
        echo [ERREUR] Echec de l'installation des dependances frontend
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependances frontend deja installees
)

REM Configuration Frontend .env
if not exist ".env" (
    echo [INFO] Creation du fichier .env frontend...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] Fichier .env frontend cree
    ) else (
        echo [ERREUR] Fichier .env.example introuvable
    )
) else (
    echo [OK] Fichier .env frontend existe deja
)

cd ..

echo.
echo ==========================================
echo Resume de l'Installation
echo ==========================================
echo.

echo [OK] Node.js installe
echo [OK] npm installe
echo [OK] Dependances backend installees
echo [OK] Dependances frontend installees
echo [OK] Fichiers .env configures

if "%MONGO_INSTALLED%"=="true" (
    echo [OK] MongoDB installe
) else (
    echo [WARN] MongoDB non detecte
)

echo.
echo ==========================================
echo Prochaines Etapes
echo ==========================================
echo.

if "%MONGO_INSTALLED%"=="false" (
    echo [WARN] 1. Installer et demarrer MongoDB (voir SETUP_GUIDE.md)
    echo [WARN]    OU utiliser MongoDB Atlas (cloud)
    echo [WARN]    OU utiliser Docker: docker run -d -p 27017:27017 mongo:6.0
    echo.
)

echo [INFO] Initialiser la base de donnees avec des donnees de test:
echo    cd backend
echo    npm run seed
echo.

echo [INFO] Demarrer le backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.

echo [INFO] Demarrer le frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.

echo [INFO] Acceder a l'application:
echo    Frontend: http://localhost:5173
echo    Backend API: http://localhost:5000
echo.

echo [INFO] Comptes de test (apres seed):
echo    Admin: admin@payment.com / Admin123!
echo    Merchant: merchant1@test.com / Merchant123!
echo.

echo [OK] Configuration terminee!
echo.
echo Pour plus d'informations, consultez:
echo   - README.md
echo   - SETUP_GUIDE.md
echo   - QUICKSTART.md
echo.

pause
