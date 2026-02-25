# User-Level Design (ULD) - GenAI Workspace & Admin Platform

## 1. Overview
The GenAI Workspace is a unified platform providing users with access to various AI tools and an administrative dashboard for system monitoring.

## 2. User Personas
- **Standard User**: Accesses the workspace to use AI tools, manage favorites, and customize their interface theme.
- **Administrator**: Has all standard user capabilities plus access to the Admin Dashboard for monitoring system health and configuration.

## 3. User Personalization Flow
Users can personalize their workspace experience through themes and favorite apps.

### 3.1 Preference Retrieval Lifecycle
1. **Authentication**: The user logs in using their credentials.
2. **Initialization**: Upon successful login, the application automatically retrieves the user's saved preferences (theme and favorite apps) from the server.
3. **Application**: 
   - The interface immediately applies the saved theme (Light or Dark).
   - The workspace dashboard highlights the user's favorite apps and populates the "Favorites" tab.
4. **Fallback**: If the server is unreachable or the user is new, default preferences (Dark theme, no favorites) are applied and saved locally.

### 3.2 Managing Preferences
- **Theme Toggling**: Users can switch between Light and Dark modes via the profile dropdown menu. The change is applied instantly and saved to their profile.
- **Favoriting Apps**: Users can click the star icon on any app card to add or remove it from their favorites. The updated list is immediately synced with their profile, ensuring their favorites are available across devices.

## 4. Key Features
- **Dynamic Workspace**: A responsive grid of AI tools categorized by function (Productivity, Knowledge, etc.).
- **Intelligent Navigation**: A collapsible left sidebar that expands on hover, providing access to Home, Favorites, and all tool categories in a clean, vertical layout.
- **Quick Access**: A dedicated "Favorites" view for frequently used tools.
- **Admin Dashboard**: Real-time monitoring of backend services, API health, and system configuration (restricted access).
