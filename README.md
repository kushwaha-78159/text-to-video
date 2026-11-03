# 🎬 CineForge AI

### Transform Your Ideas into AI-Generated Videos

**CineForge AI** is an AI-powered video creation platform designed to turn text prompts and images into videos. It provides a modern studio experience with user authentication, project management, AI video generation, credit-based usage, and payment integration.

Build, generate, manage, and explore AI-powered video creations from one platform.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?logo=prisma)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🌟 Overview

CineForge AI aims to make AI video creation accessible through an intuitive web application.

Users can create videos from text prompts, upload images for image-to-video generation, manage their projects, and purchase credits through an integrated payment system.

The platform combines AI services, database-backed project management, cloud file storage, and secure payment verification.

## ✨ Features

### 🎥 AI Video Generation

- Text-to-video generation using Runway AI.
- Image-to-video generation using uploaded images.
- Custom video prompts.
- Configurable video duration.
- Landscape and portrait aspect ratios.
- Generation status tracking.

### 🖼️ Image Upload

- Upload images for image-to-video generation.
- Cloud storage integration using S3-compatible storage.
- Public image URLs for AI provider access.
- Supported image formats depend on the upload API configuration.

### 👤 Authentication & User Accounts

- User registration.
- User login and logout.
- Protected dashboard routes.
- User-specific projects and generation history.
- Account settings.

### 📁 Project Management

- Create and manage video projects.
- View previous generations.
- Track generation status.
- Organize creative work through the dashboard.

### 💳 Credit-Based Billing

- Credit-based generation system.
- Razorpay payment integration.
- Create payment orders.
- Verify payment signatures.
- Verify captured payments on the server.
- Webhook-based payment processing.
- Credit fulfillment with duplicate-payment protection.

**Available credit packages:**

| Package | Price | Credits |
|---|---:|---:|
| Starter | ₹199 | 200 |
| Creator | ₹499 | 600 |
| Pro | ₹999 | 1,500 |

*Packages and pricing are configurable in the application.*

### ⚙️ Dashboard

- Main dashboard.
- Video creation studio.
- Generation history.
- Project management.
- AI model section.
- Billing page.
- Account settings.
- Admin dashboard.

### 🛡️ Admin & Platform APIs

- Admin API.
- Upload API.
- User and platform management foundation.
- Model and settings APIs.
- Generation and project APIs.

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 | Full-stack web framework |
| React 19 | User interface |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Prisma ORM | Database access |
| PostgreSQL | Database |
| Runway AI SDK | AI video generation |
| Razorpay | Payment processing |
| AWS S3 SDK | Cloud file storage |
| Node.js | Runtime environment |
| Git & GitHub | Version control |

## 🏗️ Project Structure

```text
cineforge-ai/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│   └── uploads/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── billing/
│   │   │   ├── generations/
│   │   │   ├── projects/
│   │   │   ├── settings/
│   │   │   └── storyboard/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── billing/
│   │   │   ├── create/
│   │   │   ├── history/
│   │   │   ├── models/
│   │   │   ├── projects/
│   │   │   └── settings/
│   │   │
│   │   ├── login/
│   │   ├── signup/
│   │   └── page.tsx
│   │
│   └── lib/
│       └── billing.ts
│
├── .env.example
├── package.json
├── prisma.config.ts
└── README.md
```

*This is a high-level structure; individual components and supporting files may be added as development continues.*

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kushwaha-78159/text-to-video.git

cd text-to-video
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
# Database
DATABASE_URL="your_postgresql_connection_string"

# Authentication
AUTH_SECRET="your_secure_random_secret"

# Runway AI
RUNWAY_API_KEY="your_runway_api_key"

# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"

# S3-compatible storage
S3_ENDPOINT="your_s3_endpoint"
S3_REGION="your_s3_region"
S3_BUCKET="your_bucket_name"
S3_ACCESS_KEY_ID="your_access_key"
S3_SECRET_ACCESS_KEY="your_secret_key"
S3_PUBLIC_URL="your_public_bucket_url"
```

**Important:** Add any additional variables required by your existing application configuration. Never commit `.env.local` or expose API secrets in public repositories.

### 4. Configure Prisma

Generate Prisma Client:

```bash
npx prisma generate
```

Synchronize the database schema:

```bash
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🔑 External Service Configuration

### Runway AI

1. Create an account with Runway.
2. Generate an API key.
3. Add it to `RUNWAY_API_KEY`.
4. Ensure your account has access to the required video generation model.

### Razorpay

1. Create a Razorpay account.
2. Enable Test Mode.
3. Generate API keys.
4. Add the credentials to `.env.local`.
5. Configure the webhook endpoint:

```text
https://YOUR-DOMAIN/api/billing/webhook
```

6. Enable these webhook events:

```text
payment.captured
order.paid
```

7. Set the webhook secret in `RAZORPAY_WEBHOOK_SECRET`.

### S3-Compatible Storage

Configure your bucket, endpoint, credentials, and public URL.

The uploaded image must be accessible to the AI video provider through the configured public URL.

---

## 🔌 API Routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/signup` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/me` | GET | Current user |
| `/api/generations` | POST | Start video generation |
| `/api/generations/status` | GET | Check generation status |
| `/api/projects` | GET/POST | Manage projects |
| `/api/projects/[id]` | GET/PUT/DELETE | Individual project |
| `/api/models` | GET | AI model information |
| `/api/settings` | GET/PUT | User settings |
| `/api/admin` | API-dependent | Admin operations |
| `/api/admin/upload` | POST | Upload files |
| `/api/billing/order` | POST | Create Razorpay order |
| `/api/billing/verify` | POST | Verify payment |
| `/api/billing/webhook` | POST | Process payment webhooks |

*Methods and authorization requirements should be checked against the corresponding route implementations.*

---

## 🧪 Production Build

Check TypeScript:

```bash
npx tsc --noEmit
```

Create production build:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

---

## 🔐 Security Considerations

- Keep API keys and secrets in environment variables.
- Never expose payment secrets in client-side code.
- Verify Razorpay payment signatures on the server.
- Verify webhook signatures before processing events.
- Do not trust client-provided payment amounts or credit balances.
- Protect authenticated and admin-only routes.
- Use HTTPS in production.
- Configure appropriate access permissions for cloud storage.
- Validate uploaded files and request payloads.

---

## 🗺️ Roadmap

- [x] Next.js application foundation
- [x] Authentication API
- [x] Dashboard pages
- [x] PostgreSQL and Prisma integration
- [x] Project and generation APIs
- [x] Runway text-to-video integration
- [x] Image-to-video integration
- [x] Razorpay credit billing foundation
- [x] Payment verification and webhook endpoints
- [x] Billing dashboard
- [ ] Configure production API credentials
- [ ] Complete live payment testing
- [ ] Complete live image-to-video testing
- [ ] Production deployment and monitoring
- [ ] Recurring subscription billing

*Roadmap checkboxes indicate implementation status in the repository, not independent verification of live production behavior.*

---

## 🤝 Contributing

Contributions, ideas, bug reports, and feature suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your implementation.
5. Submit a pull request.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 👨‍💻 Developer

**Abhishek Kushwaha**

Student · Full-Stack Developer · AI Builder

- GitHub: [@kushwaha-78159](https://github.com/kushwaha-78159)
- Repository: [CineForge AI](https://github.com/kushwaha-78159/text-to-video)

---

## 📄 License

This project is distributed under the MIT License, subject to the presence and terms of the repository's `LICENSE` file.

---

<p align="center">
  **CineForge AI — Turn Imagination Into Motion.** 🎬
</p>
