##Global Workforce Assignment Management System (RTS)
This project is designed to manage employee assignments across global sites for Ramjack Technologies Solutions. The system allows administrators to manage employees, assign them to specific tasks and locations, and track assignment statuses across multiple global sites. The system uses the MERN stack (MongoDB, Express.js, React, Node.js) to deliver a robust solution.

#Features
Employee Assignment Management: Allows administrators to create, update, and manage employee assignments across various global locations.
Role-Based Access Control (RBAC): Supports different user roles (e.g., admin, employee) with different levels of access and permissions.
Task and Location Tracking: Enables the tracking of employee task progress and location-based assignments.
Authentication and Security: User authentication with secure access to resources based on roles.
Real-time Notifications: Sends notifications to employees regarding their assignments, changes, or updates.
Audit Logs: Keeps track of changes in assignments and user actions.
Technology Stack
Frontend:

React.js: A JavaScript library for building dynamic user interfaces.
TypeScript: Provides type safety for the React components.
React Router: For managing navigation and routing between different views.
Backend:

Node.js & Express.js: The server-side framework for handling API requests and data processing.
MongoDB: NoSQL database for storing employee information and assignments.
Mongoose: Used for object modeling and schema definition in MongoDB.
File Handling:

Cloudinary: For managing and storing employee files like profile images and other documents.
Project Structure
bash
Copy code
├── /src
│   ├── /api         # API integration with Axios for backend communication
│   ├── /components  # Reusable UI components (e.g., Form, Button, Notification)
│   ├── /pages       # Main pages (e.g., Employee Management, Assignment Dashboard)
│   ├── /utils       # Utility functions
│   ├── App.tsx      # Main application component
│   └── index.tsx    # Application entry point
└── server
    ├── /controllers # Business logic for handling requests
    ├── /models      # MongoDB schemas for data structure
    ├── /routes      # API routes
    └── server.js    # Express.js server setup

##Installation
Prerequisites
Before you begin, ensure you have the following installed:

Node.js: JavaScript runtime environment.
MongoDB: NoSQL database for storing and managing data.
Cloudinary Account: For handling file storage (images, documents).
Setup
Clone the repository:


git clone https://github.com/your-repo/RTS-Workforce-Assignment-System.git
cd RTS-Workforce-Assignment-System
Install the dependencies for both the frontend and backend:


yarn install
Set up environment variables by creating a .env file in the root directory:


PORT=5000
MONGO_URI=<your-mongodb-uri>
CLOUDINARY_URL=<your-cloudinary-url>
JWT_SECRET=<your-jwt-secret>
Run the application:


yarn run dev
The app should now be running on http://localhost:5173.

##Usage
Admin Dashboard: Admins can log in to manage assignments, create tasks, and monitor progress for employees across different sites.
Employee View: Employees can view their assignments, check task details, and update their progress.
API Documentation
The API endpoints handle all data requests for the system. Some important routes include:

Employee Management:

POST /api/employees: Add a new employee.
GET /api/employees: Get a list of all employees.
PUT /api/employees/:id: Update an employee's details.
DELETE /api/employees/:id: Remove an employee.
Assignment Management:

POST /api/assignments: Create a new assignment.
GET /api/assignments: Retrieve all assignments.
PUT /api/assignments/:id: Update an assignment.
DELETE /api/assignments/:id: Delete an assignment.
Contributions
We welcome contributions! To contribute:

Fork the repository.
Create a new feature branch.
Make changes and commit them.
Submit a pull request.
License
This project is licensed under the MIT License.