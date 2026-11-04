# 0002 — Contenu stocké dans le repo, écrit par commit

- Statut : accepté
- Date : 2026-11-01 (décisions D2, D3 et D17 du plan)

## Contexte

Le back-office doit permettre d'importer un repo GitHub, de compléter sa fiche (titre, images, description) et de la publier, sans base de données à maintenir ni coût d'hébergement.

## Décision

- Les contenus sont des fichiers JSON et Markdown dans `content/`, validés par des schémas Zod.
- Les images sont compressées dans le navigateur, réencodées côté serveur (AVIF ou WebP, plus un JPEG pour les images de partage), puis versionnées dans `public/media/`.
- Le back-office crée un seul commit par enregistrement via l'API Git Data de GitHub ; la mise à jour de `main` se fait sans `force` et échoue si le repo a bougé.
- `next build` revalide tout `content/` : un contenu invalide fait échouer le build et la version en ligne reste en place.
- Le repo est public : tout commit l'est aussi, brouillons compris.

## Conséquences

- Historique et retour arrière gratuits ; aucune base à sécuriser.
- Environ une minute entre l'enregistrement et la mise en ligne (redéploiement Vercel).
- Rien de confidentiel ne doit entrer dans `content/` ; les données d'un repo privé sont réduites aux champs affichés.
- Les commits du CMS contournent la règle « PR obligatoire » sur `main` grâce à une exception réservée au rôle admin.

## Alternatives écartées

- Base de données (Neon, Supabase) : publication instantanée, mais une infrastructure de plus à maintenir et à sécuriser.
- CMS headless (Sanity, Payload) : moins de code à écrire, mais le CMS sur mesure est justement le projet vitrine.
- Images chez un tiers (Cloudinary, Vercel Blob) : un service et un compte de plus pour un volume faible.
