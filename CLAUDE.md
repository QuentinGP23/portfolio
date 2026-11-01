# CLAUDE.md — règles pour Claude dans ce repo

Portfolio de Quentin Geoffroy-Pitailler, développeur front-end. Next.js 16 (App Router), React 19, TypeScript 6 strict, Tailwind CSS 4, pnpm 12, Node 26, hébergé sur Vercel. Le contenu vit dans `content/` ; le back-office l'écrit par commit via l'API GitHub (CMS « git-based »).

Le plan validé fait foi : `docs/PLAN.md` ici (version publique), et sa version complète dans le projet Claude « Portfolio ». Toute déviation est proposée à Quentin et validée avant d'être appliquée.

## Règles, à suivre à la lettre

1. Mes phases s'enchaînent dans l'ordre du plan ; les tâches de Quentin avancent en parallèle. Récap en début de phase ; démo, checklist et débrief « entretien » en fin de phase.
2. Avant d'utiliser une librairie ou une API : vérifier sa version stable actuelle et sa documentation officielle, jamais de mémoire. Toujours la dernière version corrigée.
3. Une tâche = une branche (`feat/…`, `fix/…`, `chore/…`) et une PR avec aperçu Vercel ; CI verte obligatoire ; Quentin valide avant la fusion (squash). Seule exception : les commits de contenu du CMS. Jamais d'autre push direct sur `main`.
4. Code, noms, commentaires et commits en anglais (Conventional Commits) ; contenus du site et documentation en français. Commits avec la mention `Co-Authored-By: Claude`, auteur avec l'adresse GitHub noreply (configurée dans ce repo).
5. TypeScript strict, aucun `any` non justifié, zéro erreur de lint ; tests pour toute logique métier ; axe sur chaque page.
6. Sécurité : aucun secret dans le code, le chat ou les logs ; session vérifiée dans chaque page, Server Action et route de l'admin ; validation Zod de toute entrée ; `server-only` dans tout module qui touche un secret.
7. Accessibilité WCAG 2.2 AA et budgets de performance non négociables : une PR qui les dégrade est corrigée avant fusion.
8. Bloqué par un droit, un accès, un compte ou une décision : s'arrêter et demander à Quentin, ne jamais contourner.
9. Toute décision technique notable devient un ADR dans `docs/adr/`.
10. Les maquettes de référence vivent dans Claude Design ; tout écart entre le code et la maquette est signalé et validé.
11. Le repo est public : aucun email personnel, aucune donnée de repo privé au-delà des champs affichés, aucun brouillon sensible.

## Commandes

Ajoutées en phase 1 : installation, développement, lint, tests, build.
