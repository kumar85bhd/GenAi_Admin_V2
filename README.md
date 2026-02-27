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
  DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/genai_workspace
  ```

### PostgreSQL Setup
1. Install PostgreSQL and ensure it is running.
2. Create a database named `genai_workspace` (or your preferred name).
3. Set the `DATABASE_URL` environment variable in your `.env` file to point to your database.
4. The backend will automatically create the necessary tables (`user_preferences`) on startup using SQLAlchemy.

## 7. API Endpoints

### User Preferences (New)
- `GET /api/preferences`: Fetch preferences for the authenticated user. Auto-creates a default record if none exists.
- `PUT /api/preferences/theme`: Update theme preference (accepts `light` or `dark`).
- `PUT /api/preferences/favorites`: Overwrite the full favorites list (accepts a list of integer IDs).

## 8. Build Instructions
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
- **Navigation**: Collapsible left sidebar (`SidebarNavigation.tsx`) for main navigation (Home, Favorites, Categories).
  - Expands on hover from 72px to 240px.
  - Vertical layout removes the need for a 'More' dropdown for categories.
- **Header**: The main header is now dedicated to the greeting, search, view mode, and profile controls.
- **Scroll Optimization**:
  - Main content area handles scrolling (`overflow-y-auto`).
  - Body scroll locked (`overflow-hidden`).
  - Scrollbar visually hidden but functional.
- **Hero**: Integrated into scrollable area, triggering nav collapse when scrolled past.
## 12. Admin Architecture (Phase 6 Update)
- **Structured Dashboard Console**: The Admin page has been refactored into a clean, neutral Infrastructure Dashboard.
- **Layout**: Features a left sidebar (`AdminSidebar.tsx`) for filtering services by category, and a main content area (`AdminDashboardCards.tsx`) displaying grouped service cards.
- **Design Philosophy**: Strict adherence to a stable, professional UI. Removed all animations, glow effects, and mock polling.
- **Metrics Handling**: Service cards (`AdminCard.tsx`) fetch their own metrics on mount with a manual refresh option, ensuring no background polling overhead.
- **Color Strategy**: Utilizes a neutral slate palette with indigo accents for active states, supporting both light and dark modes seamlessly.

## 13. Admin Enhancements (Phase 7 Update)
- **Tabbed Application Management**: The "Applications" page now features a tabbed interface for managing:
  - **Workspace Applications**: The main list of apps available to users.
  - **Admin Dashboard Links**: Configurable links for the admin dashboard, stored in `admin_config.json`.
  - **Manage Categories**: A dedicated tab for creating and editing application categories.
- **Enhanced Tables**:
  - **Sticky Headers**: Tables now have sticky headers for better usability.
  - **Client-Side Sorting**: Columns are sortable by clicking on headers.
  - **Category Dropdown**: Application creation/editing now uses a dropdown populated from the database.
- **Content Management**:
  - **Rich Content Editing**: Description and Key Features are managed via a dedicated modal.
  - **Metrics Control**: A toggle to enable/disable metrics fetching for each application.
- **Backend Improvements**:
  - **JSON-Backed Dashboard Links**: Full CRUD support for dashboard links using `admin_config.json` with atomic file writes.
  - **Validation**: Strict validation for all inputs, including URL formats and unique constraints.
