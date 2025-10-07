import React, { useState, useEffect } from 'react';
import Pusher from 'pusher-js';
import { Bell, X, Send } from 'lucide-react';
import { API_BASE_URL } from '../Config/Config';

const Reminder = () => {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [minutes, setMinutes] = useState(1);
  const [userToken] = useState(() =>
    JSON.parse(localStorage.getItem('userInfo')) || {}
  );

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher('4b0fbb2532a3360e484e', {
      cluster: 'ap2',
      forceTLS: true
    });

    const channel = pusher.subscribe('reminder-channel');

    // ✅ Listen for the custom event name (matches broadcastAs() in Laravel)
    channel.bind('reminder-notification', (data) => {
      console.log('Reminder received:', data);

      const notification = {
        id: Date.now(),
        title: data.message.title,
        message: data.message.message,
        minutesLeft: data.message.minutes_left,
        timestamp: new Date().toLocaleTimeString()
      };

      setNotifications((prev) => [...prev, notification]);

      // Browser Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(data.message.title, {
          body: `${data.message.message}\n${data.message.minutes_left} minutes remaining`
        });
      }

      // Auto-remove after 10 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 10000);
    });

    // Ask for Notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

const sendReminder = async () => {
  if (!title) {
    alert('Please enter a title');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/send-reminder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${userToken?.token}`,
      },
      body: JSON.stringify({
        title,
        message,
        minutes,
      }),
    });

    const data = await response.json();
    console.log('Backend Response:', data);

    if (data.success) {
      alert(`Reminder scheduled for ${minutes} minute(s)!`);

      // Wait for specified time then show popup
      setTimeout(() => {
        const notification = {
          id: Date.now(),
          title: title || 'Reminder',
          message: message || 'You have a scheduled task',
          minutesLeft: minutes,
          timestamp: new Date().toLocaleTimeString(),
        };

        setNotifications((prev) => [...prev, notification]);

        // Browser notification (system popup)
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: `${notification.message}\nTime’s up!`,
          });
        }

        // Auto remove after 10s
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        }, 10000);
      }, minutes * 60 * 1000); // ⏱ wait for X minutes before showing reminder

      // reset form
      setTitle('');
      setMessage('');
      setMinutes(1);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to send reminder');
  }
};


  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-gray-800">Reminder System</h1>
          </div>

          {/* Send Reminder Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Meeting in 10 minutes"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="Don't forget to join the team meeting"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minutes Left
              </label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                placeholder="10"
                min="1"
              />
            </div>

            <button
              onClick={sendReminder}
              className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2 font-semibold text-lg"
            >
              <Send className="w-5 h-5" />
              Send Reminder
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3">How to Use:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Fill in the title, message, and minutes</li>
            <li>Click "Send Reminder" button</li>
            <li>You'll see a popup notification appear in the top-right corner</li>
            <li>Browser notification will also show if permitted</li>
          </ol>
        </div>
      </div>

      {/* Notification Popups */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-sm">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className="bg-white border-l-4 border-purple-600 rounded-xl shadow-2xl p-5 notification-slide-in"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-lg text-gray-800">{notif.title}</h3>
                </div>
                <p className="text-gray-600 mb-3">{notif.message}</p>
                <div className="bg-purple-50 rounded-lg p-2 mb-2">
                  <p className="text-purple-700 font-bold text-sm">
                    ⏰ {notif.minutesLeft} minutes remaining
                  </p>
                </div>
                <p className="text-xs text-gray-400">{notif.timestamp}</p>
              </div>
              <button
                onClick={() => removeNotification(notif.id)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .notification-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Reminder;
