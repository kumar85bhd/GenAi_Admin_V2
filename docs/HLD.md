# High-Level Design (HLD) - GenAI Workspace & Admin Platform

## 1. System Overview
The GenAI Workspace is a unified web application designed to provide a seamless experience for both end-users and platform administrators. It combines a user-facing workspace for accessing AI tools and an admin dashboard for monitoring system health and services.

## 2. Architecture
The application follows a full-stack architecture with a modular monolith frontend built with React, Vite, and Tailwind CSS, and a backend built with FastAPI (Python).

### 2.1 Modules
- **Backend (`/backend`)**: FastAPI server handling authentication, authorization, and API routes.
- **Workspace Module (`/src/modules/workspace`)**: The primary interface for general users. It allows users to browse, search, and launch AI applications.
- **Admin Module (`/src/modules/admin`)**: A restricted area for administrators to monitor service health, view metrics, and manage platform configurations.
- **Shared Layer (`/src/shared`)**: Contains reusable UI components, contexts (Auth, Preferences), and utility functions shared across both modules.

### 2.2 Authentication & Authorization
- **Authentication**: Managed via a FastAPI backend using JWT (JSON Web Tokens) with RS256 signature verification.
- **Authorization**: Role-based access control (RBAC).
  - `user`: Access to Workspace.
  - `admin`: Access to Workspace and Admin Dashboard.
- **Route Protection**: The `RequireAdmin` component guards the `/admin` routes on the frontend, and `admin_guard` dependency guards API routes on the backend.

## 3. Routing Model
The application uses `react-router-dom` for client-side routing.
- `/workspace/*`: Entry point for the user workspace.
- `/admin/*`: Entry point for the admin dashboard (Protected).
- `/`: Redirects to `/workspace`.

## 4. Theme Handling
- **Dark/Light Mode**: Managed via `PreferencesContext`.
- **Implementation**: Uses Tailwind's `dark` mode class strategy. Preferences are persisted in `localStorage`.

## 5. Future Extensibility
- **Database Integration**: The current JSON-based data storage can be replaced with a robust database like PostgreSQL or MongoDB.
- **Micro-frontends**: The modular structure allows for potential separation into distinct micro-frontends if the application scale demands it.
