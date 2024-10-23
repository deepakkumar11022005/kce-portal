import React, { useState } from "react";
import "./NotificationForm.css";

const NotificationForm = ({ onSend, selectedAlumniCount }) => {
  const [message, setMessage] = useState("");
  const [method, setMethod] = useState("email");
  const [subject, setSubject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend({ 
      message, 
      method, 
      subject,
      recipientCount: selectedAlumniCount 
    });
    setMessage("");
    setSubject("");
  };

  return (
    <form onSubmit={handleSubmit} className="notification-form">
      <div className="recipient-count">
        Selected Recipients: {selectedAlumniCount}
      </div>
      <input
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter notification subject..."
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter notification message..."
        required
      />
      <div className="form-footer">
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <button type="submit" disabled={!message || !subject || selectedAlumniCount === 0}>
          Send Notification
        </button>
      </div>
    </form>
  );
};

export default NotificationForm;