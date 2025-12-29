# v1.0 Release Notes

Release Identification
Version: v1.0 (tagged as v1.0.0 for semantic compatibility)
Release Date: December 24, 2025
Baseline Reference: Built from main branch post-Baseline BL1 (Initial SCM Setup, tag BL1, commit 8b5412b)
Branch: main (direct release; no dedicated release/v1.0 branch used)
Commit: d6657d7
SCMP Reference: Conforms to Deliverable 5 scope for initial working system as defined in Software Configuration Management Plan
Overview
This is the first formal release of the To-Do List web application, delivering a functional prototype with core configuration items operational. The system provides essential task management capabilities with user authentication and basic responsive design. All features align with the approved initial scope; pending Change Requests (CRs) are deferred to v1.1.

Features and Configuration Items Delivered
User Authentication
Login and logout functionality
Secure session handling
Updated authentication flow for improved reliability
Persistent State Management
Authentication persistence using browser localStorage
Session retention across page refreshes
Task Management Dashboard
Create, view, and manage (update/delete) TO-DO items
Redesigned dashboard interface for clarity
Enhanced user experience elements
User Experience Improvements
Loading state management with indicators
Improved mobile responsiveness
Tailwind CSS styling baseline
Core Configuration Items (CIs) Versioned v1.0
App.tsx
Login.tsx
Dashboard.tsx
Supporting components and utilities in /src
tsconfig.json, tailwind.config.js, postcss.config.js, package-lock.json
Project structure: /src, /data, /docs directories established
Changes Since Baseline BL1
All features listed above are new (initial development from SCM setup baseline)
No bug fixes (initial release)
Known Limitations (Deferred to v1.1)
Task priority levels (High/Medium/Low) with color-coded badges → CR-001 (Open)
Due date/time frame with date picker and overdue highlighting → CR-002 (Open)
Theme color update to primary #880D1E, dark login background, centered card restyle → CR-003 (Open)
Installation and Setup Instructions
Clone the repository: git clone https://github.com/Gelila-Nebiyu/todo-scm-project.git
Checkout the release: git checkout v1.0.0
Install dependencies: npm install
Start development server: npm run dev (or equivalent Vite/React script)
Open http://localhost:5173 (default port) in browser
Use test credentials or register as needed (implementation-specific)
Verification
System tested for core functionality: authentication persistence, task CRUD operations, responsive behavior
No regressions from baseline
This release establishes a stable configuration for subsequent change-controlled enhancements in v1.1.
