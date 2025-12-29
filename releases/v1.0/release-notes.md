# v1.0 Release Notes

## Release Identification

- **Version:** v1.0 (tagged as `v1.0.0` for semantic compatibility)
- **Release Date:** December 24, 2025
- **Baseline Reference:** Built from `main` branch post-Baseline **BL1**  
  (Initial SCM Setup, tag `BL1`, commit `8b5412b`)
- **Branch:** `main`  
  (Direct release; no dedicated `release/v1.0` branch used)
- **Commit:** `d6657d7`
- **SCMP Reference:** Conforms to **Deliverable 5** scope for the initial working system as defined in the Software Configuration Management Plan

---

## Overview

This is the first formal release of the **To-Do List web application**, delivering a functional prototype with core configuration items operational. The system provides essential task management capabilities with user authentication and basic responsive design.

All implemented features align with the approved initial scope. Pending Change Requests (CRs) are explicitly deferred to **v1.1**.

---

## Features and Configuration Items Delivered

### User Authentication
- Login and logout functionality
- Secure session handling
- Updated authentication flow for improved reliability

### Persistent State Management
- Authentication persistence using browser `localStorage`
- Session retention across page refreshes

### Task Management Dashboard
- Create, view, update, and delete TO-DO items
- Redesigned dashboard interface for clarity
- Enhanced user experience elements

### User Experience Improvements
- Loading state management with visual indicators
- Improved mobile responsiveness
- Tailwind CSS styling baseline

---

## Core Configuration Items (CIs) — Versioned v1.0

- `App.tsx`
- `Login.tsx`
- `Dashboard.tsx`
- Supporting components and utilities in `/src`
- Configuration files:
  - `tsconfig.json`
  - `tailwind.config.js`
  - `postcss.config.js`
  - `package-lock.json`
- Project structure established:
  - `/src`
  - `/data`
  - `/docs`

---

## Changes Since Baseline BL1

- All listed features are **new**, representing initial development from the SCM setup baseline
- No bug fixes (initial release)

---

## Known Limitations (Deferred to v1.1)

- **CR-001:** Task priority levels (High / Medium / Low) with color-coded badges — *Open*
- **CR-002:** Due date and time frame with date picker and overdue highlighting — *Open*
- **CR-003:** Theme updates  
  - Primary color `#880D1E`  
  - Dark login background  
  - Centered card restyle — *Open*

---

## Installation and Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Gelila-Nebiyu/todo-scm-project.git
