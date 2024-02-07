// server.js

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
app.use(cors());
const { MongoClient, ObjectId } = require('mongodb');

// Middleware
app.use(bodyParser.json());

// Connection URI
const uri = 'mongodb+srv://hsinghji3:9WEvRql984f91Dh2@cluster0.0wnbwnd.mongodb.net/';



// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const currentDate = new Date();
const isoFormattedDate = currentDate.toISOString();
// Function to fetch user data using the ObjectID
async function getUserData(objectId) {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Access the database and collection
        const database = client.db('user-management');
        const collection = database.collection('users');

        // Convert the string objectId to ObjectId type
        const userId = new ObjectId(objectId);

        // Find the user by ObjectID
        const user = await collection.findOne({ _id: userId });

        return user;
    } finally {
        // Close the connection
        await client.close();
    }
}


const userId = '65c3b652ab69c5295c232450';
let users;
async function startServer() {
    try {
        users = await getUserData(userId);
        console.log(users.users[0]); // Do something with the users data
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
  
startServer();
console.log(users);
// Mock user data
// const users = [
//   { id: 1, name: 'User 1', email: 'hd259364@gmail.com', lastLogin: new Date('2024-01-01'), cart: [
//     { courseId: 101, courseName: 'Introduction to JavaScript', price: 29.99 },
//     { courseId: 102, courseName: 'React Fundamentals', price: 39.99 }
//   ],
//   checkoutCompleted: false, // User did not complete the purchase
//   lastCheckoutStep: 'Payment', // Last step the user reached in the checkout process 
//   lastCheckoutStepTimestamp: new Date('2024-01-10T10:00:00') },
//   { id: 2, name: 'User 2', email: 'himdahiya91@gmail.com', lastLogin: new Date('2024-01-02'), cart: [
//     { courseId: 101, courseName: 'Introduction to JavaScript', price: 29.99 },
//     { courseId: 102, courseName: 'React Fundamentals', price: 39.99 }
//   ],
//   checkoutCompleted: true, // User did not complete the purchase
//   lastCheckoutStep: 'Confirmation', // Last step the user reached in the checkout process
//   lastCheckoutStepTimestamp: new Date('2024-01-10T10:00:00') },
//   { id: 3, name: 'User 3', email: 'hsinghji3@gmail.com', lastLogin: new Date('2024-02-06'), cart: [
//     { courseId: 101, courseName: 'Introduction to JavaScript', price: 29.99 },
//     { courseId: 102, courseName: 'React Fundamentals', price: 39.99 }
//   ],
//   checkoutCompleted: false, // User did not complete the purchase
//   lastCheckoutStep: 'Payment', // Last step the user reached in the checkout process
//   lastCheckoutStepTimestamp: new Date('2024-01-10T10:00:00') }
// ];

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
  const inactiveUsers = users.users.filter(user => {
    const lastLoginDate = new Date(user.lastLogin);
    const currentDate = new Date();
    const differenceInDays = (currentDate - lastLoginDate) / (1000 * 60 * 60 * 24);
    return differenceInDays > 5;
  });


  // Trigger notifications for inactive users
  inactiveUsers.forEach(user => {
    sendInAppNotification(user.id);
    sendEmailNotification(user.email, "You haven't logged in for last five days."); // Replace with user's email
  });

  res.sendStatus(200);
});

// API endpoint to fetch users
app.get('/api/users', (req, res) => {
    res.json(users.users);
});

app.get('/api/inactiveusers', (req, res) => {
    const inactiveUsers = users.users.filter(user => {
        const lastLoginDate = new Date(user.lastLogin);
        const currentDate = new Date();
        const differenceInDays = (currentDate - lastLoginDate) / (1000 * 60 * 60 * 24);
        return differenceInDays > 5;
    });
    console.log("Inactive Users:", inactiveUsers);
    res.json(inactiveUsers);
});

app.get('/api/abandonedusers', (req, res) => {
    const abandonedUsers = users.users.filter(user => !user.checkoutCompleted);
    console.log("Abandoned Users:", abandonedUsers);
    res.json(abandonedUsers);
});

// API endpoint to trigger notifications for abandoned courses
app.post('/api/notifications/abandoned-course', (req, res) => {
    // Filter users who abandoned the checkout process
    const abandonedUsers = users.users.filter(user => !user.checkoutCompleted);
  
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
