# StudyBuddy - AI Study Assistant

**AI-Powered Study Assistant for Junior High & High School Students**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![Ollama](https://img.shields.io/badge/Ollama-LLM-green)](https://ollama.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

> **📥 Just cloned this project?** → Read [CLONE_GUIDE.md](./CLONE_GUIDE.md) or [SETUP.md](./SETUP.md) (Thai)  
> **🇹🇭 อ่านภาษาไทย?** → [README.th.md](./README.th.md)

---

## 🎯 Overview

StudyBuddy is an AI-powered web application that helps students improve their study habits through conversational AI mentoring, behavior tracking, and automated report generation. All AI processing happens locally using Ollama for complete privacy.

### ✨ Key Features

- 🤖 **AI Chat Mentor** - Conversational AI powered by Ollama
- 📊 **Behavior Tracking** - Automatic study pattern detection
- 📈 **Progress Dashboard** - Visual analytics and trends
- 📄 **Automated Reports** - Weekly/monthly AI-generated insights
- 👨‍💼 **Admin Panel** - User management and monitoring
- 🌙 **Dark Mode** - Full dark mode support
- 🌐 **Multi-language** - English and Thai support
- 🔒 **Privacy-First** - All data stays local

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Ollama ([ollama.ai](https://ollama.ai))

### Installation

> **📖 สำหรับคนที่ clone มา**: อ่านคู่มือติดตั้งแบบละเอียดที่ [SETUP.md](./SETUP.md)

#### Option 1: Quick Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ollama_project.git
cd ollama_project

# 2. Run setup script
# For Windows (PowerShell):
.\setup.ps1

# For Linux/Mac:
chmod +x setup.sh
./setup.sh

# 3. Follow the on-screen instructions
```

The setup script will automatically:
- Install dependencies
- Setup environment variables
- Pull Ollama model
- Initialize database
- Seed demo data

#### Option 2: Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ollama_project.git
cd ollama_project

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 4. Setup Ollama
ollama pull llama3.1:8b

# 5. Initialize database
npm run db:generate
npm run db:push
npm run db:seed

# 6. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **⚠️ Important**: Make sure PostgreSQL and Ollama are running before starting the app

### Demo Accounts

- **Admin**: `admin@demo.com` / `demo123`
- **Student**: `student@demo.com` / `demo123`

---

## 📁 Project Structure

```
ollama_project/
├── app/                 # Next.js App Router (pages & API routes)
├── components/          # React components
├── lib/                 # Core business logic & utilities
├── prisma/              # Database schema & migrations
├── types/               # TypeScript type definitions
├── docs/                # Project documentation
└── scripts/             # Utility scripts
```

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **LLM**: Ollama (Llama 3.1 / Mistral)
- **UI**: shadcn/ui, Lucide Icons, Recharts
- **PDF**: jsPDF

---

## 📚 Documentation

For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)

### Quick Links

- **🚀 Setup Guide (สำหรับคนที่ clone มา)**: [SETUP.md](./SETUP.md) - คู่มือติดตั้งแบบละเอียด
- **📖 API Documentation**: [DOCUMENTATION.md#api-documentation](./DOCUMENTATION.md#api-documentation)
- **💻 Development Guide**: [DOCUMENTATION.md#development-guide](./DOCUMENTATION.md#development-guide)
- **🧪 Testing**: [docs/testing/](./docs/testing/)
- **✨ Features**: [docs/features/](./docs/features/)

---

## 💻 Development

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
.\scripts\quick-test.ps1    # Quick test (PowerShell)
.\scripts\test-api.ps1      # API test (PowerShell)
node scripts\test-features.js  # Feature test (Node)
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

### Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ollama_project.git`
3. Create feature branch: `git checkout -b feature/your-feature`
4. Make your changes and test thoroughly
5. Commit: `git commit -m "feat: your feature description"`
6. Push: `git push origin feature/your-feature`
7. Submit a pull request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for complete guidelines, code style, and testing requirements.

---

## 🚀 Deployment

### Deploy to Netlify

This project is ready for deployment on Netlify. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy)

**Requirements for Cloud Deployment:**
- PostgreSQL database (Supabase, Neon, or Railway)
- OpenAI API key (for LLM functionality)
- Environment variables configured

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide in Thai.

---

## 🧪 Testing

### Manual Testing

```bash
# Quick functionality test
.\scripts\quick-test.ps1

# Comprehensive API test
.\scripts\test-api.ps1

# Feature testing
node scripts\test-features.js
```

See [docs/testing/](./docs/testing/) for detailed testing guides.

---

## 🔧 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql
```

**Ollama Not Responding**
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# If you get registry errors when pulling models, wait a few minutes and retry
# Ollama registry occasionally has temporary outages
```

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

See [DOCUMENTATION.md#troubleshooting](./DOCUMENTATION.md#troubleshooting) for more help.

---

## 📂 Repository Files

### 📖 Documentation
- **[README.md](./README.md)** - This file, project overview (English)
- **[README.th.md](./README.th.md)** - 🆕 Project overview (Thai)
- **[CLONE_GUIDE.md](./CLONE_GUIDE.md)** - 🆕 Quick guide for cloned projects (Thai)
- **[SETUP.md](./SETUP.md)** - 🆕 Detailed setup guide (Thai)
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Complete technical documentation
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and changes

### 🚀 Deployment
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Netlify deployment guide (Thai)
- **[NETLIFY_QUICKSTART.md](./NETLIFY_QUICKSTART.md)** - Quick start for Netlify (Thai)
- **[netlify.toml](./netlify.toml)** - Netlify configuration

### ⚙️ Configuration
- **[.env.example](./.env.example)** - Environment variables template
- **[setup.ps1](./setup.ps1)** - Windows setup script
- **[setup.sh](./setup.sh)** - Linux/Mac setup script

### 📄 Legal
- **[LICENSE](./LICENSE)** - MIT License details

---

## �� License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 📞 Support

- **Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues**: Open an issue on GitHub
- **Testing Guides**: [docs/testing/](./docs/testing/)

---

## 🎉 Acknowledgments

- Ollama team for local LLM support
- shadcn for beautiful UI components
- Next.js team for amazing framework

---

**Version**: 1.0.0  
**Last Updated**: November 17, 2025

For complete documentation, see [DOCUMENTATION.md](./DOCUMENTATION.md)
