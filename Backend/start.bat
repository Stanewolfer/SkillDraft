@echo off
echo 🚀 Démarrage de l'application SkillDraft...
echo.

echo 🧹 Nettoyage des anciens conteneurs...
docker-compose down > nul 2>&1

echo 📦 Construction et démarrage des conteneurs...
docker-compose up --build -d

if %errorlevel% neq 0 (
    echo ❌ Erreur lors du démarrage des conteneurs
    pause
    exit /b 1
)

echo ⏳ Attente du démarrage complet de MySQL et du Backend...
timeout /t 30 /nobreak > nul

echo 📊 Vérification du statut des conteneurs...
docker-compose ps

echo 🔍 Vérification des logs...
echo --- Logs MySQL (dernières 10 lignes) ---
docker-compose logs --tail=10 mysql
echo.
echo --- Logs Backend (dernières 10 lignes) ---
docker-compose logs --tail=10 backend

echo.
echo 🔄 Tentative d'exécution des migrations Prisma...
docker-compose exec -T backend npx prisma migrate deploy

if %errorlevel% equ 0 (
    echo.
    echo ✅ Application démarrée avec succès!
    echo 📊 Backend accessible sur: http://localhost:3000
    echo 🗄️  MySQL accessible sur: localhost:3306
) else (
    echo.
    echo ⚠️  Migrations échouées. Tentative manuelle...
    echo Attendre 10 secondes supplémentaires...
    timeout /t 10 /nobreak > nul
    docker-compose exec -T backend npx prisma migrate deploy
    
    if %errorlevel% equ 0 (
        echo ✅ Migrations réussies au second essai!
    ) else (
        echo ❌ Migrations toujours en échec. Vérifiez les logs ci-dessus.
    )
)

echo.
echo 📋 Commandes utiles:
echo   Voir tous les logs: docker-compose logs -f
echo   Voir logs backend: docker-compose logs -f backend
echo   Voir logs MySQL: docker-compose logs -f mysql
echo   Arrêter: docker-compose down
echo   Redémarrer backend: docker-compose restart backend
echo.
pause