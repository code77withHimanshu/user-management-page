

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [inactiveusers, setInactiveusers] = useState([]);
  const [abandonedusers, setAbandonedusers] = useState([]);

  useEffect(() => {
    // Fetch users data from backend API
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://user-management-agz4.onrender.com/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
    const fetchInactiveUsers = async () => {
      try {
        const response = await axios.get('https://user-management-agz4.onrender.com/api/inactiveusers');
        setInactiveusers(response.data);
      } catch (error) {
        console.error('Error fetching inactive users:', error);
      }
    };

    fetchInactiveUsers();
    const fetchAbandonedUsers = async () => {
      try {
        const response = await axios.get('https://user-management-agz4.onrender.com/api/abandonedusers');
        setAbandonedusers(response.data);
      } catch (error) {
        console.error('Error fetching Abandoned users:', error);
      }
    };

    fetchAbandonedUsers();
  }, []);
  console.log("Users:", users);
  console.log("Inactive Users:", inactiveusers);

  const handleInactiveUsersNotification = async () => {
    // Trigger in-app and email notifications for inactive users
    try {
      await axios.post('https://user-management-agz4.onrender.com/api/notifications/inactive-users');
      alert('Notifications sent to inactive users successfully!');
    } catch (error) {
      console.error('Error sending notifications to inactive users:', error);
      alert('Failed to send notifications to inactive users.');
    }
  };

  const handleAbandonedCourseNotification = async () => {
    // Trigger in-app and email notifications for users who abandoned the checkout process
    try {
      await axios.post('https://user-management-agz4.onrender.com/api/notifications/abandoned-course');
      alert('Notifications sent for abandoned courses successfully!');
    } catch (error) {
      console.error('Error sending notifications for abandoned courses:', error);
      alert('Failed to send notifications for abandoned courses.');
    }
  };

  return (
    <div className='container'>
      <h1 className='title'>User Management</h1>
      <button className='button' onClick={handleInactiveUsersNotification}>Send Notifications for Inactive Users</button>
      <button className='button' onClick={handleAbandonedCourseNotification}>Send Notifications for Abandoned Courses</button>

      <div className='list'>
        <div className='list-container'>
          <h2>User List</h2>
          <ul>
            {users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>

        <div className='list-container'>
          <h2>Inactive User List</h2>
          <ul>
            {inactiveusers.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>

        <div className='list-container'>
          <h2>User List who abandoned purchasing a course in their cart</h2>
          <ul>
            {abandonedusers.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      </div>
      
    </div>

  );
};

export default App;
