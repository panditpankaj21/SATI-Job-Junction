import React, { useState, useEffect } from 'react';
import { MdNotifications, MdNotificationsActive, MdClose } from 'react-icons/md';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/notifications`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark notification as read
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/notifications/${notification._id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Navigate to the post
      navigate(`/post/${notification.post._id}`);
      
      // Update notifications
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative text flex gap-1 items-center justify-center p-2 text-white hover:text-purple-400 focus:outline-none"
      >
        {unreadCount > 0 ? (
          <MdNotificationsActive className="w-6 h-6 text-purple-500" />
        ) : (
          <MdNotifications className="w-6 h-6" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1 left-3 text-xs px-[6px] py-[2px] text-white transform translate-x-1/2 -translate-y-1/2 bg-red-700 rounded-full">
            {unreadCount}
          </span>
         )} 
         <div className='hidden md:block'>Notification</div>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 md:w-80 w-64 bg-gray-800 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Notifications</h3>
              <button
                onClick={() => setShowDropdown(false)}
                className="text-gray-400 hover:text-white"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>
            
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No notifications</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      notification.isRead
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-purple-900/30 hover:bg-purple-900/40'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          <span className="font-medium text-white">
                            {notification.commenter.name}
                          </span>
                          {' commented on '}
                          <span className="font-medium text-white">
                            {notification.post.title}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteNotification(notification._id, e)}
                        className="text-gray-400 hover:text-white ml-2"
                      >
                        <MdClose className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification; 