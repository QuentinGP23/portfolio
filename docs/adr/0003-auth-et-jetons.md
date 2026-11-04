# 0003 — Connexion à l'admin et jetons GitHub

- Statut : accepté (mise en œuvre en phase 7)
- Date : 2026-11-01 (décisions D4, D5 et D6 du plan)

## Contexte

Un seul utilisateur, Quentin, doit pouvoir se connecter à l'admin. L'admin lit ses repos (y compris privés et ceux de camarades) et écrit dans le repo du portfolio. Aucun jeton ne doit cumuler un accès large et le droit d'écrire.

## Décision

- Connexion par OAuth GitHub avec Better Auth en mode sans base : session chiffrée dans un cookie `HttpOnly`, `Secure`, `SameSite=Lax`, durée 8 h.
- Liste blanche sur l'identifiant GitHub numérique de Quentin ; session revérifiée dans chaque page, Server Action et route de l'admin, pas seulement dans `proxy.ts`.
- L'application OAuth ne demande aucun scope de dépôt : elle sert à l'identité et à la liste des repos publics, collaborations comprises (à vérifier au début de la phase 7, sinon ajout par URL).
- `REPOS_READ_TOKEN` : jeton fin en lecture seule sur les repos de Quentin (repos privés, stats).
- `PORTFOLIO_WRITE_TOKEN` : jeton fin limité au repo `portfolio`, Contents en écriture.
- Les deux jetons vivent uniquement dans l'environnement Production de Vercel, jamais dans les aperçus, et expirent après un an avec rappel.

## Conséquences

- Une fuite de la session ne donne aucun droit d'écriture sur les repos.
- Le repo privé d'un camarade passe par une fiche manuelle.
- Les aperçus Vercel affichent les stats de l'import plutôt que des stats fraîches.

## Alternatives écartées

- OAuth avec le scope `repo` : écriture sur tous les repos, trop large.
- GitHub App : plus fine, mais elle devrait être installée sur les comptes des camarades.
- Auth.js v5 : toujours en bêta et en maintenance ; Arctic n'est plus maintenu depuis juillet 2026.
