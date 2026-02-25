# GenAI Workspace & Admin Platform

## 1. Project Overview
A unified React application combining a user-facing GenAI Workspace and an Admin Dashboard for platform management. Built with React, Vite, and Tailwind CSS.

## 2. Architecture Summary
- **Frontend**: React (TypeScript) + Vite
- **Backend**: FastAPI (Python)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: Context API (Auth, Preferences)
- **Authentication**: JWT RS256 authentication
- **Modules**:
  - **Workspace**: User interface for AI tools.
  - **Admin**: Dashboard for system health monitoring.

## 3. Tech Stack
- **React 18+**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)
- **Recharts** (Charts)
- **FastAPI** (Backend)
- **Uvicorn** (ASGI Server)
- **Pydantic** (Data Validation)

## 4. Folder Structure
```
/backend            # FastAPI backend logic
  /auth             # Authentication strategies and dependencies
  /routes           # API routes
  /models           # Pydantic models
  /data             # JSON data storage
  /utils            # Utility functions
  main.py           # FastAPI application entry point
  config.py         # Configuration settings
/src
  /modules
    /workspace      # User-facing module
    /admin          # Admin dashboard module
  /shared           # Shared components, contexts, services
  App.tsx           # Main application router
  main.tsx          # Application entry point
```

## 5. How to Run Locally

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd genai-workspace
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the application**:
    Navigate to `http://localhost:3000` in your browser.

## 6. Environment Setup
- Create a `.env` file in the root directory.
- Example `.env.example`:
  ```env
  JWT_PUBLIC_KEY_PATH=./public_key.pem
  JWT_ALGORITHM=RS256
  JWT_ISSUER=your_issuer
  JWT_AUDIENCE=your_audience
  ```

## 7. Build Instructions
To build the application for production:
```bash
npm run build
```
The output will be in the `dist` directory.

## 8. Role-Based Routing
- **Workspace**: Accessible to all authenticated users.
- **Admin**: Accessible only to users with the `admin` role.
- **Guard**: The `RequireAdmin` component protects the `/admin` route.

## 9. Testing User Roles (Admin vs Normal User)

The application uses a FastAPI backend with JSON files for user data.

### Default Users
- **Admin User**: `admin@samsung.com`
- **Normal User**: `guest@samsung.com`

### How to Switch Roles
To test the application as a standard user or an admin, simply log out and log back in with the respective credentials.

1.  **Admin Configuration** (`/backend/data/admin_users.json`):
    This file contains an array of emails that are granted admin privileges.
    ```json
    {
      "admins": [
        "admin@samsung.com"
      ]
    }
    ```

2.  **User Configuration**:
    The authentication system extracts the email from the JWT token. The role is determined by checking if the email exists in `admin_users.json`.

3.  **Verify Behavior**:
    - When logged in as `guest@samsung.com`, the "Switch to Admin View" button in the profile dropdown should **disappear**.
    - Accessing `/admin` directly as a normal user should redirect to the home page or show a 403 Forbidden error.

## 10. Future Enhancement Roadmap
- **Real Backend Integration**: Replace mock APIs with real endpoints.
- **Enhanced Analytics**: Add more detailed metrics and visualizations.
- **User Management**: Implement user roles and permissions management.
- **Notifications**: Add real-time notifications for system alerts.

## 11. Recent Updates (Phase 1)
### Hero Redesign (Phase 1 Update)
- **New Hero Component**: Added a dedicated `Hero` component with:
  - **Height**: Fixed 280px-300px for consistency.
  - **Styling**: Premium glassmorphism with subtle gradient backgrounds (Slate/Indigo).
  - **Illustration**: Custom CSS-based 3D-style Robot Character with animated expressions.
  - **Responsiveness**: Adaptive layout that hides illustration on mobile.
- **Header**: Reduced height to 64px (h-16) for better screen real estate.
- **Performance**: Optimized for zero layout shift and fast loading.

### Layout Architecture (Phase 5 Update)
- **Navigation**: Intelligent collapsing Top Navigation (`TopNavigation.tsx`).
  - Collapses to compact mode on scroll (>80px).
  - Expands when returning to top.
  - Smooth `framer-motion` transitions for height, opacity, and padding.
- **Scroll Optimization**:
  - Main content area handles scrolling (`overflow-y-auto`).
  - Body scroll locked (`overflow-hidden`).
  - Scrollbar visually hidden but functional.
- **Hero**: Integrated into scrollable area, triggering nav collapse when scrolled past.
- **Category System**: Dynamic tabs adapt to collapsed state (labels hide/show).
