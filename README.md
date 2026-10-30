Here is a full `README.md` for the project. The build commands are in code blocks, so you can copy them with one click. Replace the whole file with this:

````markdown
# Kidanex

Multilingual company website and admin panel for Kidanex (cardboard manufacturing, management consulting, trading, and a product catalog).

- **Languages:** Persian (default, `/fa`), English (`/en`), Arabic (`/ar`). Persian and Arabic are RTL.
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, MySQL (`mysql2`).
- **Public site:** home, services, team, shop, About page, dark/light theme, sitemap, `robots.txt`, `llms.txt`, JSON-LD.
- **Admin panel** (`/admin`): pages, posts, categories, tags, shop products, product categories, shop settings, image upload, CKEditor 5 editor, and auto-translation (Persian to English and Arabic).

## Requirements

- Node.js 20 or newer
- MySQL 8 (or MariaDB 10.5+), database character set `utf8mb4`
- Windows development: XAMPP or any local MySQL (the service must be running)

## Project structure

```
app/
  [lang]/                 public site (layout, home, services, shop, team, generic pages)
  admin/                  admin panel (login + (panel) with sidebar)
  api/                    upload and translate endpoints
  images/[...path]/       fallback route for newly uploaded images
  sitemap.xml/route.ts    sitemap
  llms.txt/route.ts       summary for AI crawlers
components/               Header, Footer, MobileMenu, Typewriter, ReadMoreText, ProductCard...
dictionaries/             fa.json, en.json, ar.json (interface texts)
db/migrations/            numbered SQL files (001, 002, ...)
fonts/                    local font files
lib/                      db, auth, i18n, content, shop, table helpers
public/                   static files and uploaded images (public/images/YYYYMM)
scripts/                  migrate.mjs, create-admin.mjs
proxy.ts                  redirects "/" to "/fa"
```

Content (services, team, About, products) lives in MySQL and is edited in the admin. Interface texts (menu, buttons, labels) live in `dictionaries/*.json`.

## Local setup

### 1. Install

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kidanex
AUTH_SECRET=
```

Generate `AUTH_SECRET` (use a different one on the server):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Optional: `MYMEMORY_EMAIL=you@example.com` raises the free translation limit of the fallback service.

### 3. Database

Start MySQL, create the database, then run the migrations:

```sql
CREATE DATABASE kidanex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
npm run db:migrate
```

### 4. Create the first admin

```bash
node --env-file=.env.local scripts/create-admin.mjs myname "a-long-strong-password"
```

### 5. Run

```bash
npm run dev
```

- Site: http://localhost:3000 (redirects to `/fa`)
- Admin: http://localhost:3000/admin/login

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (standalone output) |
| `npm run db:migrate` | Runs new files from `db/migrations/` |
| `npx tsc --noEmit` | Type check without building |

## Database migrations

Never edit an old migration. To change the schema, add a new numbered file such as `005_add_column.sql`, run it locally, then import the same file in the server's phpMyAdmin. Keep local and server schemas identical.

## Admin guide

- **Posts:** category `services` feeds the services pages and home cards; category `ourteam` is for team members. Don't rename those two slugs.
- **Pages:** a page with slug `about` feeds the About section on the home page.
- **Shop:** add product categories and products. An empty price shows "Call us", which links to `#contact`. Choose the 3 home page products in Shop settings.
- **Images:** drag and drop or click. Files are saved to `public/images/YYYYMM/`.
- **Translation:** fill the Persian fields and click outside; English and Arabic fill automatically if they are empty. Always review them.
- **Tables:** sort by clicking a column header, search by title or slug, and use the pagination below the table.

## Build and package for the server

The server only receives the standalone build, with no `npm install` needed. Run these on your PC from the project root (PowerShell). MySQL must be running, because the build reads the database.

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }
New-Item -ItemType Directory -Force .next\standalone\public | Out-Null
New-Item -ItemType Directory -Force .next\standalone\.next\static | Out-Null
Copy-Item -Recurse -Force public\* .next\standalone\public\
Copy-Item -Recurse -Force .next\static\* .next\standalone\.next\static\
```

Remove local test uploads so they don't overwrite the server's images:

```powershell
Get-ChildItem .next\standalone\public\images -Directory |
  Where-Object { $_.Name -match '^\d{6}$' } |
  Remove-Item -Recurse -Force
