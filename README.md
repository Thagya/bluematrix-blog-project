BlueMatrix Blog & CMS
A full-stack blog platform with a powerful Content Management System (CMS) built with modern web technologies.

 Table of Contents

Features
Tech Stack
Prerequisites
Installation & Setup
Environment Variables
Sample Login Credentials
API Overview
Project Structure
Usage Guide
Deployment
Screenshots
License

✨ Features
Public Blog Website

📰 Browse published blog posts with beautiful card layouts
🔍 Search posts by title with real-time filtering
🏷️ Filter posts by category
📖 Read full blog posts with rich content formatting
📱 Fully responsive design for all devices
🎨 Clean, modern UI with TailwindCSS

Admin CMS Dashboard

🔐 Secure JWT-based authentication
✍️ Create, edit, and delete blog posts
🖼️ Image upload for featured images
📁 Category management (create, edit, delete)
🏷️ Tag system for better organization
📝 Draft/Published status control
👤 User-specific post management (users can only edit their own posts)
📊 Dashboard with statistics

🛠 Tech Stack
Frontend

Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: TailwindCSS
State Management: React Hooks & Context API
HTTP Client: Native Fetch API
Notifications: React Hot Toast
Image Handling: Next.js Image component

Backend

Framework: NestJS 10
Language: TypeScript
Database: MongoDB with Mongoose ODM
Authentication: JWT (JSON Web Tokens)
Password Hashing: bcrypt
Validation: class-validator & class-transformer
File Upload: Multer
API Documentation: Swagger

DevOps & Tools

Version Control: Git
Package Manager: npm
Code Quality: ESLint, Prettier

📦 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v18.x or higher)
npm (v9.x or higher)
MongoDB (v6.x or higher) - Local installation or MongoDB Atlas account
Git

🚀 Installation & Setup
1. Clone the Repository
git clone https://github.com/Thagya/bluematrix-blog-project.git
cd bluematrix-blog

3. Backend Setup
 Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create uploads directory
mkdir -p uploads/images

# Create .env file (see Environment Variables section)
cp .env.example .env

# Start MongoDB (if running locally)
# mongod

# Run the backend server
npm run start:dev
The backend will start on http://localhost:5000
3. Frontend Setup
bash# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env.local file (see Environment Variables section)
cp .env.example .env.local

# Start the development server
npm run dev
The frontend will start on http://localhost:3000
🔐 Environment Variables
Backend (.env)
Create a .env file in the backend directory:
env# Server Configuration
PORT=5000
BASE_URL=http://localhost:5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/blog-cms
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-cms

# JWT Configuration
JWT_SECRET=18bec4262b599acc73ac145fc65ab65f97e83b2033b329fc612d01c9e4c0f4f4135def0e550f18b79657be64b7998941cec9e5044c614673389e0fb0
JWT_EXPIRATION=7d

# File Upload Configuration
UPLOADS_DIR=./uploads/images
MAX_FILE_SIZE=5242880
Frontend (.env.local)
Create a .env.local file in the frontend directory:
envNEXT_PUBLIC_API_URL=http://localhost:5000
👤 Sample Login Credentials
You can create a new account through the registration page or use these sample credentials after creating them:
Test User 1

Email: admin@bluematrix.com
Password: password123
Name: Admin User


📡 API Overview

Base URL
http://localhost:5000
Authentication Endpoints
Register User
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
Login
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
Posts Endpoints
Get All Published Posts (Public)
GET /posts?page=1&limit=10&category=categoryId&q=search_query

Get Single Post (Public)
GET /posts/:id

Create Post (Protected)
POST /posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "title": "Post Title",
  "content": "Post content with HTML",
  "excerpt": "Brief summary",
  "category": "category_id",
  "tags": ["tag1", "tag2"],
  "status": "published",
  "featuredImage": [file]
}

Update Post (Protected)
PUT /posts/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "status": "published"
}
Delete Post (Protected)
DELETE /posts/:id

Authorization: Bearer {token}
Categories Endpoints

Get All Categories (Public)
GET /categories
Create Category (Protected)
POST /categories

Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Category Name",
  "slug": "category-slug"
}
Update Category (Protected)
PUT /categories/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name"
}
Delete Category (Protected)
DELETE /categories/:id
Authorization: Bearer {token}
Upload Endpoints
Upload Image (Protected)
POST /uploads
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "image": [file]
}

Response:
{
  "filename": "randomname.jpg",
  "url": "http://localhost:5000/uploads/randomname.jpg",
  "originalname": "myimage.jpg",
  "size": 123456
}
Swagger API Documentation
Once the backend is running, visit:
http://localhost:5000/api


<img width="949" height="499" alt="image" src="https://github.com/user-attachments/assets/dfbaee83-2a51-469c-9524-2589f33888ec" />
<img width="1896" height="997" alt="Screenshot 2025-12-14 121600" src="https://github.com/user-attachments/assets/14483e9f-1bc8-435e-a727-75c78a8bf5fa" />
<img width="1892" height="1000" alt="Screenshot 2025-12-14 121528" src="https://github.com/user-attachments/assets/a15a4c2e-d2ea-4c14-9998-861c6749626b" />
<img width="950" height="496" alt="image" src="https://github.com/user-attachments/assets/cb822e24-c11c-40c9-8825-6b864063b5e1" />



📖 Usage Guide
For Content Creators

Register an Account

Visit http://localhost:3000/auth/register
Fill in your name, email, and password
Click "Create Account"

Login

Go to http://localhost:3000/auth/login
Enter your credentials
You'll be redirected to the CMS Dashboard

Create Categories
Navigate to "Categories" in the CMS sidebar
Click "New Category"
Enter category name and slug
Click "Create"

Create a Blog Post

Go to "My Posts" and click "New Post"
Fill in the title, content, excerpt
Upload a featured image
Select a category
Add tags (comma-separated)
Choose "Published" or "Draft" status
Click "Create Post"

Edit/Delete Posts

Only you can edit or delete your own posts
Click the edit icon to modify a post
Click the delete icon to remove a post

View Your Posts

Click the eye icon to view a post on the public blog
Published posts appear on the homepage


For Readers

Browse Posts

Visit http://localhost:3000
Scroll through published posts

Search Posts

Use the search bar to find posts by title
Results update in real-time

Filter by Category

Click category buttons to filter posts
Click "All" to see all posts

Read Full Posts

Click "Read more" on any post card
Enjoy the full content with images and formatting
