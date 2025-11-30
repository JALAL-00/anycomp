# Anycomp - Fullstack Developer Project Assessment (ST COMP HOLDINGS SDN BHD)

This is a complete, production-grade implementation of the Anycomp Specialist Registration and Management System, developed as a full-stack proficiency assessment.

The project features a PostgreSQL backend managed by a robust Next.js/React frontend with JWT/RBAC for secure administrative access.

## 🚀 Key Features Implemented

*   **Full-Stack Architecture:** Next.js (Frontend) + Node.js/Express/TypeORM (Backend).
*   **Database:** PostgreSQL with transactional migrations (`users`, `specialists`, `media`, `service_offerings`, `platform_fee`).
*   **Admin Dashboard (Page 1):** Full List View, Filtering (All/Drafts/Published), Search, and Pagination.
*   **Specialist Management (Pages 2 & 3):** Dedicated UI for seamless creation and editing of specialist records.
*   **Publishing Flow (Module 5):** Functional button for publishing/unpublishing specialists (`PATCH /publish`).
*   **Security (Bonus Requirement):** Implemented JWT Authentication and Role-Based Access Control (`AuthGuard` / `protect` middleware) to enforce Admin-Only access to the management pages.

---

## 💻 Tech Stack Summary

| Component | Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), TypeScript, Tailwind CSS, Material UI, Redux Toolkit | Client-side application with state management and pixel-perfect Figma adherence. |
| **Backend** | Node.js, Express, TypeScript, TypeORM | RESTful API architecture with error handling and transaction management. |
| **Database** | PostgreSQL | Relational database (explicitly NOT MongoDB as requested). |
| **Auth** | JWT, BCrypt, RBAC | Admin-only access enforcement on critical endpoints. |

---

## 🛠️ Local Setup and Installation

### A. Prerequisites

1.  **Node.js:** v18+
2.  **PostgreSQL:** Instance running locally (Default port 5432).
3.  **Database Creation:** You must create an empty database named `anycomp_db` (or whatever you set in your `.env`).

### B. Backend Setup (Port 5002)

1.  Navigate to the `backend` directory.
    ```bash
    cd backend
    ```
2.  Create the environment file and set up credentials (Port **5002** is used).
    ```bash
    cp .env.example .env
    # NOTE: Fill in your PostgreSQL credentials and a JWT_SECRET
    ```
3.  Install dependencies.
    ```bash
    npm install
    ```
4.  Run Database Migrations and initial Admin Seeding.
    ```bash
    npm run migration:run
    ```
5.  Start the backend server.
    ```bash
    npm run dev
    # API is available at: http://localhost:5002/api
    ```
    **Default Admin Account:** `admin@stcomp.com` / `AdminPassword123` (Set by auth.service.ts)

### C. Frontend Setup (Port 3000)

1.  Navigate to the `frontend` directory.
    ```bash
    cd ../frontend
    ```
2.  Create environment file (already set to port 5002 in `.env.local.example`).
    ```bash
    cp .env.local.example .env.local
    ```
3.  Install dependencies.
    ```bash
    npm install
    ```
4.  Start the frontend application.
    ```bash
    npm run dev
    # Application is available at: http://localhost:3000/
    ```

## 🔐 Final Verification Flow

1.  **Access:** Navigate to `http://localhost:3000/login`.
2.  **Admin Login:** Sign in with: `admin@stcomp.com` / `AdminPassword123`.
3.  **Redirect Check:** You are automatically redirected to the **All Specialists Page (Page 1)**: `/admin/specialists`.
4.  **Creation Check (Page 2):** Click **CREATE** on Page 1. Fill out the **Title, Description, and Price** fields (required fields).
5.  **Submission Check (Page 3):** Click **Create Specialist** $\rightarrow$ You are redirected to the **Edit Page** with a new URL (`/edit/:id`).
6.  **Publishing Check:** Click the **Publish** button $\rightarrow$ Alert "Specialist published successfully!".
7.  **Final Flow Check:** Navigate back to `/admin/specialists` (Page 1). The newly created specialist should be visible in the list.

---

***Good luck with the review, a glorious future awaits you.***