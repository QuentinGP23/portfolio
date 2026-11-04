# 0001 — Next.js App Router, hébergé sur Vercel

- Statut : accepté
- Date : 2026-11-01 (décisions D1 et D10 du plan)

## Contexte

Le portfolio doit être très rapide, accessible et bien référencé, et embarquer un back-office privé qui lit l'API GitHub et écrit dans le repo. Une seule base de code doit couvrir les deux, et la stack doit refléter ce que demandent les offres d'emploi front-end.

## Décision

- Next.js 16 (App Router, React Server Components), React 19, TypeScript.
- Pages publiques générées au build et servies par le CDN ; Cache Components activés et React Compiler activé (options par défaut du gabarit Next.js 16.4).
- Hébergement sur Vercel, offre Hobby : production sur `main`, un aperçu par pull request.

## Conséquences

- SEO et performance obtenus sans serveur à faire tourner pour les visiteurs.
- L'admin et ses Server Actions vivent dans le même projet que le site.
- Next.js publie des correctifs de sécurité fréquents : ils sont appliqués le jour même (voir 0004).
- L'offre Hobby interdit l'usage commercial : pas d'offre de prestations sur le site tant qu'il y est hébergé.

## Alternatives écartées

- Vite + React en SPA : référencement et premier affichage moins bons.
- Astro avec des îlots React : excellent pour le site public, moins naturel pour un back-office riche.
- React Router 7 : possible, mais moins présent dans les offres et moins intégré à Vercel.
