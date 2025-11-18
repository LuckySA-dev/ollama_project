# 🚀 Netlify Quick Start (ภาษาไทย)

คู่มือเริ่มต้นด่วนสำหรับ Deploy StudyBuddy บน Netlify

## ⚡ เริ่มต้นใน 5 นาที

### 1️⃣ เตรียม Database (2 นาที)

**ใช้ Supabase (ฟรี):**

1. ไปที่ [supabase.com](https://supabase.com) → Sign up
2. คลิก **New Project**
3. ตั้งชื่อโปรเจค, เลือก region ที่ใกล้ที่สุด
4. ตั้งรหัสผ่าน database (จดไว้!)
5. รอ 1-2 นาทีให้ database สร้างเสร็จ
6. ไปที่ **Settings** → **Database** → **Connection string** → **URI**
7. คัดลอก URL (เปลี่ยน `[YOUR-PASSWORD]` เป็นรหัสผ่านที่ตั้งไว้)

ตัวอย่าง:
```
postgresql://postgres:MyPassword123@db.abcdefgh.supabase.co:5432/postgres
```

### 2️⃣ Push โค้ดไป GitHub (1 นาที)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ollama_project.git
git push -u origin main
```

### 3️⃣ Deploy บน Netlify (2 นาที)

1. ไปที่ [app.netlify.com](https://app.netlify.com)
2. คลิก **Add new site** → **Import an existing project**
3. เลือก **GitHub** → เลือก repository `ollama_project`
4. Build settings (ปล่อยค่า default):
   - Build command: `npm run build`
   - Publish directory: `.next`
5. คลิก **Deploy**

### 4️⃣ ตั้งค่า Environment Variables (2 นาที)

ไปที่ **Site settings** → **Environment variables** → **Add a variable**

เพิ่มตัวแปรเหล่านี้:

| Key | Value | ตัวอย่าง |
|-----|-------|---------|
| `DATABASE_URL` | URL จาก Supabase | `postgresql://postgres:...` |
| `JWT_SECRET` | สุ่มตัวอักษร 32 ตัว | `abc123xyz789...` |
| `NEXT_PUBLIC_APP_URL` | URL ของ Netlify site | `https://your-site.netlify.app` |

**สร้าง JWT_SECRET:**
```bash
# Windows (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# Linux/Mac
openssl rand -base64 32
```

### 5️⃣ Setup Database (1 นาที)

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run db:generate

# Push schema to database
DATABASE_URL="your-supabase-url" npm run db:push

# Seed initial data
DATABASE_URL="your-supabase-url" npm run db:seed
```

### 6️⃣ Redeploy

กลับไปที่ Netlify → **Deploys** → **Trigger deploy** → **Deploy site**

## ✅ เสร็จแล้ว!

เปิด `https://your-site.netlify.app` ทดสอบ login:
- **Admin**: `admin@demo.com` / `demo123`
- **Student**: `student@demo.com` / `demo123`

---

## 🤖 เพิ่มฟีเจอร์ AI Chat (Optional)

ถ้าต้องการใช้ AI Chat ต้องมี OpenAI API:

### 1. สมัคร OpenAI

1. ไปที่ [platform.openai.com](https://platform.openai.com)
2. Sign up / Login
3. ไปที่ **API Keys** → **Create new secret key**
4. คัดลอก API key (เก็บไว้ปลอดภัย!)
5. ไปที่ **Billing** → เติมเครดิต $5-10

### 2. เพิ่ม Environment Variables

กลับไปที่ Netlify → **Environment variables** → เพิ่ม:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `sk-...` (API key ที่คัดลอกมา) |
| `OPENAI_MODEL` | `gpt-3.5-turbo` |

### 3. Redeploy

**Deploys** → **Trigger deploy**

---

## 💰 ค่าใช้จ่าย

| บริการ | ราคา | หมายเหตุ |
|---------|------|----------|
| **Netlify** | ฟรี | 100GB bandwidth/เดือน |
| **Supabase** | ฟรี | 500MB database, 2GB bandwidth |
| **OpenAI API** | ~฿70-350/เดือน | ขึ้นกับการใช้งาน |

**ประมาณการ OpenAI:**
- GPT-3.5-turbo: ~$0.002/request
- 100 ข้อความ/วัน ≈ $6/เดือน (≈฿200)

---

## ❓ แก้ปัญหา

### Build Failed
```bash
# ลบ cache และ build ใหม่
# ใน Netlify: Site settings → Build & deploy → Clear cache and retry deploy
```

### Database Connection Error
- ตรวจสอบ `DATABASE_URL` ถูกต้องหรือไม่
- ตรวจสอบรหัสผ่านใน URL
- ลอง connect ผ่าน Prisma Studio: `npx prisma studio`

### OpenAI API Error
- ตรวจสอบ API key ถูกต้อง
- ตรวจสอบมีเครดิตเหลืออยู่
- ตรวจสอบ rate limit

### Site ช้า
- ใช้ CDN ของ Netlify (เปิดอยู่แล้ว)
- Optimize images
- Enable caching

---

## 📚 เอกสารเพิ่มเติม

- [DEPLOYMENT.md](./DEPLOYMENT.md) - คู่มือ deploy แบบละเอียด
- [README.md](./README.md) - ข้อมูลโปรเจค
- [CONTRIBUTING.md](./CONTRIBUTING.md) - คู่มือการพัฒนา

---

## 🎉 สำเร็จ!

ตอนนี้เว็บไซต์ของคุณ online แล้ว! 🚀

**Next Steps:**
- ปรับแต่ง UI/UX
- เพิ่มฟีเจอร์ใหม่
- Share กับเพื่อน
- ติดตามผลการใช้งาน

**ต้องการความช่วยเหลือ?**
- เปิด issue บน GitHub
- อ่าน [DOCUMENTATION.md](./DOCUMENTATION.md)
