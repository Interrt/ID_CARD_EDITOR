# ID Card Generator Project

This is a full-stack MERN (MongoDB, Express, React, Node.js) project for generating, editing, and managing ID cards. The project is divided into two main parts: the backend (API and file handling) and the frontend (user interface and ID card design tools).

---

## Project Structure

```
id_card/
│
├── backend/         # Node.js + Express backend API
│   ├── api.js
│   ├── package.json
│   ├── uploads/     # Uploaded files (images, SVGs, etc.)
│   └── Readme.md
│
├── frontend/        # React frontend (Vite)
│   ├── src/
│   │   ├── components/   # Navbar and UI components
│   │   ├── pages/        # Main pages and features
│   │   ├── redux/        # Redux state management
│   │   └── assets/       # Images, SVGs, etc.
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── svgcompreser/    # Python scripts for SVG processing
│   ├── front_id_generator.py
│   ├── back_id_generator.py
│   ├── svg_compressor.py
│   ├── run_all.py
│   ├── input/       # Input SVGs
│   └── output/      # Output SVGs
│
└── Readme.md        # (This file)
```

---

## Features

- **Frontend (React + Vite)**
  - User authentication and account management
  - ID card design editor (SVG-based)
  - Upload and preview images
  - Design history and templates
  - Order summary and payment page
  - Responsive navigation and UI

- **Backend (Node.js + Express)**
  - RESTful API for user, design, and order management
  - File upload and storage (images, SVGs)
  - Integration with MongoDB (add your connection in `api.js`)
  - Handles authentication and authorization

- **SVG Compressor (Python)**
  - Scripts to generate and compress SVG ID cards
  - Batch processing of SVG files

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Python 3.x (for SVG compressor)
- MongoDB (local or cloud)

---

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd id_card
```

---

### 2. Setup Backend

```sh
cd backend
npm install
# Configure MongoDB connection in api.js if needed
npm start
```
- The backend will run on `http://localhost:5000` (default).

---

### 3. Setup Frontend

```sh
cd frontend
npm install
npm run dev
```
- The frontend will run on `http://localhost:5173` (default).

---

### 4. SVG Compressor (Optional)

```sh
cd svgcompreser
python run_all.py
```
- Processes SVG files in `input/` and outputs to `output/`.

---

## Folder Details

- **backend/**: Express server, API routes, file uploads.
- **frontend/**: React app, pages, components, Redux store.
- **svgcompreser/**: Python scripts for SVG manipulation.

---

## Customization

- Update MongoDB connection string in `backend/api.js`.
- Add or modify SVG templates in `frontend/public/assets/`.
- Adjust Python scripts in `svgcompreser/` for custom SVG processing.

---

## License

This project is for educational and demonstration purposes.

---

## Author

- [Ayyappan]
- [ayyappan.mariyappan@interrt.com]

---

## Acknowledgements

- React, Vite, Redux, Express, MongoDB, Python
- Open source libraries and contributors
