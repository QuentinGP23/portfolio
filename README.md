# Portfolio — Quentin Geoffroy-Pitailler

Portfolio de développeur front-end, en construction. Le site sera statique, rapide et accessible, avec un back-office qui importe les repos GitHub et publie chaque modification par commit.

- Stack : Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, hébergement Vercel
- Plan de réalisation : [docs/PLAN.md](docs/PLAN.md)
- Décisions d'architecture : [docs/adr/](docs/adr/)
- Statut : phase 1, fondations techniques

## Démarrer en local

Prérequis : Node.js 26 et pnpm 12.

```bash
pnpm install
pnpm dev
```

Le site tourne sur http://localhost:3000. Copier `.env.example` en `.env.local` si besoin.

| Commande          | Rôle                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| `pnpm dev`        | Serveur de développement                                                |
| `pnpm lint`       | ESLint : règles Next.js et accessibilité strictes                       |
| `pnpm format`     | Prettier, avec le tri des classes Tailwind                              |
| `pnpm typecheck`  | Vérification des types TypeScript                                       |
| `pnpm test`       | Tests unitaires et de composants (Vitest, Testing Library, MSW)         |
| `pnpm build`      | Build de production                                                     |
| `pnpm test:e2e`   | Tests de bout en bout et d'accessibilité (Playwright, axe), après build |
| `pnpm lighthouse` | Scores Lighthouse sur un serveur lancé avec `pnpm start`                |

Les hooks Git (lefthook) formatent et vérifient les fichiers avant chaque commit, contrôlent le message (Conventional Commits) et les types avant chaque push.

## Licence

Le code est sous licence [MIT](LICENSE). Les contenus (`content/`) et les images (`public/media/`) restent © Quentin Geoffroy-Pitailler, tous droits réservés.

## Méthode

Ce projet est réalisé avec Claude, l'assistant IA d'Anthropic : plan, code, tests et revues se font à deux, et Quentin valide chaque étape. Les commits concernés portent la mention `Co-Authored-By: Claude`.
