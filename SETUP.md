# 🚀 คู่มือติดตั้ง StudyBuddy (สำหรับคนที่ Clone มา)

คู่มือนี้เหมาะสำหรับคนที่ clone โปรเจคไปแล้วและต้องการติดตั้งบนเครื่องของตัวเอง

---

## 📋 สิ่งที่ต้องเตรียมก่อน

ก่อนเริ่มติดตั้ง ต้องมีโปรแกรมเหล่านี้บนเครื่อง:

### 1. Node.js (เวอร์ชัน 18 ขึ้นไป)
- **Windows**: ดาวน์โหลดจาก [nodejs.org](https://nodejs.org/)
- **Mac**: `brew install node`
- **Linux**: `sudo apt install nodejs npm`

ตรวจสอบเวอร์ชัน:
```bash
node --version  # ควรได้ v18.x.x ขึ้นไป
npm --version
```

### 2. PostgreSQL (เวอร์ชัน 14 ขึ้นไป)
- **Windows**: ดาวน์โหลดจาก [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: `brew install postgresql@14`
- **Linux**: `sudo apt install postgresql postgresql-contrib`

ตรวจสอบเวอร์ชัน:
```bash
psql --version  # ควรได้ 14.x ขึ้นไป
```

### 3. Ollama (สำหรับ AI Chat)
- ดาวน์โหลดจาก [ollama.ai](https://ollama.ai)
- ติดตั้งตามระบบปฏิบัติการของคุณ

ตรวจสอบว่าติดตั้งสำเร็จ:
```bash
ollama --version
```

### 4. Git
- **Windows**: ดาวน์โหลดจาก [git-scm.com](https://git-scm.com/)
- **Mac**: `brew install git`
- **Linux**: `sudo apt install git`

---

## 📦 ขั้นตอนการติดตั้ง

### ขั้นที่ 1: Clone โปรเจค

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/ollama_project.git

# เข้าไปในโฟลเดอร์โปรเจค
cd ollama_project
```

### ขั้นที่ 2: ติดตั้ง Dependencies

```bash
# ติดตั้ง Node.js packages
npm install
```

รอจนกว่าจะติดตั้งเสร็จ (อาจใช้เวลา 2-5 นาที)

### ขั้นที่ 3: สร้าง Database

#### Windows (PowerShell):
```powershell
# เปิด PostgreSQL
# ถ้าติดตั้งแบบ default จะเปิดอัตโนมัติ

# เข้าสู่ PostgreSQL
psql -U postgres

# สร้าง database (ใน psql prompt)
CREATE DATABASE study_assistant;

# ออกจาก psql
\q
```

#### Mac/Linux:
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@14  # Mac

# เข้าสู่ PostgreSQL
sudo -u postgres psql  # Linux
psql postgres  # Mac

# สร้าง database
CREATE DATABASE study_assistant;

# ออกจาก psql
\q
```

### ขั้นที่ 4: ตั้งค่า Environment Variables

```bash
# คัดลอกไฟล์ตัวอย่าง
cp .env.example .env
```

แก้ไขไฟล์ `.env` ด้วย text editor:

```env
# Database - แก้ password เป็นรหัสผ่าน PostgreSQL ของคุณ
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/study_assistant?schema=public"

# JWT Secret - สร้างรหัสลับใหม่
JWT_SECRET="your-secret-key-here-change-in-production"

# Ollama Configuration
OLLAMA_BASE_URL="http://localhost:11434"
OLLAMA_MODEL="llama3.1:8b"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

**สร้าง JWT_SECRET:**

Windows (PowerShell):
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

Mac/Linux:
```bash
openssl rand -base64 32
```

คัดลอกผลลัพธ์ไปใส่ใน `.env` ที่ `JWT_SECRET`

### ขั้นที่ 5: ติดตั้ง Ollama Model

```bash
# ดาวน์โหลด AI model (ใช้เวลา 5-10 นาที)
ollama pull llama3.1:8b

# ตรวจสอบว่าดาวน์โหลดสำเร็จ
ollama list
```

### ขั้นที่ 6: Setup Database Schema

```bash
# สร้าง Prisma Client
npm run db:generate

# Push schema ไปยัง database
npm run db:push

# เพิ่มข้อมูลตัวอย่าง (demo accounts)
npm run db:seed
```

### ขั้นที่ 7: เริ่มต้นใช้งาน

```bash
# เริ่ม development server
npm run dev
```

เปิดเบราว์เซอร์ไปที่: [http://localhost:3000](http://localhost:3000)

---

## 🎯 ทดสอบการติดตั้ง

### ทดสอบ Login

ใช้ demo accounts เหล่านี้:

- **Admin**: 
  - Email: `admin@demo.com`
  - Password: `demo123`

- **Student**: 
  - Email: `student@demo.com`
  - Password: `demo123`

### ทดสอบ AI Chat

1. Login เป็น Student
2. ไปที่หน้า Chat
3. พิมพ์ข้อความทดสอบ เช่น "สวัสดี"
4. ถ้า AI ตอบกลับมาได้ แสดงว่าติดตั้งสำเร็จ

---

## 🔧 แก้ปัญหาที่พบบ่อย

### ❌ Database Connection Error

**อาการ**: `Error: Can't reach database server`

**แก้ไข**:
1. ตรวจสอบ PostgreSQL ทำงานอยู่หรือไม่
   ```bash
   # Windows
   Get-Service -Name postgresql*
   
   # Mac/Linux
   sudo systemctl status postgresql
   ```

2. ตรวจสอบ `DATABASE_URL` ใน `.env` ว่าถูกต้อง
   - Username ถูกต้อง (default: `postgres`)
   - Password ถูกต้อง
   - Database name ถูกต้อง (`study_assistant`)
   - Port ถูกต้อง (default: `5432`)

3. ลองเชื่อมต่อด้วย psql
   ```bash
   psql -U postgres -d study_assistant
   ```

### ❌ Ollama Not Responding

**อาการ**: AI Chat ไม่ตอบ หรือ error `ECONNREFUSED`

**แก้ไข**:
1. ตรวจสอบ Ollama ทำงานอยู่หรือไม่
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. ถ้าไม่ทำงาน เปิด Ollama:
   - **Windows**: เปิดแอป Ollama จาก Start Menu
   - **Mac**: เปิดแอป Ollama จาก Applications
   - **Linux**: `ollama serve`

3. ตรวจสอบว่ามี model แล้ว
   ```bash
   ollama list
   ```
   ถ้าไม่มี ให้ pull ใหม่:
   ```bash
   ollama pull llama3.1:8b
   ```

### ❌ Port 3000 Already in Use

**อาการ**: `Error: listen EADDRINUSE: address already in use :::3000`

**แก้ไข**:
```bash
# หา process ที่ใช้ port 3000
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Kill process
# Windows (ใช้ PID จากคำสั่งด้านบน)
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>

# หรือใช้ npx
npx kill-port 3000
```

### ❌ npm install Failed

**อาการ**: Error ตอน `npm install`

**แก้ไข**:
```bash
# ลบ node_modules และ lock file
rm -rf node_modules package-lock.json

# ติดตั้งใหม่
npm install

# ถ้ายังไม่ได้ ลอง
npm install --legacy-peer-deps
```

### ❌ Prisma Generate Failed

**อาการ**: Error ตอน `npm run db:generate`

**แก้ไข**:
```bash
# ลบ Prisma client เก่า
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma/client

# Generate ใหม่
npx prisma generate
```

---

## 📝 คำสั่งที่ใช้บ่อย

### Development
```bash
npm run dev              # เริ่ม dev server
npm run build            # Build สำหรับ production
npm start                # เริ่ม production server
```

### Database
```bash
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes
npm run db:seed          # เพิ่มข้อมูลตัวอย่าง
npm run db:studio        # เปิด Prisma Studio (GUI)
```

### Testing
```bash
# Windows
.\scripts\quick-test.ps1    # ทดสอบรวดเร็ว
.\scripts\test-api.ps1      # ทดสอบ API

# All platforms
node scripts\test-features.js  # ทดสอบฟีเจอร์
```

---

## 🚀 ขั้นตอนถัดไป

หลังจากติดตั้งเสร็จแล้ว คุณสามารถ:

1. **ศึกษาโค้ด**: อ่าน [DOCUMENTATION.md](./DOCUMENTATION.md)
2. **พัฒนาฟีเจอร์ใหม่**: อ่าน [CONTRIBUTING.md](./CONTRIBUTING.md)
3. **Deploy**: อ่าน [DEPLOYMENT.md](./DEPLOYMENT.md) หรือ [NETLIFY_QUICKSTART.md](./NETLIFY_QUICKSTART.md)

---

## 📚 เอกสารเพิ่มเติม

- **[README.md](./README.md)** - ภาพรวมโปรเจค
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - เอกสารทางเทคนิคแบบละเอียด
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - คู่มือการพัฒนา
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - คู่มือ Deploy
- **[docs/](./docs/)** - เอกสารเพิ่มเติม

---

## 💡 เคล็ดลับ

### ใช้ Setup Script (แนะนำ)

แทนที่จะทำทีละขั้นตอน คุณสามารถใช้ script อัตโนมัติ:

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Script จะทำขั้นตอนที่ 2-6 ให้อัตโนมัติ!

### เปิด Prisma Studio

ดู database แบบ GUI:
```bash
npm run db:studio
```

เปิดที่ [http://localhost:5555](http://localhost:5555)

### Hot Reload

Next.js รองรับ hot reload อัตโนมัติ เมื่อแก้ไขโค้ดแล้ว เบราว์เซอร์จะ refresh เอง

---

## 🆘 ต้องการความช่วยเหลือ?

- **เอกสาร**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Issues**: เปิด issue บน GitHub
- **Testing**: [docs/testing/](./docs/testing/)

---

**สำเร็จแล้ว! 🎉**

ตอนนี้คุณพร้อมใช้งาน StudyBuddy บนเครื่องของคุณแล้ว

Happy Coding! 💻
