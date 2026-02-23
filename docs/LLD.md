# Low-Level Design (LLD) - GenAI Workspace & Admin Platform

## 1. Folder Structure

```
/src
  /modules
    /workspace      # User-facing module
      /components   # Workspace-specific components
      /pages        # Workspace pages
      /services     # Workspace-specific API logic
    /admin          # Admin dashboard module
      /components   # Admin-specific components
      /services     # Admin-specific API logic
  /shared           # Shared resources
    /components     # Reusable UI components (Button, Modal, Toast)
    /context        # Global contexts (Auth, Preferences)
    /services       # Shared API logic
  App.tsx           # Main application router
  main.tsx          # Application entry point
```

## 2. Component Hierarchy

### 2.1 Main Application (`App.tsx`)
- **Providers**: `AuthProvider`, `PreferencesProvider`
- **Router**: `BrowserRouter`
  - **Route**: `/workspace/*` -> `WorkspaceModule`
  - **Route**: `/admin/*` -> `RequireAdmin` -> `AdminModule`

### 2.2 Workspace Module (`WorkspaceModule.tsx`)
- **Layout**: `Header`, `Sidebar`, `MainContent`
- **State**: `searchQuery`, `viewMode`, `activeFilter`
- **Components**: `AppGrid`, `AppCard`, `AppList`

### 2.3 Admin Module (`AdminModule.tsx`)
- **Layout**: `Header`, `MainContent`
- **State**: `services`, `config`, `viewType`
- **Components**: `HealthSummaryCard`, `ServiceCard`, `ServiceDrawer`

## 3. Context Providers

### 3.1 AuthContext
- **State**: `user` (User object or null), `isAuthenticated` (boolean)
- **Functions**: `login`, `logout`
- **Source**: `src/shared/context/AuthContext.tsx`

### 3.2 PreferencesContext
- **State**: `isDarkMode`, `openInNewTab`
- **Functions**: `toggleDarkMode`, `toggleOpenInNewTab`
- **Source**: `src/shared/context/PreferencesContext.tsx`

## 4. Routing Configuration

- **Protected Routes**: Implemented via `RequireAdmin` wrapper component.
- **Redirects**: Unauthorized access to `/admin` redirects to `/workspace`.

## 5. Data Flow

1.  **Initialization**: `App.tsx` initializes contexts.
2.  **Authentication**: `AuthContext` checks for existing session (mocked via `localStorage`).
3.  **Data Fetching**:
    -   **Workspace**: Fetches app list from `src/shared/services/api.ts`.
    -   **Admin**: Fetches system config and health data from `src/modules/admin/services/api.ts`.
4.  **State Updates**: Components update local state or context state, triggering re-renders.

## 6. Role Guard Logic

The `RequireAdmin` component checks the `user` object from `AuthContext`.
-   If `user` is null or `user.roles` does not include `'admin'`, it renders `<Navigate to="/workspace" replace />`.
-   Otherwise, it renders the child components (Admin Module).
