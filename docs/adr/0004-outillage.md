# 0004 — Outillage : Node, pnpm, TypeScript, lint, tests, CI

- Statut : accepté
- Date : 2026-11-04 (décisions D11 à D14 du plan)

## Contexte

L'outillage doit attraper un maximum d'erreurs avant la revue, protéger la chaîne d'approvisionnement et rester à jour sans effort.

## Décision

- **Node 26 LTS** (LTS active depuis le 28 octobre 2026, version par défaut de Vercel), figé par `.node-version` et `engines`.
- **pnpm 12** : une version doit avoir 24 h avant d'être installée (`minimumReleaseAge`), sauf Next.js et React pour appliquer leurs correctifs de sécurité le jour même ; les scripts d'installation des dépendances sont refusés sauf accord dans `allowBuilds`. Aucun n'est autorisé : sharp et unrs-resolver livrent leurs binaires en dépendances optionnelles, et les hooks Git sont installés par notre script `prepare`, pas par celui de lefthook.
- **TypeScript 6.0** en mode strict avec `noUncheckedIndexedAccess` ; TypeScript 7 attendra que typescript-eslint le prenne en charge (la version 8.72.1 s'arrête à TypeScript 6.0).
- **ESLint** en configuration plate : `eslint-config-next` (core-web-vitals, typescript) et les règles strictes de jsx-a11y. **Prettier** avec le tri des classes Tailwind.
- **Tests** : Vitest 5 et Testing Library (jsdom), MSW 3 pour simuler GitHub sans réseau, Playwright (Chromium, WebKit, mobile) avec axe pour l'accessibilité. L'alias `@/` est résolu par l'option native `resolve.tsconfigPaths` de Vite 8, plutôt que par `vite-tsconfig-paths` que suggère la documentation Next.js : ce paquet dépend de tsconfck, marqué non maintenu.
- **Lighthouse 13** lancé par un script maison en CI sur `next start` : 3 passes, médiane, seuils du plan, et budget JavaScript (voir plus bas). Lighthouse CI (`@lhci/cli`) n'a plus publié de version depuis juin 2025 ; les aperçus Vercel sont servis en `noindex` et fausseraient le score SEO.
- **Hooks Git** avec lefthook (format et lint des fichiers modifiés, Conventional Commits via commitlint, types avant push).
- **CI GitHub Actions**, actions épinglées par SHA de commit ; `pnpm audit` bloquant à partir du niveau « high » ; CodeQL ; Dependabot pour npm et les actions ; télémétrie Next.js désactivée en CI.

## Conséquences

- Un correctif publié depuis moins de 24 h n'est installé que pour Next.js et React ; pour les autres, un jour d'attente.
- Les plugins de lint embarqués par `eslint-config-next` déclarent encore ESLint 9 au maximum : avec ESLint 10, avertissements de dépendances attendus (voir la section suivante).
- Au 4 novembre 2026, `pnpm audit` signale deux alertes « moderate », toutes deux dans l'outillage de développement (minimatch via ESLint, glob via Lighthouse) ; rien n'est livré aux visiteurs. Dependabot proposera les correctifs dès leur sortie.

## Statut d'ESLint 10

Retenu. `pnpm lint` passe, et un fichier sonde rempli d'erreurs volontaires a confirmé que chaque plugin fonctionne avec ESLint 10.14 : react, react-hooks (avec les règles du React Compiler), @next/next, import, jsx-a11y et typescript-eslint, soit 140 règles actives. Seuls subsistent les avertissements de dépendances pairs d'eslint-plugin-import, eslint-plugin-jsx-a11y et eslint-plugin-react.

## Budget JavaScript

Socle mesuré en phase 1 sur la page d'accueil provisoire : 140,3 Kio de JavaScript compressé (gzip, `next start`), soit Next.js 16.4.5 et React 19.3.1 sans code applicatif. Le plan accorde 30 Kio de plus au maximum par page : le script Lighthouse échoue au-delà de 171 Kio. Sur Vercel, la compression Brotli rend ces fichiers un peu plus légers.

## Alternatives écartées

- Biome : plus rapide, mais 12 règles Next.js contre 22 et une couverture accessibilité moins complète.
- Jest, Cypress : moins adaptés à Vite et à la configuration actuelle de Next.js.
- npm : pas de filtrage des scripts d'installation ni d'âge minimum par défaut.
