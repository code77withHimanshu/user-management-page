Description:
This project is a web application designed to manage user data and trigger notifications based on specific conditions. It addresses two main scenarios:

Triggering Message for Inactive Users:

Identifies users who haven't used the application for more than 5 days.
Implements in-app notifications and email notifications for inactive users.
Triggering Notification for Course Abandonment:

Detects users who visited the checkout page but did not proceed to purchase a course.
Implements in-app notifications and email reminders for users with pending purchases.
Features:

Identify inactive users based on last login timestamp.
Trigger in-app notifications for inactive users.
Set up email notifications for inactive users.
Detect users who abandoned the checkout process.
Trigger in-app notifications for users with abandoned courses.
Set up email reminders for users with pending purchases.
Provide user-friendly interfaces for managing notifications and user data.
Installation:

Clone the repository: git clone <repository-url>
Navigate to the project directory: cd <project-directory>
Install dependencies: npm install
Usage:

Start the backend server: node server.js
Start the frontend development server: npm start
Access the application in your web browser at http://localhost:3000
Technologies Used:

Frontend:
React.js
HTML/CSS
Backend:
Node.js
Express.js
Database:
MongoDB
