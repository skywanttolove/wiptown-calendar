# 📅 WIP Town · Calendar Hub

เว็บปฏิทินงานสำหรับทีม WIP Town — โน้ตงานรายวัน, สถานะ, แนบรูป, ระบบล็อกอินด้วย PIN, ฟีดอัปเดตอัตโนมัติ

โปรเจกต์นี้เป็น **static HTML + React (CDN) + Babel ใน browser** — ไม่ต้อง build ไม่ต้องลง dependency อะไรเลย เปิดในเบราว์เซอร์ก็ใช้ได้ทันที

---

## 🗂 โครงสร้างไฟล์

```
.
├── ปฏิทินงาน WIP Town.html   ← entry point เปิดไฟล์นี้
├── app.jsx                    ← main shell + routing
├── store.jsx                  ← state management + seed data
├── styles.css                 ← ทุกสไตล์
├── tweaks-panel.jsx           ← Tweaks panel (dark/light, accent hue)
├── screens/
│   ├── login.jsx              ← Email + PIN login
│   ├── home.jsx               ← Hero + Announcements + Feed
│   ├── calendar.jsx           ← ปฏิทินรายเดือน + Day detail
│   ├── admin.jsx              ← จัดการประกาศ / users / categories / hero / pending
│   └── profile.jsx            ← Profile + Settings + GitHub sync
└── assets/
    └── hero.png               ← รูป hero
```

---

## 🚀 รันใน VS Code

### วิธีที่ 1 — Live Server (แนะนำ)

1. เปิดโฟลเดอร์โปรเจกต์ใน VS Code: `File → Open Folder…`
2. ติดตั้ง extension **"Live Server"** (โดย Ritwick Dey)
3. คลิกขวาที่ไฟล์ `ปฏิทินงาน WIP Town.html` → เลือก **"Open with Live Server"**
4. เบราว์เซอร์จะเปิดที่ `http://127.0.0.1:5500/` อัตโนมัติ
5. แก้ไขไฟล์ใดๆ — หน้าจะ refresh ให้เอง

### วิธีที่ 2 — Python (มีติดเครื่องแล้ว)

เปิด Terminal ใน VS Code (`Ctrl+\`` / `Cmd+\``) แล้วรัน:

```bash
python3 -m http.server 8080
```

เปิด `http://localhost:8080/ปฏิทินงาน WIP Town.html`

### วิธีที่ 3 — Node.js (ถ้ามี)

```bash
npx serve .
```

> ⚠️ **อย่าเปิดไฟล์แบบ `file://`** ตรง ๆ — เพราะ browser จะ block การโหลด `.jsx` ผ่าน `<script src>` (CORS) ต้องเปิดผ่าน HTTP server เท่านั้น

---

## ☁️ Deploy ผ่าน GitHub (ใช้ GitHub Pages — ฟรี!)

### ขั้นที่ 1 — สร้าง repository

1. เข้า [github.com](https://github.com) → คลิก **+** มุมขวาบน → **New repository**
2. ตั้งชื่อ เช่น `wiptown-calendar`
3. เลือก **Public** (จำเป็นสำหรับ GitHub Pages ฟรี)
4. กด **Create repository**

### ขั้นที่ 2 — Push code ขึ้น GitHub

เปิด Terminal ใน VS Code ที่โฟลเดอร์โปรเจกต์ แล้วรัน:

```bash
git init
git add .
git commit -m "init: WIP Town calendar hub"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/wiptown-calendar.git
git push -u origin main
```

แทน `<YOUR_USERNAME>` ด้วย username ของคุณ

### ขั้นที่ 3 — เปิด GitHub Pages

1. ไปที่ repo บน GitHub → แท็บ **Settings**
2. เมนูซ้าย → **Pages**
3. ใต้ **Build and deployment**:
   - Source: **Deploy from a branch**
   - Branch: เลือก **main** / **/ (root)** → กด **Save**
4. รอประมาณ 1–2 นาที จะมีลิงก์ขึ้นมาด้านบน:
   ```
   https://<YOUR_USERNAME>.github.io/wiptown-calendar/
   ```
5. เนื่องจากชื่อไฟล์เป็นภาษาไทย ต้อง URL-encode ลิงก์เข้าเว็บจะเป็น:
   ```
   https://<YOUR_USERNAME>.github.io/wiptown-calendar/ปฏิทินงาน%20WIP%20Town.html
   ```

> 💡 **เคล็ดลับ:** ถ้าอยากให้เข้าได้ที่ root URL เลย เปลี่ยนชื่อไฟล์เป็น `index.html`:
> ```bash
> git mv "ปฏิทินงาน WIP Town.html" index.html
> git commit -m "rename to index.html"
> git push
> ```

### ขั้นที่ 4 — Update ครั้งต่อๆ ไป

ทุกครั้งที่แก้ไขโค้ดเสร็จ:

```bash
git add .
git commit -m "feat: เพิ่มอะไรบางอย่าง"
git push
```

GitHub Pages จะ deploy ใหม่อัตโนมัติภายในเวลา 1–2 นาที

---

## 👥 บัญชีตัวอย่าง (Demo Accounts)

| อีเมล | PIN | ยศ |
|---|---|---|
| `admin@wiptown.co` | `1111` | Admin |
| `editor@wiptown.co` | `2222` | Editor |
| `ploy@wiptown.co` | `3333` | Member |
| `ken@wiptown.co` | `4444` | Member |
| `mint@wiptown.co` | `5555` | Member |

> 🔐 อีเมลใหม่ที่กด "ส่งคำขอเข้าใช้งาน" จะเข้าคิวรอ Admin อนุมัติที่แท็บ **Admin → คำขอเข้าใช้งาน**

---

## 🔧 ข้อมูลเก็บที่ไหน

ตอนนี้ข้อมูลทั้งหมดเก็บใน `localStorage` ของเบราว์เซอร์ — เปลี่ยนเบราว์เซอร์/เครื่อง = ข้อมูลแยกกัน

ถ้าอยาก sync จริง สามารถต่อ:
- **GitHub Gist API** (เก็บ JSON เป็น gist + ใช้ Personal Access Token)
- **Supabase / Firebase** (database + auth จริง)
- **Custom backend** ของทีม

UI ที่บอกว่า "synced to GitHub" ในตอนนี้เป็นการจำลอง — ถ้าจะต่อจริงต้องเขียน sync layer เพิ่มในไฟล์ `store.jsx`

---

## 🎨 ปรับ Tweaks

มุมขวาล่างมีไอคอน Tweaks — กดเปิดเพื่อปรับ:
- โหมด **Dark / Light**
- **Hue** ของสีหลัก (0–360°)
- **Reset seed data** (ล้างทดลอง)

---

## 📝 License

Internal use — WIP Town team
