# TeamTask - Application de Gestion des Tâches

TeamTask est une application MERN (MongoDB, Express, React, Node.js) permettant aux équipes de collaborer efficacement sur des taches, avec gestion des rôles (utilisateur / manager ), authentification sécurisée via JWT, gestion d'etat avec Redux Toolkit, et interface utilisateur moderne avec Tailwind CSS.

## Compte admin :
pour accedé comme admin et visualiser la liste des utilisateur : 
-email: teamtask.admin@gmail.com
-password: admin 

---

## Fonctionnalités

- Authentification JWT (inscription, connexion, déconnexion)
- Middleware de sécurité :
  `hpp` Contre les requettes http pollué,
  `express-mongo-sanitize` Contre les injections SQL
- Gestion d'etat avec : `Redux Toolkit`
- Gestion des rôles : `user`, `manager`
- Notifié avec email les utilisateur à propos leur nouveau taches avec : `nodemailer` 
- CRUD des tâches
- Filtrage des tâches par statut
- Tableau de bord tache
- Ajoute des taches
- Tableau de bord utilisateur pour l'admin 
- UI avec Tailwind CSS

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/teamtask.git
cd teamtask
```

### 2. Backend

```bash
cd server
npm install
```

Créer un fichier `.env` directement sous le dossier server :

```
DATABASE_URI="Mettre ton mongodb_connection_string"
ACCESS_TOKEN_SECRET="d99aee20e6da1b454da3830718fba56361ac509144bad8820a8a6e648945dad9"
PORT=5000
```

Puis :

```bash
npm run dev
```

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

---

## Stack technique

- **Frontend** : React + Vite + Tailwind CSS + Redux Toolkit
- **Backend** : Node.js + Express + MongoDB + Mongoose
- **Sécurité** : JWT, bcrypt, express-mongo-sanitize, hpp
- **Déploiement suggéré** : Vercel (frontend) / Render ou Railway (backend)

---

## Démo

Ajoutez ici :

- 🎥 Une vidéo de démo ou
- 📷 Des captures d'écran (tableau de bord, formulaire, etc.)

---

## Licence

MIT © 2025 [Yassine bouzid]
