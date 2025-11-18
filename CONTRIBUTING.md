# Contributing to StudyBuddy

Thank you for your interest in contributing to StudyBuddy! This document provides guidelines and instructions for contributing.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Ollama installed ([ollama.ai](https://ollama.ai))
- Git

### Setting Up Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ollama_project.git
   cd ollama_project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

4. **Setup Ollama**
   ```bash
   ollama pull llama3.1:8b
   ```

5. **Initialize Database**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📝 Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-quiz-mode`)
- `fix/` - Bug fixes (e.g., `fix/chat-scroll-issue`)
- `docs/` - Documentation updates (e.g., `docs/update-api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-db-queries`)
- `test/` - Test additions/updates (e.g., `test/add-chat-tests`)

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   # Run quick tests
   .\scripts\quick-test.ps1
   
   # Test API endpoints
   .\scripts\test-api.ps1
   
   # Test features
   node scripts\test-features.js
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

### Commit Message Convention

Follow conventional commits format:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add quiz mode to chat interface
fix: resolve chat scroll position issue
docs: update API documentation for reports
refactor: optimize database query performance
```

## 🧪 Testing Guidelines

### Manual Testing

Before submitting a PR, ensure:
- [ ] All existing features still work
- [ ] New features work as expected
- [ ] No console errors
- [ ] Database migrations work correctly
- [ ] UI is responsive and accessible

### Test Scripts

```bash
# Quick functionality test
.\scripts\quick-test.ps1

# Comprehensive API test
.\scripts\test-api.ps1

# Feature testing
node scripts\test-features.js
```

## 📋 Pull Request Process

1. **Update Documentation**
   - Update README.md if needed
   - Update DOCUMENTATION.md for API changes
   - Add comments to complex code

2. **Create Pull Request**
   - Use a clear, descriptive title
   - Describe what changes you made and why
   - Reference any related issues
   - Include screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Code refactoring
   
   ## Testing
   - [ ] Tested locally
   - [ ] All tests pass
   - [ ] No breaking changes
   
   ## Screenshots (if applicable)
   Add screenshots here
   ```

4. **Code Review**
   - Address reviewer feedback
   - Keep discussions professional and constructive
   - Update PR based on feedback

## 💻 Code Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for type safety
- Use meaningful variable and function names
- Keep functions small and focused
- Use async/await over promises
- Handle errors appropriately

### React Components

- Use functional components with hooks
- Keep components small and reusable
- Use proper prop types
- Follow React best practices

### Database

- Use Prisma for all database operations
- Write efficient queries
- Use transactions when needed
- Add proper indexes

### API Routes

- Follow RESTful conventions
- Validate input data
- Return appropriate status codes
- Handle errors gracefully

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's reproducible
- Test on latest version

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Windows 11]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

## Screenshots
Add screenshots if applicable
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the feature

## Problem It Solves
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've considered

## Additional Context
Any other relevant information
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing private information
- Unprofessional conduct

## 📞 Getting Help

- Check [DOCUMENTATION.md](./DOCUMENTATION.md)
- Review [docs/](./docs/) folder
- Open an issue for questions
- Join discussions in pull requests

## 🎉 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to StudyBuddy! 🚀
