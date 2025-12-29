
# TaskFlow Pro - Setup Guide

This guide will help you run TaskFlow Pro within your existing project structure.

Configuration Identification

Repository: https://github.com/Gelila-Nebiyu/todo-scm-project
Project Name: TaskFlow Pro
Description: A responsive web-based to-do list application with user authentication, advanced task management, and optional AI integration
Primary Language: TypeScript
Framework: React + Vite + Tailwind CSS
Current Release: v1.1.0 (Complete System - All Change Requests Implemented)
License: MIT License
Status: Complete - All planned features delivered under SCM control

Project Overview
TaskFlow Pro is a full-featured to-do list web application designed to demonstrate professional software development and Software Configuration Management (SCM) practices. The system provides secure task management with modern UI/UX elements, persistence, and customizable styling.
All approved Change Requests have been implemented in this final release:

Task priorities with visual indicators
Due dates with calendar selection and overdue alerts
Custom theme application (#880D1E primary color)

Optional Gemini AI integration is available for enhanced functionality (requires API key).
Default Test Credentials

Username: admin
Password: password

Features (v1.1.0 - Complete)

User Authentication
Secure login/logout
Session persistence across browser sessions (localStorage)

Task Management Dashboard
Full CRUD operations (Create, Read, Update, Delete) for tasks
Priority levels: High (red badge), Medium (yellow badge), Low (green badge)
Due date selection with date picker
Overdue task highlighting
Responsive, mobile-friendly layout

Theme & Styling
Primary color: #880D1E
Dark background on login page
Centered, modern login card design
Tailwind CSS powered responsive UI

User Experience
Loading indicators
Intuitive forms and feedback

Optional AI Integration
Gemini API support for advanced features (configure via .env)


Project Structure
text.
├── .github/            # GitHub workflows and configuration
├── data/               # Local data storage
├── docs/               # SCM documentation
├── src/
│   ├── components/     # Login.tsx, Dashboard.tsx, TodoItem.tsx, forms
│   ├── services/       # geminiService.ts
│   ├── types.ts        # Type definitions (including priority and dueDate)
│   ├── App.tsx
│   └── main.tsx
├── LICENSE
├── package.json
├── tailwind.config.js  # Custom theme (#880D1E primary)
├── tsconfig.json
├── vite.config.ts
├── .env.example        # Template (create .env locally)
└── README.md           # This file
Installation and Setup
Prerequisites

Node.js (v18 or higher)
npm

Steps

Clone the Repositorytextgit clone https://github.com/Gelila-Nebiyu/todo-scm-project.git
cd todo-scm-project
Checkout Latest Release (Recommended)textgit checkout v1.1.0   # Once tagged and released(Alternatively, use main branch for latest)
Install Dependenciestextnpm install
Configure Environment (Optional for AI Features)
Create a .env file in the project root:textVITE_API_KEY=your_gemini_api_key_hereObtain your key from Google AI Studio.
Start the Development Servertextnpm run dev
Access the Application
Open the provided local URL (typically http://localhost:5173 or similar).

Usage

Log in with default credentials
Create tasks with priority, due date, and description
View color-coded priorities and overdue alerts
Manage tasks via the intuitive dashboard
Experience the custom dark-themed login and vibrant task interface

Release History

v1.0.0 (24 Dec 2025): Initial Working System - Core authentication and task management
v1.1.0 (Planned/Final): Complete implementation of all Change Requests (priorities, due dates, theme)

Detailed release notes available at:
https://github.com/Gelila-Nebiyu/todo-scm-project/releases
Contributing
This project follows structured SCM practices. For contributions:

Create feature branches
Reference Change Requests if applicable
Submit Pull Requests with clear descriptions

License
This project is licensed under the MIT License - see the LICENSE file for details.
