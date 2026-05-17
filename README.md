# Chess Openings Tracker

Application CRUD pour suivre et réviser son répertoire d'ouvertures d'échecs. Test technique Attineos.

## Stack

**Back** — Symfony 7 · PHP 8.3 · Doctrine ORM · SQLite  
**Front** — Vite + React 19 · TypeScript strict · TanStack Query · React Hook Form + Zod · shadcn/ui · Tailwind CSS v4

## Prérequis

- PHP 8.3+ avec l'extension `pdo_sqlite`
- Composer 2+
- Node 20+
- pnpm 9+

## Lancer en local

**Back**
```bash
cd back
composer install
php bin/console doctrine:migrations:migrate
symfony serve --no-tls
# API disponible sur http://localhost:8000
```

**Front**
```bash
cd front
pnpm install
pnpm dev
# App disponible sur http://localhost:5173
```

> **Bonus IA** : créer `back/.env.local` et y ajouter `ANTHROPIC_API_KEY=sk-ant-...` (Votre clé API Anthropic) pour activer l'analyse des ouvertures.



## Choix d'architecture

**SQLite** — Aucun serveur de base de données à installer. Suffisant pour un tracker personnel ; la migration vers PostgreSQL ne nécessiterait que de changer `DATABASE_URL`.

**DTOs séparés des entités** — `OpeningInput` valide les données entrantes, `OpeningOutput` contrôle ce qui est exposé. L'entité Doctrine ne fuit jamais directement dans l'API : un changement de schéma n'implique pas un changement de contrat API.

**Backed enum `Color`** — `Color::from('white')` lève une exception si la valeur est invalide. Plus sûr qu'une simple chaîne validée à la main.

**TanStack Query** — Gestion du cache, des loading states et de l'invalidation sans état global (Redux/Zustand). `invalidateQueries` après chaque mutation suffit à maintenir la liste à jour.

**React Hook Form + Zod** — RHF évite les re-renders à chaque frappe. Zod valide les données du formulaire avec le même schéma qui définit le type TypeScript (`z.infer`), sans dupliquer la définition.

**Custom hooks pour les mutations** — `useCreateOpening`, `useUpdateOpening`, `useDeleteOpening` encapsulent chacun leur logique de cache et de toast. Les composants restent déclaratifs.

**`useMutation.data` pour l'analyse IA** — Le résultat de l'appel Anthropic est stocké directement dans `mutation.data`. Pas de `useState` supplémentaire ; TanStack Query joue le rôle de cache de réponse.


