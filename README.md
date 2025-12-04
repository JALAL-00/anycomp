# Anycomp : Full-Stack Project

This is a complete, production-grade implementation of the **Anycomp Specialist Registration and Management System**, developed as a full-stack proficiency assessment.

## Live Demo

Access the deployed application here:

*   **Main Application:** [https://anycomp-jalal-project.vercel.app](https://anycomp-jalal-project.vercel.app)
*   **Public Marketplace:** [https://anycomp-jalal-project.vercel.app/specialists](https://anycomp-jalal-project.vercel.app/specialists)

---

## 🔐 Login Credentials

Use these credentials to access the Admin Dashboard on both **Localhost** and the **Live Demo**:

*   **Login URL (Live):** [https://anycomp-jalal-project.vercel.app/login](https://anycomp-jalal-project.vercel.app/login)
*   **Login URL (Local):** `http://localhost:3000/login`
*   **Email:** `admin@stcomp.com`
*   **Password:** `AdminPassword123`

---

## Local Setup and Installation

### A. Prerequisites

1.  **Node.js:** v18 or higher.
2.  **PostgreSQL:** An active instance running locally (Default port `5432`).
3.  **Database Creation:** You **must** create an empty database named `anycomp_db` before running the backend.

### B. Backend Setup (`/backend`)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` folder and add the following, replacing `your_password_here` with your PostgreSQL password:
    ```env
    PORT=5002
    NODE_ENV=development

    # Database Configuration
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=your_password_here
    DB_DATABASE=anycomp_db

    # Security
    JWT_SECRET=e4a7b1f3c9d8e2f6a1b5c8d7e6f4a2b9c0d3e8f1a7b6c5d4e3f2a1b0c9d8e7f6
    ```
4.  Run all database migrations to build the schema:
    ```bash
    npm run migration:run
    ```
5.  Start the backend server:
    ```bash
    npm run dev
    ```
    *(The API will be running at `http://localhost:5002`)*

### C. Frontend Setup (`/frontend`)

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.local` file in the `frontend` folder with the following content:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5002/api
    ```
4.  Start the frontend application:
    ```bash
    npm run dev
    ```
    *(The application will be available at `http://localhost:3000`)*

---

## Final Verification Flow

1.  **Login:** Open the login page (Local or Live) and sign in with the default admin credentials.
2.  **Dashboard:** You will be redirected to the **Specialists List** (`/admin/specialists`).
3.  **Create Service:** Click the **CREATE** button. Fill out the form, including Title, Description, Price, and upload at least one image. Click **Save & Create**.
4.  **Verify Creation:** You will be redirected back to the Specialists List. Your new service should appear in the table.
5.  **View & Edit Service:** Click on the row of the service you just created to navigate to the **Service Detail Page**. Click the **EDIT** button. A drawer will slide in from the right. Change the price or description and click **Confirm**. You will be returned to the detail page, which should now show the updated information.
6.  **Publish Service:** On the detail page, click the **PUBLISH** button. A confirmation modal will appear. Click **Save changes**.
7.  **Verify Publication:** You will be automatically redirected to the **Public Marketplace** (`/specialists`). Verify that your newly published service is now visible on this page with its cover image.

---
### Project Screenshots
---
**Specialist Dashboard:**
![Image](https://github.com/user-attachments/assets/1afb32fe-6759-4c0c-8246-c72ff9a06f15)

---
**Create New Service:**
![Image](https://github.com/user-attachments/assets/cd7bed56-a0df-46c8-a701-6134efc7ec55)

---
**Service Detail Page & Edit Drawer:**
![Image](https://github.com/user-attachments/assets/aa06923e-f587-4ad7-abc9-4b58fc1f8e4e)

---
**Service Published (Public Marketplace):**

To view the public page, navigate to `http://localhost:3000/specialists` after publishing a service.
![Image](https://github.com/user-attachments/assets/3b1f7bf5-bfa9-483e-91cb-2dd31adb9f0b)

---
**Login & Logout:**
![Image](https://github.com/user-attachments/assets/e84eda55-c294-4ab4-acd3-a88ca3459eae)
---
![Image](https://github.com/user-attachments/assets/6469fba6-5545-4069-bdd7-13dab18310d5)

---
The project features a **PostgreSQL** backend managed by a robust **Next.js/React** frontend with **JWT** for secure administrative access, designed to be a pixel-perfect match of the provided Figma designs.

## Key Features Implemented

*   **Full-Stack Architecture:** Next.js (Frontend) + Node.js/Express/TypeORM (Backend).
*   **Database:** PostgreSQL with transactional migrations to create all required tables.
*   **Admin Dashboard:** A complete CRUD interface for "Specialist" services, including a filterable list view (All/Drafts/Published), live search, and custom pagination.
*   **Service Detail Page:** A dynamic page to view full service details, including the image gallery, pricing, and description.
*   **Dynamic Image Management:** Users can instantly update any of the three service images directly from the detail page via a dedicated API endpoint.
*   **Slide-In Edit Drawer:** A non-disruptive, right-side drawer for editing core service details (Title, Description, Price, etc.), matching the Figma UI.
*   **Create Service Page:** A dedicated, feature-rich page for creating new services with a layout that mirrors the polished detail page.
*   **Publishing Workflow:** A complete, modal-confirmed flow that transitions a service from a draft state to public visibility and redirects the user to the public marketplace.
*   **Public Marketplace:** A public-facing page (`/specialists`) that displays all published services with their cover images and prices.
*   **Security (Bonus):** Implemented JWT Authentication and a client-side `AuthGuard` to enforce Admin-Only access to all management pages.

---

## Tech Stack Summary

| Component  | Technology                                                              | Notes                                                               |
| :--------- | :---------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, Material UI, Redux Toolkit | Client-side application with state management and component architecture. |
| **Backend**  | Node.js, Express, TypeScript, TypeORM                                   | RESTful API with middleware, services, and error handling.          |
| **Database** | PostgreSQL                                                              | Relational database (strictly NOT MongoDB).                         |
| **Auth**     | JWT, BCrypt                                                             | Admin-only access enforcement on critical API endpoints.            |