# StudyBuddy - AI Study Assistant

**AI-Powered Study Assistant for Junior High & High School Students**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748)](https://www.prisma.io/)
[![Ollama](https://img.shields.io/badge/Ollama-LLM-green)](https://ollama.ai/)

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

- **Setup Guide**: See [Installation](#installation) above
- **API Documentation**: [DOCUMENTATION.md#api-documentation](./DOCUMENTATION.md#api-documentation)
- **Development Guide**: [DOCUMENTATION.md#development-guide](./DOCUMENTATION.md#development-guide)
- **Testing**: [docs/testing/](./docs/testing/)
- **Features**: [docs/features/](./docs/features/)

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

We welcome contributions! Please see [DOCUMENTATION.md#contributing](./DOCUMENTATION.md#contributing) for guidelines.

### Quick Guidelines

1. Fork the repository
2. Create feature branch (`feature/your-feature`)
3. Make your changes
4. Test thoroughly
5. Submit pull request

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
```

**Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000
```

See [DOCUMENTATION.md#troubleshooting](./DOCUMENTATION.md#troubleshooting) for more help.

---

## 📄 License

MIT License - See LICENSE file for details

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
