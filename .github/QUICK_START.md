# Quick Start Guide

Welcome to StudyBuddy! This guide will help you get started quickly.

## 🚀 5-Minute Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/ollama_project.git
cd ollama_project
```

### 2. Run Setup Script

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure Environment
Edit `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/study_assistant?schema=public"
```

### 4. Pull AI Model
```bash
ollama pull llama3.1:8b
```

### 5. Setup Database
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

### 6. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Accounts

- **Admin**: `admin@demo.com` / `demo123`
- **Student**: `student@demo.com` / `demo123`

## 📚 Next Steps

1. **Explore the Code**
   - Check out `app/` for pages and API routes
   - Look at `components/` for React components
   - Review `lib/` for business logic

2. **Read Documentation**
   - [README.md](../README.md) - Project overview
   - [DOCUMENTATION.md](../DOCUMENTATION.md) - Technical docs
   - [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guide

3. **Make Your First Contribution**
   - Find an issue labeled `good first issue`
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Submit a pull request

## 🛠 Useful Commands

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
.\scripts\quick-test.ps1    # Quick test (Windows)
.\scripts\test-api.ps1      # API test (Windows)
node scripts\test-features.js  # Feature test
```

## ❓ Common Issues

### Database Connection Error
```bash
# Make sure PostgreSQL is running
# Windows: Check Services
# Linux: sudo systemctl status postgresql
# Mac: brew services list
```

### Ollama Not Responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# If not, start Ollama
ollama serve
```

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
```

## 🤝 Getting Help

- **Documentation**: Check [DOCUMENTATION.md](../DOCUMENTATION.md)
- **Issues**: Search existing issues or create a new one
- **Discussions**: Join GitHub Discussions
- **Contributing**: Read [CONTRIBUTING.md](../CONTRIBUTING.md)

Happy coding! 🎉
