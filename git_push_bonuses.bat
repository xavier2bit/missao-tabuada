@echo off
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\GitHub CLI;%PATH%"
cd /d "C:\Users\Admin\Downloads\Criativos"

echo === Git Status ===
git status

echo.
echo === Adding files ===
git add .

echo.
echo === Committing ===
git commit -m "Adiciona 5 materiais complementares em PDF A4: Cronograma 12 Semanas, Fichas Diarias, Caderno de Pintura, Desafios Semanais e Kit de Jogos da Tabuada"

echo.
echo === Pushing to GitHub ===
git push origin main

echo.
echo === Push Complete ===
