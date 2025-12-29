
# TaskFlow Pro - Setup Guide

This guide will help you run TaskFlow Pro within your existing project structure.

## Folder Organization

To make the app run correctly, organize your files as follows:

1.  **Project Root (Main Folder)**:
    - `package.json`
    - `tsconfig.json`
    - `vite.config.ts`
    - `index.html`
    - `.env` (Create this file!)
    - `README.md`
2.  **`src/` Folder**:
    - `index.tsx`
    - `App.tsx`
    - `types.ts`
    - `metadata.json`
    - `components/` (contains `Login.tsx`, `Dashboard.tsx`, `TodoItem.tsx`)
    - `services/` (contains `geminiService.ts`)

## Step-by-Step Installation

### 1. Install Dependencies
Open your terminal in the project root and run:
```bash
npm install
```

### 2. Configure Your API Key
1. Create a file named `.env` in the project root.
2. Add the following line to the file:
   ```env
   API_KEY=your_actual_gemini_api_key_here
   ```
   *Get your key at [aistudio.google.com](https://aistudio.google.com/).*

### 3. Start the App
Run the development server:
```bash
npm run dev
```

### 4. Open in Browser
Vite will show a URL (likely `http://localhost:3000`). Click it or copy it into your browser.

## Login Details
- **Username**: `admin`
- **Password**: `password`
