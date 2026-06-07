# ⚡ TaskFlow AI

**AI-powered task management platform** — Create tasks and let Gemini AI automatically suggest priority levels (High/Medium/Low).

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)

## ✨ Features

- **🤖 AI Priority Suggestions** — Gemini AI analyzes task content and suggests optimal priority levels
- **📋 Kanban Board** — Visual task management with Todo/In Progress/Done columns
- **📊 Dashboard Analytics** — Completion rates, priority distribution, and stat cards
- **🔐 Authentication** — Secure sign-up/login with NextAuth.js v5 & bcrypt
- **🔍 Search & Filter** — Find tasks by keyword, priority, or status
- **🎨 Premium Dark UI** — Glassmorphic design with animations and micro-interactions
- **📱 Responsive** — Works on desktop and mobile devices

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| AI | Gemini API |
| Auth | NextAuth.js v5 |
| Animations | Framer Motion |
| Deploy | Vercel + Railway |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Railway](https://railway.app))

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd TaskFlow-AI
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
AUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"       # Optional
```

> **Note:** Gemini AI is optional. Without API keys, the app uses a built-in keyword-based priority engine.

### 3. Set Up Database

```bash
npx prisma migrate dev --name init
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── ai/suggest/          # AI priority endpoint
│   │   ├── register/            # User registration
│   │   ├── stats/               # Dashboard statistics
│   │   └── tasks/               # CRUD tasks + [id]
│   ├── dashboard/
│   │   ├── layout.tsx           # Sidebar navigation
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── tasks/page.tsx       # Kanban task board
│   │   └── settings/page.tsx    # Settings & config
│   ├── login/page.tsx           # Sign in
│   ├── register/page.tsx        # Sign up
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Design system
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   ├── prisma.ts                # Prisma client singleton
│   └── gemini.ts                # Gemini AI integration
├── middleware.ts                 # Route protection
└── providers.tsx                 # Session provider
```

## 🚢 Deployment

### Vercel (Frontend + API)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Railway (Database)

1. Create PostgreSQL on [Railway](https://railway.app)
2. Copy the connection string to `DATABASE_URL`
3. Run `npx prisma migrate deploy`

## 📄 License

MIT
