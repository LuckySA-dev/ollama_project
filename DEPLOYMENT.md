# 🚀 Deployment Guide - Netlify

คู่มือการ Deploy StudyBuddy บน Netlify

## 📋 สิ่งที่ต้องเตรียม

1. **GitHub Account** - สำหรับเชื่อมต่อกับ Netlify
2. **Netlify Account** - สมัครฟรีที่ [netlify.com](https://netlify.com)
3. **PostgreSQL Database** - ใช้บริการฟรีจาก:
   - [Supabase](https://supabase.com) (แนะนำ)
   - [Neon](https://neon.tech)
   - [Railway](https://railway.app)

## 🔧 ขั้นตอนการ Deploy

### 1. เตรียม Database (PostgreSQL)

#### ใช้ Supabase (แนะนำ)

1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจคใหม่
3. ไปที่ **Settings** → **Database**
4. คัดลอก **Connection String** (URI format)
5. เปลี่ยน `[YOUR-PASSWORD]` เป็นรหัสผ่านของคุณ

ตัวอย่าง:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 2. Push โค้ดไปยัง GitHub

```bash
# Initialize git (ถ้ายังไม่ได้ทำ)
git init
git add .
git commit -m "Initial commit"

# สร้าง repository บน GitHub แล้ว push
git remote add origin https://github.com/YOUR_USERNAME/ollama_project.git
git branch -M main
git push -u origin main
```

### 3. Deploy บน Netlify

#### วิธีที่ 1: ผ่าน Netlify Dashboard (ง่ายที่สุด)

1. ไปที่ [app.netlify.com](https://app.netlify.com)
2. คลิก **"Add new site"** → **"Import an existing project"**
3. เลือก **GitHub** และเชื่อมต่อ repository
4. ตั้งค่า Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. คลิก **"Deploy site"**

#### วิธีที่ 2: ผ่าน Netlify CLI

```bash
# ติดตั้ง Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### 4. ตั้งค่า Environment Variables

ไปที่ Netlify Dashboard → **Site settings** → **Environment variables**

เพิ่มตัวแปรเหล่านี้:

```env
# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# JWT Secret (สร้างด้วย: openssl rand -base64 32)
JWT_SECRET=your-random-secret-key-here

# Ollama Configuration (สำหรับ local development)
# สำหรับ production ให้ใช้ OpenAI API แทน
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# หรือใช้ OpenAI API (แนะนำสำหรับ production)
# OPENAI_API_KEY=sk-your-api-key-here
# OPENAI_MODEL=gpt-3.5-turbo

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
NODE_ENV=production
```

### 5. Setup Database Schema

```bash
# ติดตั้ง dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema ไปยัง database
npm run db:push

# Seed ข้อมูลเริ่มต้น
npm run db:seed
```

### 6. Redeploy

หลังจากตั้งค่า Environment Variables แล้ว:

1. ไปที่ **Deploys** tab
2. คลิก **"Trigger deploy"** → **"Deploy site"**

## ⚠️ ข้อจำกัดของ Netlify

### 1. Ollama ไม่สามารถใช้งานได้
Netlify เป็น serverless platform ไม่สามารถรัน Ollama (Local LLM) ได้

**แก้ไข**: ใช้ Cloud LLM API แทน:
- OpenAI API (GPT-3.5/GPT-4)
- Anthropic Claude API
- Google Gemini API

### 2. Serverless Function Timeout
Netlify Functions มี timeout 10 วินาที (free tier)

**แก้ไข**: 
- อัพเกรด Pro plan (26 วินาที)
- ใช้ Vercel แทน (60 วินาที)

### 3. Build Time Limit
Free tier: 300 นาที/เดือน

## 🔄 Alternative: ใช้ OpenAI API แทน Ollama

### 1. สมัคร OpenAI API

1. ไปที่ [platform.openai.com](https://platform.openai.com)
2. สร้าง API Key
3. เติมเครดิต (ขั้นต่ำ $5)

### 2. อัพเดทโค้ด

สร้างไฟล์ `lib/llm-provider.ts`:

```typescript
// lib/llm-provider.ts
export async function generateResponse(prompt: string) {
  // ถ้ามี OpenAI API Key ใช้ OpenAI
  if (process.env.OPENAI_API_KEY) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  // ถ้าไม่มี ใช้ Ollama (local)
  const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL,
      prompt: prompt,
    }),
  });
  
  const data = await response.json();
  return data.response;
}
```

## 📊 เปรียบเทียบ Deployment Options

| Platform | ฟรี | Database | LLM Support | Timeout |
|----------|-----|----------|-------------|---------|
| **Netlify** | ✅ | ต้องใช้ภายนอก | Cloud API only | 10s |
| **Vercel** | ✅ | ต้องใช้ภายนอก | Cloud API only | 60s |
| **Railway** | ✅ (limited) | ✅ Built-in | Cloud API only | ไม่จำกัด |
| **VPS** | ❌ ($5+/mo) | ✅ | ✅ Ollama | ไม่จำกัด |

## 🎯 แนะนำสำหรับ Production

### Option 1: Netlify + Supabase + OpenAI (ง่ายที่สุด)
- **Frontend/API**: Netlify (ฟรี)
- **Database**: Supabase (ฟรี)
- **LLM**: OpenAI API (~$0.002/request)

### Option 2: Vercel + Neon + OpenAI
- **Frontend/API**: Vercel (ฟรี)
- **Database**: Neon (ฟรี)
- **LLM**: OpenAI API

### Option 3: Railway (All-in-One)
- **ทุกอย่าง**: Railway
- **ข้อดี**: จัดการง่าย
- **ข้อเสีย**: Free tier จำกัด

### Option 4: VPS (Full Control)
- **Platform**: DigitalOcean, Linode, AWS EC2
- **ข้อดี**: ใช้ Ollama ได้, ควบคุมเต็มที่
- **ข้อเสีย**: ต้องจ่ายเงิน, ต้องจัดการเอง

## 🔍 Troubleshooting

### Build Failed
```bash
# ลองลบ node_modules และ install ใหม่
rm -rf node_modules package-lock.json
npm install
```

### Database Connection Error
- ตรวจสอบ `DATABASE_URL` ใน Environment Variables
- ตรวจสอบว่า IP ของ Netlify ไม่ถูก block โดย database

### Function Timeout
- ลดขนาด response จาก LLM
- ใช้ streaming response
- อัพเกรด Netlify plan

## 📞 ความช่วยเหลือ

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Next.js on Netlify**: [docs.netlify.com/integrations/frameworks/next-js](https://docs.netlify.com/integrations/frameworks/next-js)

## ✅ Checklist ก่อน Deploy

- [ ] Push โค้ดไปยัง GitHub
- [ ] สร้าง PostgreSQL database (Supabase/Neon)
- [ ] ตั้งค่า Environment Variables บน Netlify
- [ ] Run database migrations
- [ ] Seed ข้อมูลเริ่มต้น
- [ ] ทดสอบ login/signup
- [ ] ทดสอบ chat (ถ้าใช้ OpenAI API)
- [ ] ตรวจสอบ responsive design

---

**เวอร์ชัน**: 1.0.0  
**อัพเดทล่าสุด**: พฤศจิกายน 2025
