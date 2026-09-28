

# Coddit 🚀

> A Reddit-inspired platform for coders to share, discuss, and showcase code snippets and projects.

Coddit is a social platform built for developers where users can post code, share knowledge, and engage with the community through likes and comments. Think of it as Reddit — but tailored for coders.

---

## 📖 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Scripts](#-scripts)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication
- Email + password signup & login
- OAuth login via **Google**, **Apple**, and **Facebook**
- Secure session/token management
- Protected routes for authenticated users

### 📰 Feed
- Browse posts (code snippets, articles, projects) uploaded by other coders
- **Like** and **comment** on posts
- View author info, timestamps, and code formatting

### ✍️ Create Post
- Rich **HTML text editor** for composing posts
- Support for code blocks, formatting, images, and links
- Publish instantly to the feed

### 📤 Uploads
- View all your personal posts/upload history
- **Edit** existing posts
- **Delete** posts you no longer want

### 👤 My Account
- View basic profile details (name, email, avatar, joined date)
- Managed directly from the sidebar navigation

### 🧭 Sidebar Navigation
- Feed
- Create Post
- Uploads
- My Account
- **Logout** (pinned at the bottom)

---

## 🛠 Tech Stack

| Layer            | Technology                        |
|------------------|-----------------------------------|
| **Frontend**     | React (Vite)                      |
| **Backend**      | Node.js + Express                 |
| **Database**     | [Turso](https://turso.tech/) (libSQL) |
| **Auth**         | JWT + OAuth (Google, Apple, Facebook) |
| **Rich Editor**  | HTML-based rich text editor       |
| **Styling**      | CSS / Tailwind (customizable)     |

---

## 📁 Project Structure

```
coddit/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PostCard.jsx
│   │   │   ├── RichTextEditor.jsx
│   │   │   └── CommentBox.jsx
│   │   ├── pages/
│   │   │   ├── Feed.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── Uploads.jsx
│   │   │   ├── MyAccount.jsx
│   │   │   └── Login.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── api/
│   │   │   └── axios.js
│   │   └── App.jsx
│   └── package.json
│
├── server/                     # Node backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── posts.js
│   │   │   ├── comments.js
│   │   │   └── likes.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── db/
│   │   │   └── turso.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js **v18+**
- npm or yarn
- A **Turso** account and database
- OAuth credentials for Google, Apple, and Facebook

### 1. Clone the repository

```bash
git clone https://github.com/your-username/coddit.git
cd coddit
```

### 2. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Set up Turso

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login and create a database
turso auth login
turso db create coddit

# Get connection URL and token
turso db show coddit --url
turso db tokens create coddit
```

### 4. Configure environment variables

Create a `.env` file in `server/` (see [Environment Variables](#-environment-variables)).

### 5. Run the app

```bash
# Backend (from server/)
npm run dev

# Frontend (from client/)
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

---

## 🔑 Environment Variables

### `server/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Turso
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - Apple
APPLE_CLIENT_ID=your-apple-client-id
APPLE_TEAM_ID=your-apple-team-id
APPLE_KEY_ID=your-apple-key-id
APPLE_PRIVATE_KEY=your-apple-private-key

# OAuth - Facebook
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Frontend URL (for CORS & redirects)
CLIENT_URL=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_APPLE_CLIENT_ID=your-apple-client-id
```

---

## 🌐 API Overview

### Auth
| Method | Endpoint                | Description                    |
|--------|-------------------------|--------------------------------|
| POST   | `/api/auth/register`    | Register with email/password   |
| POST   | `/api/auth/login`       | Login with email/password      |
| POST   | `/api/auth/google`      | Login via Google OAuth         |
| POST   | `/api/auth/apple`       | Login via Apple OAuth          |
| POST   | `/api/auth/facebook`    | Login via Facebook OAuth       |
| GET    | `/api/auth/me`          | Get current user profile       |
| POST   | `/api/auth/logout`      | Logout user                    |

### Posts
| Method | Endpoint             | Description                     |
|--------|----------------------|---------------------------------|
| GET    | `/api/posts`         | Get all posts (feed)            |
| GET    | `/api/posts/:id`     | Get single post                 |
| POST   | `/api/posts`         | Create a new post               |
| PUT    | `/api/posts/:id`     | Edit own post                   |
| DELETE | `/api/posts/:id`     | Delete own post                 |
| GET    | `/api/posts/me`      | Get current user's uploads      |

### Interactions
| Method | Endpoint                     | Description                 |
|--------|------------------------------|-----------------------------|
| POST   | `/api/posts/:id/like`        | Like / unlike a post        |
| POST   | `/api/posts/:id/comments`    | Add a comment               |
| GET    | `/api/posts/:id/comments`    | Get comments for a post     |
| DELETE | `/api/comments/:id`          | Delete own comment          |

---

## 🗄 Database Schema (Turso / libSQL)

```sql
CREATE TABLE users (
  id           TEXT PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  email        TEXT UNIQUE NOT NULL,
  password     TEXT,                 -- null for OAuth-only users
  provider     TEXT DEFAULT 'local', -- 'local' | 'google' | 'apple' | 'facebook'
  provider_id  TEXT,
  avatar_url   TEXT,
  bio          TEXT,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL,
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,        -- HTML from rich editor
  language     TEXT,                 -- optional code language tag
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
  id           TEXT PRIMARY KEY,
  post_id      TEXT NOT NULL,
  user_id      TEXT NOT NULL,
  content      TEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE likes (
  id           TEXT PRIMARY KEY,
  post_id      TEXT NOT NULL,
  user_id      TEXT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id),
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## 🔐 Authentication Flow

1. **Signup / Login** — user registers with email & password OR clicks one of the OAuth providers (Google / Apple / Facebook).
2. **Token issued** — backend verifies the credentials, creates/finds the user, and issues a **JWT**.
3. **Token stored** — the JWT is stored in an HTTP-only cookie (or localStorage for the client).
4. **Protected requests** — every API call to protected routes includes the token in the `Authorization` header.
5. **Middleware validation** — `authMiddleware` decodes the JWT and attaches `req.user` to the request.
6. **Logout** — clears the token and removes the session on the client.

---

## 📜 Scripts

### Backend (`server/`)
```bash
npm run dev      # Start dev server with nodemon
npm start        # Start production server
npm run migrate  # Run DB migrations on Turso
```

### Frontend (`client/`)
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow the existing code style and include clear commit messages.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 💬 Contact

- **Project Maintainer:** Your Name
- **Email:** you@example.com
- **Repository:** [github.com/your-username/coddit](https://github.com/your-username/coddit)

---

> Built with ❤️ for coders, by coders.