```

Test the package locally before uploading:

```powershell
cd .next\standalone
$env:DB_HOST="127.0.0.1"; $env:DB_USER="root"; $env:DB_PASSWORD=""; $env:DB_NAME="kidanex"; $env:AUTH_SECRET="local-test-secret-at-least-32-chars-long"
node server.js
```

## Deploy (cPanel Node.js App)

1. Zip the **contents** of `.next/standalone` (not the folder around it).
2. On the server, delete the old `node_modules`, `.next` and old zips. **Keep** `public/images` and the database.
3. Upload and extract the zip into the Application root, then delete the zip.
4. In **Setup Node.js App**: startup file `server.js`, and set the environment variables below. **Do not click "Run NPM Install".**
5. Click **Restart**.

Server environment variables:

```env
DB_HOST=127.0.0.1
DB_USER=cpaneluser_dbuser
DB_PASSWORD=long-random-letters-and-digits
DB_NAME=cpaneluser_dbname
AUTH_SECRET=a-different-64-char-hex-string
HOSTNAME=0.0.0.0
```

Notes:

- Use a password with letters and digits only. Special characters can be altered by the settings page and cause "Access denied".
- Import any new `db/migrations/*.sql` files in the server's phpMyAdmin **before** uploading a build that needs them.
- Create the server admin by generating a hash on your PC and inserting it with SQL:

  ```bash
  node -e "console.log(require('bcryptjs').hashSync('YOUR-REAL-PASSWORD', 12))"
  ```

  ```sql
  INSERT INTO admins (username, password_hash) VALUES ('myname', 'PASTE-HASH-HERE');
  ```

- The admin login needs HTTPS in production, because the session cookie is `secure`.

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| `AggregateError` / `object null is not iterable` | MySQL is not running, or use `DB_HOST=127.0.0.1` |
| `Access denied` on the server | Wrong or altered env values; use an alphanumeric password, no quotes in cPanel |
| Page has images but no CSS | `.next/static` not copied into `.next/standalone/.next/static` |
| Extra `public\public` folder | Copy with `public\*` as shown above, not the folder itself |
| Error `-122` on `npm install` | Server disk or inode quota full; deploy the standalone build instead |
| `/admin` redirects to `/fa/admin` | `admin` missing from the `proxy.ts` matcher |
| New uploaded image 404 on the server | Make sure `app/images/[...path]/route.ts` is in the build |
| Build fails on a route that reads the database | Add `export const dynamic = "force-dynamic"` to it, and start MySQL |

## Security checklist

- Never commit `.env*` files (only `.env.example`).
- Use different `AUTH_SECRET` values locally and on the server.
- Keep the admin password long and unique.
- Back up the database and `public/images` regularly.
- Remove temporary debug routes (such as `/api/dbcheck`) before deploying.
````

Before using it:

- **Node version:** I wrote "Node.js 20 or newer" as a safe minimum. Check `node -v` and adjust if you need something else.
- **Standalone setting:** the build section assumes `output: "standalone"` is still in `next.config.ts`.
- **`.env.example`:** the README refers to it, so create it with the variable names and empty values if it doesn't exist yet.
- **Paths and names:** some folder names (like `proxy.ts` and `llms.txt/route.ts`) match what we built. If you renamed or skipped any, edit that line.

# کیدانکس (Kidanex)

وب‌سایت چندزبانه شرکتی به همراه پنل مدیریت برای مجموعه کیدانکس که در حوزه تولید کارتن، مشاوره مدیریت، بازرگانی و عرضه محصولات فعالیت می‌کند.

- **زبان‌ها:** فارسی (پیش‌فرض، `/fa`)، انگلیسی (`/en`) و عربی (`/ar`). زبان‌های فارسی و عربی از چیدمان راست‌چین (RTL) استفاده می‌کنند.
- **فناوری‌ها:** Next.js 16 (App Router)، React 19، TypeScript، Tailwind CSS نسخه 4 و MySQL (`mysql2`).
- **وب‌سایت عمومی:** صفحه اصلی، خدمات، اعضای تیم، فروشگاه، صفحه درباره ما، پوسته تاریک و روشن، نقشه سایت، `robots.txt`، `llms.txt` و داده‌های ساختاریافته JSON-LD.
- **پنل مدیریت** (`/admin`): مدیریت صفحات، نوشته‌ها، دسته‌بندی‌ها، برچسب‌ها، محصولات فروشگاه، دسته‌بندی محصولات، تنظیمات فروشگاه، بارگذاری تصاویر، ویرایشگر CKEditor 5 و ترجمه خودکار از فارسی به انگلیسی و عربی.

## پیش‌نیازها

- Node.js نسخه 20 یا جدیدتر
- MySQL نسخه 8 یا MariaDB نسخه 10.5 یا جدیدتر، با مجموعه نویسه `utf8mb4`
- **محیط توسعه ویندوز:** نرم‌افزار XAMPP یا هر سرویس محلی MySQL دیگر. سرویس MySQL باید در حال اجرا باشد.

## ساختار پروژه

```text
app/
  [lang]/                 وب‌سایت عمومی (صفحه اصلی، خدمات، فروشگاه، تیم و صفحات عمومی)
  admin/                  پنل مدیریت (ورود و بخش اصلی همراه با منوی کناری)
  api/                    مسیرهای API برای بارگذاری تصاویر و ترجمه
  images/[...path]/       مسیر جایگزین برای تصاویر تازه بارگذاری‌شده
  sitemap.xml/route.ts    مسیر تولید نقشه سایت
  llms.txt/route.ts       تولید خلاصه سایت برای خزنده‌های هوش مصنوعی

components/               اجزای رابط کاربری مانند Header، Footer، MobileMenu،
                          Typewriter، ReadMoreText و ProductCard

dictionaries/              فایل‌های ترجمه رابط کاربری:
                           fa.json، en.json و ar.json

db/migrations/             فایل‌های شماره‌گذاری‌شده تغییر ساختار دیتابیس
                           مانند 001، 002 و ...

fonts/                     فایل‌های فونت محلی
lib/                       ابزارهای دیتابیس، احراز هویت، چندزبانه‌سازی،
                           مدیریت محتوا، فروشگاه و توابع کمکی جداول

public/                    فایل‌های استاتیک و تصاویر بارگذاری‌شده
                           public/images/YYYYMM

scripts/                   اسکریپت‌های migrate.mjs و create-admin.mjs

proxy.ts                   هدایت مسیر اصلی سایت به /fa
```

**محل ذخیره محتوا:**

محتوای خدمات، اعضای تیم، صفحه درباره ما و محصولات در دیتابیس MySQL ذخیره می‌شود و از طریق پنل مدیریت قابل ویرایش است.

متن‌های رابط کاربری، مانند منوها، دکمه‌ها و برچسب‌ها، در فایل‌های `dictionaries/*.json` نگهداری می‌شوند.

## راه‌اندازی پروژه در محیط محلی

### ۱. نصب وابستگی‌ها

در ترمینال، از مسیر اصلی پروژه دستور زیر را اجرا کن:

```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env.example` را در مسیر اصلی پروژه به `.env.local` کپی کن و مقادیر مناسب را در آن قرار بده.

نمونه تنظیمات:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kidanex
AUTH_SECRET=
```

برای تولید مقدار امن `AUTH_SECRET`، دستور زیر را اجرا کن:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

مقدار تولیدشده را در متغیر `AUTH_SECRET` قرار بده.

**نکته امنیتی:** برای سرور، یک مقدار جداگانه تولید کن و از مقدار محیط توسعه استفاده نکن.

متغیر زیر اختیاری است و می‌تواند محدودیت سرویس ترجمه رایگان MyMemory را افزایش دهد:

```env
MYMEMORY_EMAIL=you@example.com
```

به‌جای `you@example.com`، ایمیل خودت را قرار بده.

### ۳. راه‌اندازی دیتابیس

ابتدا سرویس MySQL را اجرا کن.

سپس دیتابیس پروژه را با دستور زیر ایجاد کن:

```sql
CREATE DATABASE kidanex CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

پس از تنظیم متغیرهای محیطی، مهاجرت‌های دیتابیس را اجرا کن:

```bash
npm run db:migrate
```

این دستور فایل‌های مهاجرت جدید را اجرا می‌کند و ساختار دیتابیس را مطابق نیاز پروژه به‌روزرسانی می‌کند.

### ۴. ایجاد اولین مدیر سایت

برای ایجاد حساب مدیر، دستور زیر را در مسیر اصلی پروژه اجرا کن:

```bash
node --env-file=.env.local scripts/create-admin.mjs myname "a-long-strong-password"
```

به‌جای `myname` نام کاربری دلخواه و به‌جای `a-long-strong-password` رمز عبور قوی خودت را قرار بده.

### ۵. اجرای پروژه

برای اجرای پروژه در محیط توسعه:

```bash
npm run dev
```

پس از اجرا، آدرس‌های زیر در دسترس خواهند بود:

- **وب‌سایت:** `http://localhost:3000`
- **پنل ورود مدیریت:** `http://localhost:3000/admin/login`

با ورود به آدرس اصلی، باید به مسیر `/fa` هدایت شوی.

## دستورات و اسکریپت‌های پروژه

| دستور | کاربرد |
|---|---|
| `npm run dev` | اجرای سرور توسعه |
| `npm run build` | ساخت نسخه نهایی پروژه برای محیط عملیاتی با خروجی Standalone |
| `npm run db:migrate` | اجرای فایل‌های مهاجرت جدید دیتابیس |
| `npx tsc --noEmit` | بررسی خطاهای TypeScript بدون انجام Build |

## مدیریت تغییرات دیتابیس

**فایل‌های مهاجرت قدیمی را ویرایش نکن.**

اگر لازم است ساختار دیتابیس تغییر کند، یک فایل مهاجرت جدید با شماره بعدی ایجاد کن.

برای مثال:

```text
db/migrations/005_add_column.sql
```

سپس مراحل زیر را انجام بده:

1. فایل مهاجرت را در محیط محلی اجرا کن.
2. عملکرد پروژه را بررسی کن.
3. همان فایل SQL را از طریق phpMyAdmin در سرور اجرا کن.
4. مطمئن شو ساختار دیتابیس محلی و سرور یکسان است.
5. نسخه جدید پروژه را Build و روی سرور منتشر کن.

این روش کمک می‌کند ساختار دیتابیس در محیط توسعه و سرور هماهنگ باقی بماند.

## راهنمای پنل مدیریت

### نوشته‌ها (Posts)

- دسته‌بندی با نامک `services` برای نمایش خدمات در صفحات خدمات و کارت‌های صفحه اصلی استفاده می‌شود.
- دسته‌بندی با نامک `ourteam` برای مدیریت اعضای تیم استفاده می‌شود.
- نامک این دو دسته‌بندی را تغییر نده؛ زیرا بخش‌های مختلف سایت به آن‌ها وابسته‌اند.

### صفحات (Pages)

صفحه‌ای با نامک `about` برای نمایش بخش درباره ما در صفحه اصلی استفاده می‌شود.

### فروشگاه (Shop)

- ابتدا دسته‌بندی‌های محصولات را ایجاد کن.
- سپس محصولات را به دسته‌بندی مناسب اختصاص بده.
- اگر قیمت محصول خالی باشد، عبارت «تماس بگیرید» نمایش داده می‌شود و لینک آن به بخش `#contact` هدایت خواهد شد.
- از بخش تنظیمات فروشگاه، سه محصول موردنظر برای نمایش در صفحه اصلی را انتخاب کن.

### تصاویر

برای بارگذاری تصاویر می‌توانی فایل را با ماوس بکش و در محل مشخص‌شده رها کنی یا روی بخش بارگذاری کلیک کنی.

تصاویر در مسیر زیر ذخیره می‌شوند:

```text
public/images/YYYYMM/
```

در این مسیر، `YYYYMM` نشان‌دهنده سال و ماه است.

برای مثال:

```text
public/images/202610/
```

### ترجمه خودکار

- ابتدا فیلدهای فارسی را تکمیل کن.
- پس از خروج از فیلد یا کلیک در خارج از آن، ترجمه خودکار می‌تواند فیلدهای خالی انگلیسی و عربی را تکمیل کند.
- ترجمه‌های موجود نباید بدون نیاز بازنویسی شوند.
- همیشه متن‌های ترجمه‌شده را پیش از انتشار بررسی کن.

### جداول پنل مدیریت

- برای مرتب‌سازی اطلاعات، روی عنوان ستون موردنظر کلیک کن.
- برای جست‌وجو، از عنوان یا نامک استفاده کن.
- برای مشاهده صفحات بعدی اطلاعات، از صفحه‌بندی زیر جدول استفاده کن.

## ساخت نسخه نهایی و آماده‌سازی برای سرور

در این پروژه، سرور نسخه Standalone را دریافت می‌کند؛ بنابراین در روش استقرار زیر، نیازی به اجرای `npm install` روی سرور نیست.

مراحل زیر را در کامپیوتر خودت، در مسیر اصلی پروژه و با استفاده از PowerShell انجام بده.

**پیش‌نیاز مهم:** در این پروژه، فرآیند Build به دیتابیس متصل می‌شود. بنابراین، پیش از شروع باید MySQL فعال باشد و تنظیمات اتصال دیتابیس در فایل `.env.local` صحیح باشند.

### ۱. حذف خروجی قبلی و ساخت نسخه جدید

ابتدا پوشه Build قبلی را حذف کن و نسخه جدید را بساز:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run build
if ($LASTEXITCODE -ne 0) { exit 1 }
```

اگر Build با خطا مواجه شد، ادامه نده. ابتدا خطا را برطرف کن و سپس دوباره Build بگیر.

### ۲. کپی فایل‌های استاتیک به پوشه Standalone

پس از موفقیت Build، دستورات زیر را اجرا کن:

```powershell
New-Item -ItemType Directory -Force .next\standalone\public | Out-Null
New-Item -ItemType Directory -Force .next\standalone\.next\static | Out-Null
Copy-Item -Recurse -Force public\* .next\standalone\public\
Copy-Item -Recurse -Force .next\static\* .next\standalone\.next\static\
```

این دستورات فایل‌های عمومی و منابع استاتیک موردنیاز، از جمله CSS و JavaScript خروجی، را در پوشه Standalone قرار می‌دهند.

**چرا این مرحله ضروری است؟**

اگر فایل‌های `.next/static` کپی نشوند، ممکن است صفحات سایت نمایش داده شوند، اما استایل‌ها و فایل‌های CSS به‌درستی بارگذاری نشوند.

### ۳. حذف تصاویر آزمایشی محلی

برای جلوگیری از جایگزین‌شدن تصاویر موجود در سرور با تصاویر آزمایشی محیط محلی، پوشه‌های تصویری ماهانه را از بسته خروجی حذف کن:

```powershell
Get-ChildItem .next\standalone\public\images -Directory |
  Where-Object { $_.Name -match '^\d{6}$' } |
  Remove-Item -Recurse -Force
```

این دستور پوشه‌هایی مانند `202610` را حذف می‌کند.

**توجه:** این دستور را فقط روی خروجی Standalone اجرا کن، نه روی پوشه اصلی `public/images`. تصاویر اصلی پروژه را در محیط توسعه حذف نکن.

### ۴. آزمایش نسخه Standalone پیش از بارگذاری

پیش از انتقال فایل‌ها به سرور، بهتر است نسخه Standalone را در محیط محلی اجرا کنی.

در PowerShell:

```powershell
cd .next\standalone
$env:DB_HOST="127.0.0.1"; $env:DB_USER="root"; $env:DB_PASSWORD=""; $env:DB_NAME="kidanex"; $env:AUTH_SECRET="local-test-secret-at-least-32-chars-long"
node server.js
```

سپس سایت را در مرورگر باز کن و عملکرد صفحات، تصاویر، ورود مدیر و اتصال به دیتابیس را بررسی کن.

این مقادیر صرفاً برای آزمایش محلی هستند. رمز عبور و کلید امنیتی محیط عملیاتی باید جداگانه تنظیم شوند.

## استقرار روی هاست cPanel با Node.js App

### مرحله ۱. آماده‌سازی فایل ZIP

محتویات پوشه زیر را ZIP کن:

```text
.next/standalone/
```

**نکته مهم:** محتویات پوشه را فشرده کن، نه خود پوشه `standalone` را به‌عنوان یک پوشه اضافی.

پس از استخراج فایل ZIP در سرور، فایل `server.js` باید مستقیماً در ریشه برنامه قرار داشته باشد.

### مرحله ۲. پاک‌سازی فایل‌های قدیمی سرور

در مسیر ریشه برنامه روی سرور، فایل‌های قدیمی مربوط به استقرار قبلی را حذف کن؛ از جمله:

- پوشه `node_modules`
- پوشه `.next` قدیمی
- فایل‌های ZIP قدیمی

**هشدار:** پوشه `public/images` و دیتابیس را حذف نکن.

اگر تصاویر بارگذاری‌شده از پنل مدیریت در این مسیر قرار دارند، باید آن‌ها را حفظ کنی.

### مرحله ۳. بارگذاری و استخراج

1. فایل ZIP نسخه جدید را روی سرور بارگذاری کن.
2. آن را در ریشه برنامه استخراج کن.
3. مطمئن شو فایل `server.js` در ریشه برنامه قرار دارد.
4. پس از اطمینان از استخراج صحیح، فایل ZIP را حذف کن.

### مرحله ۴. تنظیم Node.js App

در بخش **Setup Node.js App** در cPanel، تنظیمات برنامه را بررسی کن.

فایل شروع برنامه (Startup File) باید این مقدار باشد:

```text
server.js
```

متغیرهای محیطی زیر را نیز تنظیم کن.

**در این روش، روی گزینه Run NPM Install کلیک نکن.**

```env
DB_HOST=127.0.0.1
DB_USER=cpaneluser_dbuser
DB_PASSWORD=long-random-letters-and-digits
DB_NAME=cpaneluser_dbname
AUTH_SECRET=a-different-64-char-hex-string
HOSTNAME=0.0.0.0
```

مقادیر نمونه را با اطلاعات واقعی دیتابیس و برنامه خودت جایگزین کن.

- `DB_HOST`: آدرس سرور دیتابیس
- `DB_USER`: نام کاربری دیتابیس در cPanel
- `DB_PASSWORD`: رمز عبور دیتابیس
- `DB_NAME`: نام دیتابیس
- `AUTH_SECRET`: کلید محرمانه احراز هویت
- `HOSTNAME`: آدرسی که سرور برنامه روی آن گوش می‌دهد

پس از ذخیره تنظیمات، برنامه را با گزینه **Restart** مجدداً راه‌اندازی کن.

### نکات مهم استقرار

**رمز عبور دیتابیس**

در تنظیمات فعلی، استفاده از رمز عبوری متشکل از حروف و اعداد پیشنهاد شده است؛ زیرا برخی پنل‌های میزبانی ممکن است در ذخیره یا پردازش بعضی نویسه‌های خاص مشکل ایجاد کنند.

بااین‌حال، این موضوع به رفتار پنل و روش ذخیره متغیرهای محیطی بستگی دارد. اگر از نویسه‌های خاص استفاده می‌کنی، مطمئن شو مقدار رمز عبور در تنظیمات سرور دقیقاً با رمز دیتابیس مطابقت دارد.

**مهاجرت‌های دیتابیس**

اگر نسخه جدید به تغییرات ساختار دیتابیس نیاز دارد، فایل‌های SQL جدید موجود در مسیر زیر را پیش از استقرار نسخه جدید، از طریق phpMyAdmin روی سرور اجرا کن:

```text
db/migrations/
```

**ایجاد مدیر سایت در سرور**

اگر اسکریپت ایجاد مدیر در محیط عملیاتی قابل استفاده نیست، می‌توانی هش رمز عبور را در کامپیوتر خود تولید کنی.

ابتدا مطمئن شو وابستگی `bcryptjs` در محیط محلی نصب شده است؛ سپس دستور زیر را اجرا کن:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR-REAL-PASSWORD', 12))"
```

به‌جای `YOUR-REAL-PASSWORD` رمز عبور واقعی مدیر را قرار بده.

سپس هش تولیدشده را در دستور SQL زیر قرار بده:

```sql
INSERT INTO admins (username, password_hash)
VALUES ('myname', 'PASTE-HASH-HERE');
```

این دستور یک مدیر جدید ایجاد می‌کند. نام کاربری باید مطابق نیازت انتخاب شود و نباید بدون بررسی، برای مدیری که از قبل وجود دارد دوباره اجرا شود.

**ورود امن به پنل مدیریت**

در محیط عملیاتی، سایت باید از HTTPS استفاده کند؛ زیرا کوکی نشست ورود مدیر با ویژگی `secure` تنظیم شده است.

## عیب‌یابی مشکلات رایج

| مشکل | علت احتمالی و راه‌حل |
|---|---|
| خطای `AggregateError` یا `object null is not iterable` | سرویس MySQL فعال نیست یا تنظیمات اتصال اشتباه است. اجرای MySQL و استفاده از `DB_HOST=127.0.0.1` را بررسی کن. |
| خطای `Access denied` در سرور | نام کاربری، رمز عبور یا سایر متغیرهای محیطی اشتباه هستند. مقادیر cPanel را بررسی کن. |
| نمایش تصاویر بدون CSS | فایل‌های `.next/static` به مسیر `.next/standalone/.next/static` کپی نشده‌اند. |
| ایجاد پوشه اضافی `public\public` | به‌جای کپی محتویات پوشه `public`، خود پوشه کپی شده است. از دستورات این راهنما استفاده کن. |
| خطای `-122` هنگام `npm install` | احتمال دارد فضای دیسک یا سهمیه inode هاست پر شده باشد. در روش استقرار Standalone، نیازی به اجرای `npm install` روی سرور نیست. |
| هدایت `/admin` به `/fa/admin` | مسیر `admin` در Matcher فایل `proxy.ts` به‌درستی مستثنا نشده است. |
| خطای 404 برای تصویر تازه بارگذاری‌شده | وجود مسیر `app/images/[...path]/route.ts` در پروژه و خروجی Build را بررسی کن. |
| شکست Build در مسیری که به دیتابیس متصل می‌شود | بررسی کن که آیا مسیر باید پویا باشد. در صورت نیاز، `export const dynamic = "force-dynamic"` را به فایل مربوطه اضافه کن و مطمئن شو MySQL فعال است. |

**توجه درباره مسیرهای پویا:** افزودن `force-dynamic` برای همه مسیرها راه‌حل مناسبی نیست. ابتدا مشخص کن خطا دقیقاً در کدام مسیر رخ می‌دهد و آیا واقعاً باید هنگام درخواست به دیتابیس متصل شود.

## چک‌لیست امنیتی

پیش از انتشار پروژه و در طول نگهداری آن، موارد زیر را بررسی کن:

- فایل‌های `.env*` را در Git ثبت نکن؛ فقط فایل نمونه `.env.example` را نگهداری کن.
- برای محیط محلی و سرور از مقادیر متفاوت `AUTH_SECRET` استفاده کن.
- برای حساب مدیر از رمز عبور طولانی و منحصربه‌فرد استفاده کن.
- از دیتابیس و پوشه `public/images` به‌صورت منظم نسخه پشتیبان تهیه کن.
- مسیرهای آزمایشی و موقت، مانند `/api/dbcheck`، را پیش از انتشار حذف کن.
- اطلاعات اتصال دیتابیس و کلیدهای امنیتی را در اختیار افراد غیرمجاز قرار نده.
- پیش از اجرای مهاجرت‌های دیتابیس در محیط عملیاتی، از اطلاعات مهم نسخه پشتیبان تهیه کن.
- پس از انتشار، ورود مدیر، بارگذاری تصاویر، ترجمه، صفحات چندزبانه و عملکرد فروشگاه را آزمایش کن.
- از فعال‌بودن HTTPS برای ورود امن به پنل مدیریت مطمئن شو.