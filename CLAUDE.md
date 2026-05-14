# Projet : CRUD Tracker d'Ouvertures d'Échecs

Test technique pour Attineos. Sera défendu en entretien avec Julien Leicher, Staff Engineer.
Livraison via GitHub uniquement, pas de déploiement.

## Structure du repo

```
/back  → Symfony 7 (API REST)
/front → Vite + React + TS (SPA)
```

## Stack imposée

### Back (/back)
- PHP 8.3+ avec types stricts partout
- Symfony 7.x via Composer
- Doctrine ORM + Doctrine Migrations
- SQLite (file-based, dans var/data.db)
- Controllers REST manuels (PAS API Platform, PAS de bundle "magique")
- Entities Doctrine séparées des DTOs (pas de fuite de structure DB vers l'API)
- Symfony Validator avec attributes sur les DTOs
- PHPStan level 8 dans phpstan.neon
- PHPUnit pour quelques tests unitaires sur la validation et le repository
- CORS configuré pour autoriser localhost:5173 (port Vite par défaut)

### Front (/front)
- Vite 5+ template react-ts
- TypeScript strict
- React Router v6
- TanStack Query v5 pour le fetching, mutations, cache, optimistic updates
- React Hook Form + @hookform/resolvers/zod
- Zod pour la validation côté form
- Tailwind CSS + shadcn/ui (install via npx shadcn@latest init)
- Sonner pour les toasts (livré avec shadcn)
- Axios pour les appels API (config baseURL via env var VITE_API_URL = http://localhost:8000)

### Bonus (à faire à la fin si temps)
- Endpoint POST /api/openings/{id}/analyze appelant l'API Anthropic via cURL
- Le front affiche le résultat dans un panel "Analyse IA"
- Clé API Anthropic en variable d'env locale (ANTHROPIC_API_KEY dans .env.local du back, jamais commitée)

## Interdit (out of scope pour ce test)
- API Platform
- Auth de toute sorte
- Docker
- GraphQL
- État global (Redux, Zustand) — TanStack Query suffit
- ORM autre que Doctrine
- Next.js
- CSS-in-JS
- Déploiement

## Conventions Back

- Namespace : App\
- Controllers : src/Controller/Api/
- Entities : src/Entity/
- Repositories : src/Repository/
- DTOs : src/Dto/ (Input/Output séparés si pertinent)
- Services : src/Service/
- Tests : tests/Controller/, tests/Repository/

- Tous les Controllers REST utilisent l'attribute #[Route] avec preset methods
- Tous les endpoints retournent JsonResponse avec status code explicite
- Erreurs de validation : retour 400 avec body { "errors": [...] }
- Ressource non trouvée : 404 propre
- Suppression réussie : 204 No Content
- Création réussie : 201 avec la ressource créée en body

## Conventions Front

- Imports : alias @/ pointe vers src/
- Composants en PascalCase, fichiers en kebab-case
- Pages dans src/pages/
- Composants partagés dans src/components/
- Hooks custom dans src/hooks/
- Services API (axios calls) dans src/api/
- Types partagés dans src/types/
- Zero any en TypeScript. unknown + narrowing si nécessaire.

## Critères de qualité

### Back
- DTOs validés avant tout traitement (Symfony Validator)
- Pas d'entity exposée directement à l'API (on passe par DTOs)
- Gestion des erreurs Doctrine (entity not found → 404)
- Code typé à 100% (PHPStan level 8 doit passer)
- Quelques tests PHPUnit sur les Controllers et Repositories

### Front
- TanStack Query pour TOUS les appels API (jamais de fetch direct dans un composant)
- Loading states sur tous les boutons d'action (mutation.isPending)
- Erreurs API affichées via Sonner toast (mutation.onError)
- Empty state avec CTA quand la liste est vide
- Confirmation modale avant suppression (pas confirm() natif)
- Optimistic updates sur les mutations rapides
- Aria-labels sur les boutons icône seule
- Focus management dans les modals

## Pédagogie obligatoire (RÈGLE CENTRALE)

Tristan a besoin de COMPRENDRE chaque ligne. Il sera évalué en live sur la capacité à 
défendre son code. Donc :

1. AVANT d'utiliser un concept Symfony nouveau (DI, EntityManager, attribute Route, 
   Validator, etc.), expliquer en 2-3 phrases ce que c'est et pourquoi on l'utilise ici.
2. Pareil pour les concepts React (TanStack Query, hooks, react-router, etc.).
3. À chaque fichier de config (composer.json, services.yaml, vite.config.ts, tailwind.config.js), 
   expliquer les options significatives.
4. À la fin de chaque feature, produire une mini-fiche des concepts vus à ajouter dans NOTES.md.

## Workflow de session

1. Démarrer une session : relire CLAUDE.md, confirmer la prochaine étape avec Tristan.
2. Avant code : expliquer les concepts qui vont être vus.
3. Coder.
4. Après code : récap des concepts, propositions d'ajouts NOTES.md.
5. Suggérer la prochaine étape.

## Fichier NOTES.md (privé, dans .gitignore)

Tristan tient un fichier NOTES.md à la racine où il consolide ses apprentissages. 
Ce fichier ne sera PAS livré. À chaque feature, proposer des ajouts à ce fichier.

## README.md (sera livré, critique vu qu'il n'y a pas de déploiement)

À écrire à la fin. Doit contenir :
- Description du projet en 2 lignes
- Stack et justification (back, front)
- Prérequis : PHP 8.3+, Composer, Node 20+, pnpm (ou npm)
- Comment lancer en local en 3 commandes max pour le back, 2 pour le front
- Section "Choix d'architecture" : 6-8 décisions techniques expliquées
- Section "Ce que je ferais avec plus de temps" : déploiement, tests E2E, auth, recherche, etc.

L'évaluateur doit pouvoir cloner et lancer en moins de 5 min sans rien chercher. 
Le README compense l'absence de déploiement.

## Plan d'attaque proposé (à valider)

1. Setup back Symfony + DB schema (~1h30)
2. Repository + Controllers REST CRUD basique (~2h)
3. Validation via DTOs + tests PHPUnit (~1h30)
4. Setup front Vite + TS + Tailwind + shadcn (~1h)
5. React Router + structure de pages + composant Layout (~1h)
6. TanStack Query + service API + page liste (~1h30)
7. Form création/édition avec React Hook Form + Zod (~2h)
8. Suppression avec modale de confirmation + toasts (~1h)
9. Bonus IA : endpoint d'analyse + intégration front + README final (~2h)

Total : ~13h. Étalé sur vendredi soir + samedi + dimanche, c'est tenable.