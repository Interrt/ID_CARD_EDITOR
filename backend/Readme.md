# ID Card Backend

This is the backend service for the ID Card project, built with Node.js and Express. It provides RESTful APIs for managing ID cards, handles file uploads, and connects to a MongoDB database.

## Table of Contents

- [Features](#features)
- [Tech Stack & Dependencies](#tech-stack--dependencies)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)


---

## Features

- RESTful API for ID card management
- File upload support for ID card images
- MongoDB integration for data storage
- CORS support for cross-origin requests
- Unique ID generation for resources

## Tech Stack & Dependencies

This project uses the following main dependencies:

- **express**: Web framework for building APIs and handling HTTP requests.
- **mongoose**: ODM (Object Data Modeling) library for MongoDB, used to define schemas and interact with the database.
- **multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **cors**: Middleware to enable Cross-Origin Resource Sharing, allowing your API to be accessed from different domains.
- **path**: Node.js utility for handling and transforming file paths.
- **router**: Helps organize routes in a modular way.
- **uuid**: Generates unique IDs for resources, such as user IDs or file names.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   node api.js --run the api 
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/id_card_db
   PORT=5000
   ```

4. **Start the server:**
   ```sh
   npm start
   ```
   The server will run on the port specified in your `.env` file (default: 5000).

## API Endpoints

Here are some example endpoints (customize as per your implementation):

- `POST /upload`  
  Upload an ID card image. Uses `multer` for file handling.

- `GET /uploads/:filename`  
  Retrieve an uploaded file.

- `GET /idcards`  
  List all ID cards from the database.

- `POST /idcards`  
  Create a new ID card entry.

- `GET /idcards/:id`  
  Get details of a specific ID card.

- `DELETE /idcards/:id`  
  Delete an ID card entry.

## Project Structure

```
backend/
│
├── api.js           # Main server file (Express app)
├── package.json     # Project metadata and dependencies
├── uploads/         # Directory for uploaded files
└── Readme.md        # Project documentation
```

## Dependency Details

- **express**: Handles routing, middleware, and HTTP requests.
- **mongoose**: Connects to MongoDB, defines schemas/models, and performs database operations.
- **multer**: Processes file uploads (e.g., ID card images) and stores them in the `uploads/` directory.
- **cors**: Allows your frontend (possibly on a different domain/port) to communicate with this backend.
- **path**: Ensures file paths are handled correctly across different operating systems.
- **router**: Lets you split your API routes into separate modules for better organization.
- **uuid**: Ensures each resource (like an ID card or file) has a unique identifier, reducing the risk of collisions.

