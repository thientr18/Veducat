# Veducat - Virtual Education Platform 🎓📚

Welcome to **Veducat**, a virtual education platform designed to facilitate course management, student-teacher interactions, and academic activities. This guide will help you get started with using the platform effectively.

## Table of Contents 📖
1. [Getting Started](#getting-started) 🚀
2. [User Roles](#user-roles) 👥
3. [Key Features](#key-features) 🔑
4. [System Requirements](#system-requirements) 🖥️
5. [Installation & Setup](#installation--setup) ⚙️
6. [Environment Variables](#environment-variables) 🔐
7. [Using the Platform](#using-the-platform) 🏫
8. [Support](#support) 💬

---

## Getting Started 🚀
To access **Veducat**, visit the following link:

👉 **[Veducat Repository](https://github.com/thientr18/Veducat)**

For a deployed version, contact the administrator.

## User Roles 👥
Veducat has three main user roles:
- **Admin:** 🛠️ Manages courses, students, and teachers.
- **Teacher:** 📖 Handles course activities such as materials, discussions, assignments, grading, and announcements.
- **Student:** 🎓 Completes tasks, views announcements, and participates in discussions.

## Key Features 🔑
- **User Authentication:** 🔐 Secure login and account management.
- **Course Management:** 📚 Admins can create, update, and delete courses.
- **Assignment & Grading:** ✏️ Teachers can post assignments and evaluate submissions.
- **Discussion Forum:** 💬 Students and teachers can communicate in real-time.
- **Announcements:** 📢 Important updates and notifications.

## System Requirements 🖥️
- **Server:** 🌍 Express.js
- **Database:** 🗄️ MongoDB
- **Node.js:** ⚡ Version 16 or higher
- **Package Manager:** 📦 npm or yarn
- **Environment Management:** 🛠️ dotenv

## Installation & Setup ⚙️
1. **Clone the repository:** 🖥️
   ```sh
   git clone https://github.com/thientr18/Veducat.git
   ```
2. **Navigate to the project directory:** 📂
   ```sh
   cd Veducat
   ```
3. **Install dependencies:** 📦
   ```sh
   npm install
   ```
4. **Create an `.env` file in the root directory** and add the following:
   ```sh
   PORT=3000
   MONGO_DB=<your_database_link>
   ACCESS_TOKEN_SECRET=<your_secret>
   REFRESH_TOKEN_SECRET=""
   OUTLOOK_EMAIL=<your_outlook_email>
   OUTLOOK_PASSWORD=<your_outlook_password>
   ```
5. **Start the server:** 🚀
   ```sh
   npm start
   ```
6. **Initialize the Database:** 🗄️
   - Since there is no data in your database yet, create an initial admin account.
   - Open the `users` collection in the `Veducat` database.
   - Click **Insert Document**, click the bracket icon `{}` and add the following:
   
   ```json
   {
     "_id": { "$oid": "" }, // keep the auto-generated ID of MongoDB here
     "userID": "admin",
     "password": "$2b$10$HYharLhU9NHBiLYeditWS.JCYVwMgAUNIJLKwG8GXaoMPbG0S6FSS",
     "role": "admin",
     "__v": { "$numberInt": "0" }
   }
   ```
   - Then, open the `admins` collection and add:
   
   ```json
   {
     "_id": { "$oid": "" }, // put the auto-generated ID of MongoDB here
     "adminID": "admin",
     "name": "ADMIN",
     "phone": "",
     "email": ""
   }
   ```
   
7. **Access the Application:** 🌐
   - Open your browser and go to `http://localhost:3000`
   - Login with:
     - **Username:** `admin`
     - **Password:** `vnuhcmiu`
   - Explore all features of the platform.
   
   🎯 **When the admin adds a new student/teacher to the system, their username will be their ID, and the default password will be `vnuhcmiu`.**

## Support 💬
If you encounter any issues, please open an issue on GitHub or contact the project administrator.

---
Thank you for using **Veducat**! 🚀🎉

