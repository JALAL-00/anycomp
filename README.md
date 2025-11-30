# Anycomp - Fullstack Developer Project Assessment (ST COMP HOLDINGS SDN BHD)

This is a complete, production-grade implementation of the **Anycomp Specialist Registration and Management System**, developed as a full-stack proficiency assessment.

The project features a **PostgreSQL** backend managed by a robust **Next.js/React** frontend with **JWT/RBAC** for secure administrative access.

## 🚀 Key Features Implemented

*   **Full-Stack Architecture:** Next.js (Frontend) + Node.js/Express/TypeORM (Backend).
*   **Database:** PostgreSQL with transactional migrations (`users`, `specialists`, `media`, `service_offerings`, `platform_fee`).
*   **Admin Dashboard (Page 1):** Full List View, Filtering (All/Drafts/Published), Search, and Pagination.
*   **Specialist Management (Pages 2 & 3):** Dedicated UI for seamless creation and editing of specialist records using "Smart Mode Detection".
*   **Media Management:** Multi-slot image upload support (3 slots) mapped to specific display orders.
*   **Dynamic Forms:** "Additional Offerings" implementation with chip-based input logic.
*   **Publishing Flow:** Modal-confirmed publishing workflow (`PATCH /publish`).
*   **Security (Bonus Requirement):** Implemented JWT Authentication and Role-Based Access Control (`AuthGuard`) to enforce Admin-Only access.

---

## 💻 Tech Stack Summary

| Component | Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS, Material UI, Redux Toolkit | Client-side application with state management and pixel-perfect Figma adherence. |
| **Backend** | Node.js, Express, TypeScript, TypeORM | RESTful API architecture with error handling, strict validation, and transaction management. |
| **Database** | PostgreSQL | Relational database (strictly NOT MongoDB). |
| **Auth** | JWT, BCrypt, RBAC | Admin-only access enforcement on critical endpoints. |

---

## 🛠️ Local Setup and Installation

### A. Prerequisites

1.  **Node.js:** v18 or higher.
2.  **PostgreSQL:** Instance running locally on default port `5432`.
3.  **Database:** You **must** create a database named `anycomp_db` before running the backend.

### B. Backend Setup (Port 5002)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env` file in the `backend` folder with the following content:
    ```env
    PORT=5002
    NODE_ENV=development

    # Database Configuration (Update password if needed)
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=your_password_here
    DB_DATABASE=anycomp_db

    # Security
    JWT_SECRET=super_secure_assessment_key_2024
    ```

4.  Run Migrations (Create Tables) and Seed Admin:
    ```bash
    npm run migration:run
    ```

5.  Start the backend server:
    ```bash
    npm run dev
    ```
    *(Console should show: "Server running on port 5002")*

### C. Frontend Setup (Port 3000)

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Create a `.env.local` file in the `frontend` folder:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5002/api
    ```

4.  Start the frontend application:
    ```bash
    npm run dev
    ```

---

## 🔐 Final Verification Flow

To verify the assessment requirements:

1.  **Login:** Open `http://localhost:3000/login`
    *   **Email:** `admin@stcomp.com`
    *   **Password:** `AdminPassword123`
2.  **Dashboard (Page 1):** You will be redirected to the Specialists list.
3.  **Create (Page 2):** Click **CREATE**. Fill in *Title, Description, Price*, and upload mock images.
4.  **Edit & Publish (Page 3):** Click **Create**. The page will reload in "Edit Mode". Click **Publish**, confirm the Modal, and verify the status change.
5.  **List Check:** Go back to the Dashboard. Use the **Published** filter tab to find your new record.

---

### 👨‍💻 Author

**Role:** Full-Stack Developer Assessment
**For:** ST COMP HOLDINGS SDN BHD