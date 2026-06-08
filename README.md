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

## 💡 How It Works

1. **Create a Task**: Simply describe what needs to be done.
2. **Let AI Decide**: Gemini AI evaluates your task description and determines if it's High, Medium, or Low priority based on urgency and context.
3. **Track Progress**: Your task lands on the interactive Kanban board. Drag or click to move it from "To Do" to "In Progress" and finally "Done".
4. **Monitor Analytics**: Head over to the dashboard to see your completion rates and productivity metrics over time.

## 🎯 Use Cases

- **Freelancers**: Manage client projects and prioritize immediate deadlines automatically.
- **Students**: Keep track of assignments and let the AI highlight what needs to be studied first.
- **Small Teams**: Organize sprints and daily tasks with a beautiful, shared workspace.

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

