import React, { useState } from 'react';
import './Admin.css'; // Import the CSS file for styling

const Admin = () => {
  const [contestName, setContestName] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [contests, setContests] = useState([]); // State to hold the list of contests
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!contestName.trim()) {
      errors.contestName = 'Contest name is required.';
    }
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeLink.trim()) {
      errors.youtubeLink = 'YouTube link is required.';
    } else if (!youtubeRegex.test(youtubeLink)) {
      errors.youtubeLink = 'Please enter a valid YouTube URL.';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      const newContest = { name: contestName, link: youtubeLink };
      setContests([...contests, newContest]); // Add new contest to the list
      alert('YouTube link added successfully!');
      setContestName('');
      setYoutubeLink('');
      setErrors({});
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Panel - Add Contest Solution Links</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="contestName">Contest Name:</label>
          <input
            type="text"
            id="contestName"
            value={contestName}
            onChange={(e) => setContestName(e.target.value)}
            className={errors.contestName ? 'input-error' : ''}
          />
          {errors.contestName && (
            <span className="error-message">{errors.contestName}</span>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="youtubeLink">YouTube Link:</label>
          <input
            type="text"
            id="youtubeLink"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className={errors.youtubeLink ? 'input-error' : ''}
          />
          {errors.youtubeLink && (
            <span className="error-message">{errors.youtubeLink}</span>
          )}
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      {/* Display the list of contests */}
      {contests.length > 0 && (
        <div className="contest-list">
          <h3>Submitted Contests:</h3>
          <ul>
            {contests.map((contest, index) => (
              <li key={index}>
                <strong>{contest.name}</strong>: <a href={contest.link} target="_blank" rel="noopener noreferrer">{contest.link}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Admin;
