# InvoiceHub — Invoice & Customer Management System

A full-stack invoicing application built for businesses and freelancers to
manage **customers**, **invoices**, and **payments** with a real-time dashboard,
PDF invoice generation, and secure authentication.

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript)
![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-State-764ABC?logo=redux)
![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Live Demo

**Live Preview:**
[https://alamin-invoice-hub.vercel.app/signin](https://alamin-invoice-hub.vercel.app/signin)

---

## Screenshots

![Dashboard](./frontend/public/image/invoicePrev.webp)

---

## Features

### Authentication

- Sign Up / Sign In
- Forgot Password / Reset Password Flow only via email
- JWT-based Auth (Access & Refresh Tokens)
- Protected Routes & Middleware

### Customers

- Create / Edit / Delete Customers
- Customer Search
- Customer Detail Page with Invoice Summary (Total Paid, Due, Partial)

### Invoices

- Create / Edit / Delete Invoices
- Status Filter (Paid / Due / Partial)
- Search by Customer or Invoice Number
- **PDF Invoice Generation** (Puppeteer + Chromium)
- Invoice-wise Payment Tracking

### Dashboard & Analytics

- Overview Cards (Revenue, Due, Paid, Partial)
- Recent Invoices & Customers
- Charts & Graphs (Chart.js)

### Settings

- Store Profile Settings (Name, Logo, Contact Info)
- Logo Upload via Cloudinary
- Email Notifications (Nodemailer)

### Core Functionality

- REST API (Express + Mongoose)
- RTK Query for Data Fetching & Caching
- Form Validation (React Hook Form)
- SweetAlert2 Confirmation & Alerts
- Dark / Light Theme (next-themes)

---

## Tech Stack

### Frontend

| Package                    | Purpose                            |
| -------------------------- | ---------------------------------- |
| Next.js (App Router)       | Framework                          |
| TypeScript                 | Type Safety                        |
| Redux Toolkit / RTK Query  | State & Data Fetching              |
| Tailwind CSS               | Styling                            |
| React Hook Form            | Form Handling                      |
| Chart.js / react-chartjs-2 | Analytics Charts                   |
| SweetAlert2                | Alerts & Confirmations             |
| Lucide React               | Icons                              |
| Cloudinary                 | Image/Logo Upload                  |
| Jose                       | JWT Verification (Edge/Middleware) |

### Backend

| Package                         | Purpose                |
| ------------------------------- | ---------------------- |
| Node.js / Express               | REST API Server        |
| Mongoose                        | MongoDB ODM            |
| JSON Web Token                  | Authentication         |
| Bcrypt                          | Password Hashing       |
| Puppeteer + @sparticuz/chromium | PDF Invoice Generation |
| Nodemailer                      | Email Service          |
| Cookie Parser                   | Cookie Handling        |
| CORS                            | Cross-Origin Requests  |

---

## Project Structure

```text
InvoiceHub/
├── backend/
|   ├── authentication/
|   ├── controllers/
|   ├── db/
|   ├── libs/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── pipelines/
│   └── server.ts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── dashboard/
    │   │   │   ├── customers/
    │   │   │   │   ├── [id]/
    │   │   │   │   ├── edit/[id]/
    │   │   │   │   └── page.tsx
    │   │   │   ├── invoices/
    │   │   │   │   ├── [id]/
    │   │   │   │   ├── create/
    │   │   │   │   └── page.tsx
    │   │   │   ├── settings/
    │   │   │   └── page.tsx
    │   │   ├── (auth)/
    │   │   │   ├── signin/
    │   │   │   ├── signup/
    │   │   │   ├── verify/
    │   │   │   ├── reset-password/
    │   │   │   └── forgot-password/
    │   │   └── api/
    │   ├── components/
    │   │   ├── auth/
    │   │   ├── layout/
    │   │   ├── setting/
    │   │   ├── shared/
    │   │   └── ui/
    │   ├── hooks/
    │   ├── redux/
    │   │   ├── store/
    │   │   └── feature/
    │   ├── lib/
    │   └── types/
    └── package.json
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/alaminhere/InvoiceHub.git
```

### Navigate to the Project

```bash
cd InvoiceHub
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

## Environment Variables

**Backend (`backend/.env`)**

```env

DATABASE_URL=
PORT=8000
JWT_PRIVATE_KEY =
FRONTEND_URL=http://localhost:3000

SMTP_USER=
SMTP_PASS=


```

**Frontend (`frontend/.env.local`)**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000

JWT_PRIVATE_KEY =

NEXT_PUBLIC_CLOUD_NAME=
NEXT_PUBLIC_PRESET_NAME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Developed By

**Al-Amin** GitHub:
[https://github.com/alaminhere](https://github.com/alaminhere)

---

## License

This project is licensed under the **MIT License**.

---

## Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
