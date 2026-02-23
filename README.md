# GenAI Workspace & Admin Platform

## 1. Project Overview
A unified React application combining a user-facing GenAI Workspace and an Admin Dashboard for platform management. Built with React, Vite, and Tailwind CSS.

## 2. Architecture Summary
- **Frontend**: React (TypeScript) + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **State Management**: Context API (Auth, Preferences)
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

## 4. Folder Structure
```
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
- Create a `.env` file in the root directory (optional for now, as mock data is used).
- Example `.env.example`:
  ```env
  VITE_API_BASE_URL=http://localhost:8000
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

The application uses a mock authentication strategy for development. To test different user roles, you need to manually update the mock data in two files.

### Default State (Admin User)
The default mock user is `test_user@company.com`, which is configured as an Admin.

### How to Switch to "Normal User" Mode
To test the application as a standard user (without Admin access):

1.  **Update Backend Mock Strategy** (`/backend/auth/mockStrategy.ts`):
    Change the email to one that is **NOT** in `backend/auth/admin_users.json`.
    ```typescript
    // backend/auth/mockStrategy.ts
    return {
      email: 'normal_user@company.com', // Changed from test_user@company.com
      name: 'Normal User',
      roles: ['user'],
      isAdmin: false,
    };
    ```

2.  **Update Frontend Auth Context** (`/src/shared/context/AuthContext.tsx`):
    Sync the frontend mock state to match the backend.
    ```typescript
    // src/shared/context/AuthContext.tsx
    // Inside useEffect and login function:
    setUser({
      id: '2',
      name: 'Normal User',
      email: 'normal_user@company.com',
      roles: ['user'] // REMOVE 'admin' from this array
    });
    ```

3.  **Verify Behavior**:
    - The "Switch to Admin View" button in the profile dropdown should **disappear**.
    - Accessing `/admin` directly should redirect to the home page or show a 403 Forbidden error.

### How to Switch Back to "Admin User" Mode
1.  **Update Backend Mock Strategy**:
    Change email back to `test_user@company.com` (or any email listed in `backend/auth/admin_users.json`).
2.  **Update Frontend Auth Context**:
    Change email back to `test_user@company.com` and add `'admin'` to the `roles` array.

## 10. Future Enhancement Roadmap
- **Real Backend Integration**: Replace mock APIs with real endpoints.
- **Enhanced Analytics**: Add more detailed metrics and visualizations.
- **User Management**: Implement user roles and permissions management.
- **Notifications**: Add real-time notifications for system alerts.
