
# TaskFlow Pro

TaskFlow Pro is a complete, production-ready, web-based to-do list application developed to demonstrate professional **Software Configuration Management (SCM)** practices alongside modern frontend engineering.
This repository represents the **final release (v1.1.0)**, with all approved change requests fully implemented and version-controlled.

---

## Project Information

| Item                    | Details                                                               |
| ----------------------- | --------------------------------------------------------------------- |
| **Repository**          | [todo-scm-project](https://github.com/Gelila-Nebiyu/todo-scm-project) |
| **Project Name**        | TaskFlow Pro                                                          |
| **Current Release**     | v1.1.0 (Final / Complete System)                                      |
| **Primary Language**    | TypeScript                                                            |
| **Framework & Tooling** | React, Vite, Tailwind CSS                                             |
| **License**             | MIT License                                                           |
| **Project Status**      | Complete – All planned features delivered under SCM control           |

---

## Project Overview

TaskFlow Pro is a responsive task management web application with secure authentication, advanced task handling, and customizable UI theming.
The project follows structured SCM workflows, including version control, documented change requests, and controlled releases.

The **v1.1.0 release** represents the finalized system, incorporating all functional and visual enhancements approved during development.

---

## Features (v1.1.0 – Final Release)

### User Authentication

* Secure login and logout functionality
* Session persistence using `localStorage`
* Default test credentials for demonstration and evaluation

### Task Management Dashboard

* Full CRUD operations (Create, Read, Update, Delete)
* Task priority levels with visual indicators:

  * **High** – Red badge
  * **Medium** – Yellow badge
  * **Low** – Green badge
* Due date selection via date picker
* Automatic overdue task highlighting
* Responsive, mobile-friendly layout

### Theme & Styling

* Custom primary theme color: **#880D1E**
* Dark-themed login page
* Centered, modern login card design
* Tailwind CSS-powered responsive UI

### User Experience

* Loading indicators for improved feedback
* Intuitive forms and interaction flows

### Optional AI Integration

* Gemini AI API support for advanced functionality
* Configurable via environment variables
* Fully optional and disabled by default

---

## Default Test Credentials

These credentials are provided for testing and demonstration purposes:

* **Username:** admin
* **Password:** password

---

## Project Structure

```text
.
├── .github/                # GitHub workflows and configuration
├── data/                   # Local data storage
├── docs/                   # SCM and project documentation
├── src/
│   ├── components/         # Login, Dashboard, TodoItem, and forms
│   ├── services/           # geminiService.ts
│   ├── types.ts            # Shared TypeScript types (priority, dueDate, etc.)
│   ├── App.tsx
│   └── main.tsx
├── LICENSE
├── package.json
├── tailwind.config.js      # Custom theme configuration (#880D1E)
├── tsconfig.json
├── vite.config.ts
├── .env.example            # Environment variable template
└── README.md               # Project documentation
```

---

## Installation and Setup

### Prerequisites

* Node.js **v18 or higher**
* npm

### Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Gelila-Nebiyu/todo-scm-project.git
cd todo-scm-project
```

### 2. Checkout the Latest Release (Recommended)

```bash
git checkout v1.1.0
```

Alternatively, use the `main` branch for the latest stable code.

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables (*Optional – AI Features Only*)

Create a `.env` file in the project root:

```env
VITE_API_KEY=your_gemini_api_key_here
```

*Note:* Obtain the API key from Google AI Studio. This step is optional and only required if Gemini AI features are enabled.

### 5. Start the Development Server

```bash
npm run dev
```

---

## Accessing the Application

Once the development server is running, open your browser and navigate to the local URL provided by Vite (typically):

```text
http://localhost:5173
```

---

## Usage Guide

* Log in using the default credentials
* Create tasks with:

  * Title and description
  * Priority level
  * Due date
* View:

  * Color-coded priorities
  * Overdue task alerts
* Edit or delete tasks as needed
* Experience the custom dark-themed login and vibrant task dashboard

---

## Release History

### v1.0.0 (24 Dec 2025)

* Initial working system with core authentication and task management

### v1.1.0 (Final Release)

* Complete implementation of all approved change requests:

  * Task priorities
  * Due dates
  * Custom theme

Detailed release notes are available at:
[Project Releases](https://github.com/Gelila-Nebiyu/todo-scm-project/releases)

---

## Contributing

This project follows structured SCM practices. Contributions should adhere to the following guidelines:

* Create feature branches for changes
* Reference relevant Change Requests when applicable
* Submit Pull Requests with clear, descriptive summaries

---

## License

This project is licensed under the **MIT License**.
See the [LICENSE](LICENSE) file for full license details.

---


