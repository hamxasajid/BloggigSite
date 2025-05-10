import React, { useEffect, useState } from "react";
import axios from "axios";

const Message = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/contact-data"); // adjust the URL if needed
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Contact Messages</h2>
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul>
          {messages.map((msg, index) => (
            <li key={index} style={{ marginBottom: "16px" }}>
              <p>
                <strong>Name:</strong> {msg.name}
              </p>
              <p>
                <strong>Email:</strong> {msg.email}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Message;
