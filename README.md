# GEOPTIS — Gestionnaire de restaurants

Application full-stack de gestion de restaurants avec géolocalisation.

---

## Lancement avec Docker (recommandé)

La méthode la plus simple : aucune installation de Node.js ou PostgreSQL requise.

**Installer Docker Desktop :**
- **macOS / Windows** : télécharger sur [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) et suivre l'assistant
- **Ubuntu / Debian** :
```bash
sudo apt update
sudo apt install docker.io docker-compose-plugin
sudo systemctl start docker
```

Une fois Docker installé et démarré, vous n'avez plus qu'à faire :

```bash
git clone https://github.com/asad940/GEOPTIS.git
cd GEOPTIS
docker compose up --build
```

L'application est accessible sur **http://localhost:3000**

La base de données est créée et le schéma est appliqué automatiquement au premier démarrage.

---

## Lancement sans Docker (installation manuelle)

### 1. Prérequis

#### Node.js v16+

Vérifier si Node.js est installé :
```bash
node -v
```

Si non installé :
- **macOS** : `brew install node`
- **Windows / Linux** : télécharger sur [nodejs.org](https://nodejs.org)

#### PostgreSQL 16

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

### 2. Configuration

Copier le fichier d'exemple et l'adapter :

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

### 3. Installation et lancement

```bash
git clone https://github.com/asad940/GEOPTIS.git
cd GEOPTIS
npm run setup
npm run db:setup
npm run dev
```

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run setup` | Installe toutes les dépendances |
| `npm run db:setup` | Crée la base de données et exécute le schéma SQL |
| `npm run db:clean` | Supprime la base de données entière |
| `npm run dev` | Lance le backend et le frontend en parallèle |
| `npm run build` | Compile le frontend avec Vite |
| `npm run clean` | Supprime les `node_modules` et fichiers générés |
