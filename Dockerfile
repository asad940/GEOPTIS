FROM node:22-alpine

WORKDIR /app

# Installer les dépendances frontend et builder
COPY frontend/package*.json ./frontend/
RUN npm install --prefix frontend

COPY frontend/ ./frontend/
RUN npm run build --prefix frontend

# Installer les dépendances backend
COPY backend/package*.json ./backend/
RUN npm install --prefix backend

COPY backend/ ./backend/

EXPOSE 3000

CMD ["./backend/node_modules/.bin/ts-node", "--project", "backend/tsconfig.json", "backend/app.ts"]
