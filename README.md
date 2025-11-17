# AI Study Assistant for Junior High School Students

An AI-powered web application that helps junior high school students improve their study habits through conversational AI mentoring, behavior tracking, and automated report generation.

## Features

- 🤖 **AI Chat Mentor** - Conversational AI powered by Ollama (local LLM)
- 📊 **Behavior Tracking** - Automatic logging of study patterns from conversations
- 📈 **Progress Dashboard** - Visual analytics of study habits and trends
- 📄 **Automated Reports** - Weekly/monthly AI-generated summaries and recommendations
- 🔒 **Privacy-First** - All data stays local, no external API calls
- 👨‍🏫 **Teacher Portal** - Monitor student progress and identify at-risk behaviors

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **LLM**: Ollama (Llama 3.1 or Mistral)
- **UI Components**: shadcn/ui, Lucide Icons, Recharts

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- Ollama installed locally ([ollama.ai](https://ollama.ai))

## Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Setup PostgreSQL database**
```bash
# Create database
createdb study_assistant
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Setup Ollama**
```bash
# Pull the model (choose one)
ollama pull llama3.1:8b
# or
ollama pull mistral:7b
```

5. **Initialize database**
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

6. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (student)/         # Student portal
│   ├── (teacher)/         # Teacher portal
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── chat/             # Chat interface
│   ├── dashboard/        # Dashboard widgets
│   └── report/           # Report viewers
├── lib/                   # Core business logic
│   ├── llm/              # Ollama integration
│   ├── report/           # Report generation
│   ├── auth/             # Authentication
│   └── db/               # Database utilities
├── prisma/               # Database schema
└── types/                # TypeScript types
```

## Usage

### For Students
1. Register with email and grade level
2. Start chatting with the AI mentor about study challenges
3. View your progress dashboard
4. Access weekly/monthly reports

### For Teachers
1. Login with teacher credentials
2. View overview of all students
3. Access individual student reports
4. Identify students needing support

## Security Features

- JWT-based authentication
- Input sanitization and validation
- Age-appropriate content filtering
- Rate limiting on AI interactions
- Audit logging of all conversations
- Role-based access control

## Development

```bash
# Run development server
npm run dev

# Generate Prisma client
npm run db:generate

# Create database migration
npm run db:migrate

# Seed database with test data
npm run db:seed

# Build for production
npm run build
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
