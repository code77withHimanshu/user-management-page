// server.js

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Mock user data
const users = [
  { id: 1, name: 'User 1', email: 'himanshu.dahiya@cloudtechner.com', lastLogin: new Date('2024-01-01'), cart: [
    { courseId: 101, courseName: 'Introduction to JavaScript', price: 29.99 },
    { courseId: 102, courseName: 'React Fundamentals', price: 39.99 }
  ],
  checkoutCompleted: false, // User did not complete the purchase
  lastCheckoutStep: 'Payment', // Last step the user reached in the checkout process 
  lastCheckoutStepTimestamp: new Date('2024-01-10T10:00:00') },
  { id: 2, name: 'User 2', email: 'himdahiya91@gmail.com', lastLogin: new Date('2024-01-02'), cart: [
    { courseId: 101, courseName: 'Introduction to JavaScript', price: 29.99 },
    { courseId: 102, courseName: 'React Fundamentals', price: 39.99 }
  ],
  checkoutCompleted: true, // User did not complete the purchase
  lastCheckoutStep: 'Confirmation', // Last step the user reached in the checkout process
  lastCheckoutStepTimestamp: new Date('2024-01-10T10:00:00') },
  { id: 3, name: 'User 3', email: 'hsinghji3@gmail.com', lastLogin: new Date('2024-02-06'), cart: [
    { courseId: 101, courseName: 'Introduction to JavaScript', price: 29.99 },
    { courseId: 102, courseName: 'React Fundamentals', price: 39.99 }
  ],
  checkoutCompleted: false, // User did not complete the purchase
  lastCheckoutStep: 'Payment', // Last step the user reached in the checkout process
  lastCheckoutStepTimestamp: new Date('2024-01-10T10:00:00') }
];

// Function to send in-app notification
const sendInAppNotification = (userId) => {
  // Implement logic to send in-app notification
  console.log(`In-app notification sent to user ${userId}`);
};

// Function to send email notification
const sendEmailNotification = (email, reminder) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'hd259364@gmail.com',
      pass: 'qluruvavooawhvsg'
    }
  });

  // Email options
  const mailOptions = {
    from: 'hd259364@gmail.com',
    to: email,
    subject: 'Notification from Civil Guruji',
    text: `You have received a notification from Civil Guruji. ${reminder}`
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email notification:', error);
    } else {
      console.log('Email notification sent:', info.response);
    }
  });
};

// API endpoint to trigger notifications for inactive users
app.post('/api/notifications/inactive-users', (req, res) => {
  // Identify inactive users (last login > 5 days)
  const inactiveUsers = users.filter(user => (new Date() - user.lastLogin) / (1000 * 60 * 60 * 24) > 5);

  // Trigger notifications for inactive users
  inactiveUsers.forEach(user => {
    sendInAppNotification(user.id);
    sendEmailNotification(user.email, "You haven't logged in for last five days."); // Replace with user's email
  });

  res.sendStatus(200);
});

// API endpoint to fetch users
app.get('/api/users', (req, res) => {
    res.json(users);
});

app.get('/api/inactiveusers', (req, res) => {
    const inactiveUsers = users.filter(user => (new Date() - user.lastLogin) / (1000 * 60 * 60 * 24) > 5);
    console.log("Inactive Users:", inactiveUsers);
    res.json(inactiveUsers);
});

app.get('/api/abandonedusers', (req, res) => {
    const abandonedUsers = users.filter(user => !user.checkoutCompleted);
    console.log("Abandoned Users:", abandonedUsers);
    res.json(abandonedUsers);
});

// API endpoint to trigger notifications for abandoned courses
app.post('/api/notifications/abandoned-course', (req, res) => {
    // Filter users who abandoned the checkout process
    const abandonedUsers = users.filter(user => !user.checkoutCompleted);
  
    // Trigger notifications for abandoned users
    abandonedUsers.forEach(user => {
      // Trigger in-app notification for abandoned course
      sendInAppNotification(user.id, 'You have abandoned your course purchase.');
  
      // Send email notification reminding about pending purchase
      sendEmailNotification(user.email, "Reminder: Complete your course purchase");
    });
  
    res.sendStatus(200);
  });
  

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
