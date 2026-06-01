📦 IMS Enterprise
A modern, full-stack Inventory Management System featuring real-time data tracking, automated product cataloging, and client relationship management.

🚀 Overview
IMS Enterprise is a high-performance inventory dashboard built to streamline supply chain monitoring. It features a unified dark-themed interface and a robust API-driven backend architecture.

🛠 Tech Stack
Frontend: React, Styled-Components, Axios.

Backend: Node.js, Express, PostgreSQL.

Containerization: Docker & Docker Compose.

⚙️ Installation & Running
This project uses Docker to manage the backend and database services.

Clone the repository:

Bash
git clone <your-repo-url>
cd inventory-order-system
Launch the application:
To start the full stack, run:

Bash
docker-compose up --build
Accessing the Application:
Once running, your dashboard is accessible via your browser at http://localhost:8080 (or your configured port).

📂 Project Structure
/src: Contains app.js (Core Application) and index.js (React Entry Point).

/backend: Contains the Node.js API server and Dockerfile.

docker-compose.yml: Orchestrates the frontend, backend, and PostgreSQL database containers.

🔑 Key Features
Control Panel: Real-time monitoring of SKU items, customer volume, and revenue.

Catalog Pipeline: CRUD operations to register and manage inventory stock in real-time.

Client Database: Centralized management for tracking customer profiles and contact information.
