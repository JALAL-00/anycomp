# Anycomp - Fullstack Developer Project Assessment (ST COMP HOLDINGS SDN BHD)

This is a complete, production-grade implementation of the **Anycomp Specialist Registration and Management System**, developed as a full-stack proficiency assessment.

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
    JWT_SECRET=a-very-secure-secret-for-the-assessment
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
3.  Start the frontend server (the `.env.local` file is already included and configured):
    ```bash
    npm run dev
    ```
    *(The application will be available at `http://localhost:3000`)*

---

## 🔐 Login Credentials

An initial admin user is automatically created by the backend on the first run.

*   **URL:** `http://localhost:3000/login`
*   **Email:** `admin@stcomp.com`
*   **Password:** `AdminPassword123`

---

## Final Verification Flow

1.  **Login:** Open `http://localhost:3000/login` and sign in with the default admin credentials:
    *   **Email:** `admin@stcomp.com`
    *   **Password:** `AdminPassword123`
2.  **Dashboard:** You will be redirected to the **Specialists List** (`/admin/specialists`).
3.  **Create Service:** Click the **CREATE** button. Fill out the form, including Title, Description, Price, and upload at least one image. Click **Save & Create**.
4.  **Verify Creation:** You will be redirected back to the Specialists List. Your new service should appear in the table.
5.  **View Details:** Click on the row of the service you just created. You will be navigated to the **Service Detail Page** (e.g., `/admin/services/your-service-slug`). Verify that the uploaded images and all data are displayed correctly.
6.  **Edit Service:** On the detail page, click the **EDIT** button. A drawer will slide in from the right. Change the price or description and click **Confirm**. You will be returned to the detail page, which should now show the updated information.
7.  **Publish Service:** On the detail page, click the **PUBLISH** button. A confirmation modal will appear. Click **Save changes**.
8.  **Verify Publication:** You will be automatically redirected to the **Public Marketplace** (`/specialists`). Verify that your newly published service is now visible on this page with its cover image.

---
Project Screenshoots 
---
Specialist Dashboard:
![Image](https://github.com/user-attachments/assets/1afb32fe-6759-4c0c-8246-c72ff9a06f15)

Create New Service:
![Image](https://github.com/user-attachments/assets/cd7bed56-a0df-46c8-a701-6134efc7ec55)

Edit Service: 
![Image](https://github.com/user-attachments/assets/aa06923e-f587-4ad7-abc9-4b58fc1f8e4e)

Edit Service PopUp:
![Image](https://github.com/user-attachments/assets/972c0b1b-b515-45e9-a8e5-3bbac2639942)

Service Pulished:
---
For See the Publised Page: `http://localhost:3000/specialists`
---
![Image](https://github.com/user-attachments/assets/3b1f7bf5-bfa9-483e-91cb-2dd31adb9f0b)

Log out Specialist:
![Image](https://github.com/user-attachments/assets/6469fba6-5545-4069-bdd7-13dab18310d5)

login Specialist:
![Image](https://github.com/user-attachments/assets/e84eda55-c294-4ab4-acd3-a88ca3459eae)
