# GEOPTIS — Gestionnaire de restaurants

Application full-stack de gestion de restaurants avec géolocalisation.

## Prérequis

### Node.js v16+

Vérifier si Node.js est installé :
```bash
node -v
```

Si non installé :
- **macOS** : `brew install node`
- **Windows / Linux** : télécharger sur [nodejs.org](https://nodejs.org)

---

### PostgreSQL 16

Vérifier si PostgreSQL est installé :
```bash
psql --version
```

**macOS :**
```bash
brew install postgresql@16
brew services start postgresql@16
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Ubuntu / Debian :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows :**
Télécharger l'installeur sur [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) et suivre l'assistant d'installation.

---

## Configuration

Copier le fichier d'exemple et l'adapter si besoin :

```bash
cp .env.example backend/.env
```

Contenu de `backend/.env` :
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=geoptis
DB_USER=<votre_utilisateur_postgres>
DB_PASSWORD=<votre_mot_de_passe>
```

> Sur macOS avec Homebrew, `DB_USER` est généralement votre nom d'utilisateur système et `DB_PASSWORD` est vide.

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
