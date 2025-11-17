# StudyBuddy - Complete Documentation

**AI-Powered Study Assistant for Students**  
**Last Updated**: November 17, 2025  
**Version**: 1.0.0

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Tech Stack](#tech-stack)
6. [Installation & Setup](#installation--setup)
7. [Development Guide](#development-guide)
8. [Contributing](#contributing)
9. [Testing](#testing)
10. [API Documentation](#api-documentation)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## 📖 Project Overview

StudyBuddy is an AI-powered web application that helps junior high and high school students improve their study habits through conversational AI mentoring, behavior tracking, and automated report generation.

### Key Features

- 🤖 **AI Chat Mentor** - Conversational AI powered by Ollama (local LLM)
- 📊 **Behavior Tracking** - Automatic logging of study patterns from conversations
- 📈 **Progress Dashboard** - Visual analytics of study habits and trends
- 📄 **Automated Reports** - Weekly/monthly AI-generated summaries and recommendations
- 🔒 **Privacy-First** - All data stays local, no external API calls
- 👨‍💼 **Admin Portal** - Monitor student progress and manage users
- 🌙 **Dark Mode** - Full dark mode support across all pages
- 🌐 **Multi-language** - English and Thai language support

### Target Users

- **Students**: Junior high and high school students (grades 7-12)
- **Admins**: Teachers and administrators monitoring student progress

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Ollama installed locally ([ollama.ai](https://ollama.ai))

### Quick Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Setup Ollama
ollama pull llama3.1:8b

# 4. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 5. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

- **Admin**: `admin@demo.com` / `demo123`
- **Student**: `student@demo.com` / `demo123`

---

## 📁 Project Structure

```
ollama_project/
│
├── 📱 app/                    # Next.js App Router
│   ├── (auth)/               # Authentication pages
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (admin)/             # Admin panel
│   │   └── admin/
│   │       ├── dashboard/   # Admin dashboard
│   │       ├── reports/     # System reports
│   │       ├── students/    # Student management
│   │       └── users/       # User management
│   ├── (student)/           # Student portal
│   │   └── student/
│   │       ├── chat/        # AI chat interface
│   │       ├── dashboard/   # Student dashboard
│   │       └── reports/     # Personal reports
│   ├── api/                 # API routes
│   │   ├── admin/          # Admin endpoints
│   │   ├── auth/           # Authentication
│   │   ├── chat/           # Chat API
│   │   ├── reports/        # Report generation
│   │   └── students/       # Student data
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
│
├── 🧩 components/            # React components
│   ├── ui/                 # Base UI (shadcn/ui)
│   ├── chat/               # Chat components
│   ├── dashboard/          # Dashboard widgets
│   ├── layout/             # Navigation
│   ├── report/             # Report viewers
│   └── theme/              # Theme toggle
│
├── ⚙️ lib/                   # Core business logic
│   ├── llm/                # LLM integration
│   │   ├── ollamaClient.ts # Ollama client
│   │   ├── promptTemplate.ts # Prompts
│   │   ├── behaviorAnalyzer.ts
│   │   ├── contextManager.ts
│   │   └── responseFormatter.ts
│   ├── pdf/                # PDF generation
│   │   └── reportGenerator.ts
│   ├── report/             # Report logic
│   │   └── generator.ts
│   ├── auth.ts             # Authentication
│   ├── db.ts               # Database client
│   └── utils.ts            # Utilities
│
├── 🗄️ prisma/                # Database
│   ├── schema.prisma       # Database models
│   └── seed.ts             # Seed data
│
├── 📝 types/                 # TypeScript types
│   └── index.ts
│
├── 📚 docs/                  # Documentation
│   ├── features/           # Feature docs
│   ├── testing/            # Testing guides
│   ├── bugfixes/           # Bug fix logs
│   └── development/        # Dev notes
│
└── 🔧 scripts/               # Utility scripts
    ├── quick-test.ps1
    ├── test-api.ps1
    └── test-features.js
```

---

## ✨ Features

### 1. AI Chat Mentor

**Location**: `/app/(student)/student/chat`

- Real-time conversation with AI mentor
- Context-aware responses
- Age-appropriate content filtering
- Automatic behavior detection
- Chat history and sessions

**Key Files**:
- `components/chat/ChatInterface.tsx`
- `app/api/chat/route.ts`
- `lib/llm/ollamaClient.ts`

### 2. Behavior Tracking

**Location**: Automatic during chat sessions

- Focus level detection
- Motivation tracking
- Stress level monitoring
- Consistency scoring
- Weekly behavior scores

**Key Files**:
- `lib/llm/behaviorAnalyzer.ts`
- `prisma/schema.prisma` (StudyBehaviorLog, BehaviorScore)

### 3. Progress Dashboard

**Location**: `/app/(student)/student/dashboard`

- Visual charts and graphs
- Behavior trends
- Session statistics
- Progress over time

**Key Files**:
- `components/dashboard/BehaviorChart.tsx`
- `components/dashboard/ProgressChart.tsx`
- `components/dashboard/StatsCard.tsx`

### 4. Automated Reports

**Location**: `/app/(student)/student/reports`

- Weekly and monthly reports
- AI-generated insights
- PDF export functionality
- Personalized recommendations

**Key Files**:
- `lib/report/generator.ts`
- `lib/pdf/reportGenerator.ts`
- `app/api/reports/route.ts`

### 5. Admin Panel

**Location**: `/app/(admin)/admin`

- User management
- Student monitoring
- System statistics
- Report generation
- User creation/deletion

**Key Files**:
- `app/(admin)/admin/dashboard/page.tsx`
- `app/(admin)/admin/users/page.tsx`
- `app/api/admin/*`

### 6. Dark Mode

**Location**: All pages

- System-aware theme detection
- Manual theme toggle
- Persistent theme preference
- Smooth transitions

**Key Files**:
- `components/theme/ThemeToggle.tsx`
- `app/layout.tsx` (ThemeProvider)

### 7. Multi-language Support

**Location**: Reports and AI responses

- English language support
- Thai language support
- Configurable language settings

**Key Files**:
- `lib/llm/promptTemplate.ts`
- `lib/report/generator.ts`

---

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

### Backend

- **API**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod

### AI/LLM

- **LLM Platform**: Ollama
- **Models**: Llama 3.1, Mistral
- **PDF Generation**: jsPDF, jspdf-autotable

### Development

- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

---

## 📦 Installation & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd ollama_project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup PostgreSQL

```bash
# Create database
createdb study_assistant

# Or using psql
psql -U postgres
CREATE DATABASE study_assistant;
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/study_assistant"

# JWT Secret
JWT_SECRET="your-secret-key-here"

# Ollama
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:8b"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Setup Ollama

```bash
# Install Ollama from https://ollama.ai

# Pull model
ollama pull llama3.1:8b

# Or use Mistral
ollama pull mistral:7b

# Verify Ollama is running
curl http://localhost:11434/api/tags
```

### 6. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed
```

### 7. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 💻 Development Guide

### Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Add tests (if applicable)
   - Update documentation

3. **Test Changes**
   ```bash
   npm run lint
   npm run type-check
   # Run manual tests
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

#### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type
- Use meaningful variable names

```typescript
// Good
interface UserData {
  id: string;
  name: string;
  email: string;
}

// Bad
const data: any = {...};
```

#### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper TypeScript types for props

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

#### File Naming

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- API routes: `route.ts`
- Pages: `page.tsx`

---

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

### Branch Naming

- `feature/` - New features
- `bugfix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring

### Commit Messages

Use conventional commits:

```
feat: add chat history pagination
fix: resolve login redirect issue
docs: update API documentation
refactor: simplify report generation
```

### Pull Request Process

1. Update documentation if needed
2. Test your changes thoroughly
3. Ensure all tests pass
4. Create PR with clear description
5. Wait for review

### Code Review

- Be respectful and constructive
- Explain your reasoning
- Be open to feedback
- Focus on code quality

---

## 🧪 Testing

### Manual Testing

Follow the [Manual Testing Guide](./docs/testing/MANUAL_TESTING_GUIDE.md)

### Quick Test

```powershell
.\scripts\quick-test.ps1
```

### API Testing

```powershell
.\scripts\test-api.ps1
```

### Feature Testing

```bash
node scripts/test-features.js
```

### Testing Checklist

- [ ] Authentication (login/register)
- [ ] Chat functionality
- [ ] Dashboard displays correctly
- [ ] Reports generate successfully
- [ ] Admin panel works
- [ ] Dark mode toggles
- [ ] Responsive design
- [ ] Error handling

---

## 📡 API Documentation

### Authentication

#### POST `/api/auth/register`

Register new user.

**Request**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "gradeLevel": 10
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "jwt-token"
  }
}
```

#### POST `/api/auth/login`

Login user.

**Request**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "jwt-token"
  }
}
```

### Chat

#### POST `/api/chat`

Send message to AI.

**Headers**: `Authorization: Bearer <token>`

**Request**:
```json
{
  "message": "I need help with math",
  "sessionId": "optional-session-id"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "response": "AI response...",
    "sessionId": "session-id"
  }
}
```

### Reports

#### GET `/api/reports/weekly`

Get weekly report.

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "success": true,
  "data": {
    "summary": "...",
    "metrics": {...},
    "highlights": [...],
    "concerns": [...]
  }
}
```

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Ensure all production environment variables are set:

```env
DATABASE_URL="production-database-url"
JWT_SECRET="strong-secret-key"
OLLAMA_BASE_URL="ollama-server-url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Deployment Options

#### Vercel (Recommended for Next.js)

```bash
npm install -g vercel
vercel
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Traditional Server

```bash
npm run build
npm start
```

---

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error

**Problem**: Cannot connect to PostgreSQL

**Solution**:
1. Check PostgreSQL is running
2. Verify `.env` credentials
3. Ensure database exists
4. Check firewall settings

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U username -d study_assistant
```

#### Ollama Not Responding

**Problem**: AI chat not working

**Solution**:
1. Check Ollama is running
2. Verify model is pulled
3. Check OLLAMA_BASE_URL

```bash
# Check Ollama
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

#### Build Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
1. Clear `.next` folder
2. Regenerate Prisma client
3. Check TypeScript version

```bash
rm -rf .next
npm run db:generate
npm run build
```

#### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

### Getting Help

1. Check [documentation](./docs/)
2. Review [GitHub issues](https://github.com/...)
3. Check error logs
4. Contact maintainers

---

## 📚 Additional Resources

### Documentation

- [Features Documentation](./docs/features/)
- [Testing Guides](./docs/testing/)
- [Bug Fix Logs](./docs/bugfixes/)
- [Development Notes](./docs/development/)

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Ollama Documentation](https://ollama.ai/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Team

**Project**: StudyBuddy  
**Type**: AI-Powered Study Assistant  
**Target**: Junior High & High School Students  
**Status**: Active Development

---

## 🎉 Acknowledgments

- Ollama team for local LLM support
- shadcn for beautiful UI components
- Next.js team for amazing framework
- All contributors and testers

---

**Last Updated**: November 17, 2025  
**Version**: 1.0.0  
**Maintained by**: Development Team

For questions or support, please open an issue on GitHub.
