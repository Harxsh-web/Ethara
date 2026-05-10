# KISAN Admin Dashboard - App Info & Flow

## 🌾 Project Overview
**KISAN Admin** is a specialized administrative platform designed to manage the ecosystem of farmers, buyers, and administrators. It serves as the central command center for the Kissan Market, providing robust tools for user lifecycle management, verification, and platform oversight.

---

## 🚦 Application Flows

### 1. Authentication Flow (JWT Based)
1.  **Entry**: User arrives at `/signin`.
2.  **OTP Request**: User enters their phone number. `authService.sendOtp` is triggered.
3.  **Verification**: User enters the received OTP. `authService.verifyOtp` validates the code.
4.  **Session Establishment**:
    *   Server returns a **JWT Token** and User Profile.
    *   Data is stored in **Redux** (`userSlice`) and persisted to **LocalStorage**.
    *   User is redirected to the root `/` (Admin Dashboard).
5.  **Security**: Every subsequent API call automatically attaches the `Authorization: Bearer <token>` header via the `apiCall` utility.

### 2. User Management Flow
1.  **Navigation**: Admin clicks "User Management" in the sidebar.
2.  **Data Fetching**: `userService.getAllUsers` retrieves the full list.
3.  **View Selection**:
    *   **List View**: Detailed table with sortable columns and avatars.
    *   **Grid View**: Visual cards highlighting user roles and verification status.
4.  **Profile Oversight**:
    *   Clicking "View Profile" triggers `userService.getUserById`.
    *   Detailed information (KYC, Address, Joined Date) is displayed in a slide-out **Sheet**.
5.  **Account Management**:
    *   Admin can delete accounts via `userService.deleteUser` after a mandatory confirmation dialog.
    *   "Add User" provides the entry point for creating new community members.

### 3. Navigation & State
*   **Sidebar**: A dynamic, `useLocation`-aware navigation system that highlights the active route.
*   **Role-Based UI**: The interface adapts labels and badges based on the user's role (`Admin`, `Farmer`, `Buyer`).
*   **Global Search**: Integrated filtering allows admins to find users instantly by name, email, or phone.

---

## 🛠 Architectural Pattern (Service Layer)

The application follows a modular **Service-Repository** pattern to keep the UI clean:

1.  **Constants (`src/constants/apiRoutes.ts`)**: Defines all backend URL patterns.
2.  **Services (`src/services/`)**: Contains logic-heavy functions (`userService`, `authService`) that interact with the `apiCall` utility.
3.  **Components**: Simply call service methods and handle the resulting data/errors, remaining decoupled from the raw API structure.

---

## 🎨 Visual Identity
*   **Primary Theme**: Agricultural Green (`#059669`).
*   **Iconography**: Centered around the `Sprout` and `Users` icons to reflect growth and community.
*   **Components**: Powered by **shadcn/ui** for a consistent, high-end accessibility-focused experience.
