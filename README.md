# GEOPTIS — Gestionnaire de restaurants

Application full-stack de gestion de restaurants avec géolocalisation.

## Prérequis

- Node.js v16+
- PostgreSQL 16 installé et démarré

```bash
# macOS
brew services start postgresql@16
```

## Installation

```bash
git clone https://github.com/asad940/GEOPTIS.git
cd GEOPTIS
npm run setup
```

## Base de données

```bash
npm run db:setup
```

## Lancement

```bash
npm run dev
```

L'application est accessible sur **http://localhost:3000**

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run setup` | Installe toutes les dépendances |
| `npm run db:setup` | Crée la base de données et exécute le schéma SQL |
| `npm run db:clean` | Supprime la base de données entière |
| `npm run dev` | Lance le backend et le frontend en parallèle |
| `npm run build` | Compile le frontend avec Vite |
| `npm run clean` | Supprime les `node_modules` et fichiers générés |
