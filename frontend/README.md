# Frontend - ID Card Generator

This is the frontend for the ID Card Generator project, built with **React** and **Vite**. It provides a user-friendly interface for designing, editing, and managing ID cards.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack & Packages](#tech-stack--packages)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Contributing](#contributing)

---

## Project Overview

This application allows users to:
- Create and design custom ID cards
- Edit and preview card designs
- Manage user accounts and authentication
- Export designs as SVG or images

---

## Tech Stack & Packages

- **React** (UI library)
- **Vite** (development/build tool)
- **Redux Toolkit** (state management)
- **React Router** (routing)
- **Other dependencies** (see `package.json` for full list and versions)



### Example of Key Packages and Versions


| Package              | Version    | Description                                 |
|----------------------|------------|---------------------------------------------|
| @emotion/react       | ^11.14.0   | Emotion CSS-in-JS library for styling       |
| @emotion/styled      | ^11.14.0   | Styled components for Emotion               |
| @mui/material        | ^7.1.1     | Material-UI React components                |
| @reduxjs/toolkit     | ^2.8.2     | Redux state management toolkit              |
| axios                | ^1.9.0     | Promise-based HTTP client                   |
| bootstrap            | ^5.3.6     | CSS framework for responsive design         |
| file-saver           | ^2.0.5     | Save files on the client-side               |
| html2canvas          | ^1.4.1     | HTML to canvas rendering                    |
| jszip                | ^3.10.1    | Create, read, and edit .zip files           |
| react                | ^19.1.0    | React core library                          |
| react-color          | ^2.19.3    | Color picker components for React           |
| react-dom            | ^19.1.0    | React DOM rendering                         |
| react-easy-crop      | ^5.4.2     | Crop images with React                      |
| react-icons          | ^5.5.0     | Popular icon packs as React components      |
| react-redux          | ^9.2.0     | Official React bindings for Redux           |
| react-router-dom     | ^7.6.1     | Declarative routing for React               |
| xlsx                 | ^0.18.5    | Parse and write spreadsheet files           |


## Folder Structure

frontend/
│
├── public/                # Static assets (images, SVGs)
├── src/
│   ├── assets/            # Project-specific assets
│   ├── components/        # Reusable React components (Navbars, etc.)
│   ├── pages/             # Main application pages and routes
│   ├── redux/             # Redux slices and store setup
│   └── utils/             # Utility/helper functions
│
├── svgcompreser           # have the python script for svgcompreser
├── package.json           # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── eslint.config.js       # ESLint configuration
└── README.md              # Project documentation
```

---

## Getting Started
```

### 1. Install Dependencies

```sh
npm install
```

### 2. Start the Development Server

```sh
npm run dev
```
- The app will be available at `http://localhost:5173` (default Vite port).

## Features

- Modern React with fast Vite development
- Modular and reusable component structure
- State management with Redux Toolkit
- SVG and image asset support
- User authentication and account management
- Export ID cards as SVG/images
- Responsive design


## Contact

For questions or support, contact [ayyappan.mariyappan@interrt.com]
