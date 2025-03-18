import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PastContests.css'; // Ensure this path is correct

const PastContests = () => {
  const [pastContests, setPastContests] = useState([]);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const contests = response.data.result;
        const currentTime = Math.floor(Date.now() / 1000);

        // Filter past contests and map to desired format
        const pastContestsData = contests
          .filter(contest => contest.startTimeSeconds < currentTime)
          .slice(0, 20) // Limit to 20 past contests
          .map(contest => ({
            id: contest.id,
            name: contest.name,
            startTime: new Date(contest.startTimeSeconds * 1000),
            duration: contest.durationSeconds / 3600, // Convert duration to hours
            link: `https://codeforces.com/contest/${contest.id}`
          }));

        setPastContests(pastContestsData);
      } catch (error) {
        console.error('Error fetching contests:', error);
      }
    };

    fetchContests();
  }, []);

  return (
    <div className="past-contests-container">
      <h1 style={{textAlign:'center'}}>Past Contests</h1>
      <div className="cards-grid">
        {pastContests.map(contest => (
          <div key={contest.id} className="card">
            <div className="card-content">
              <div className="card-title">{contest.name}</div>
              <p className="card-text">Start Time: {contest.startTime.toLocaleString()}</p>
              <p className="card-text">Duration: {contest.duration} hours</p>
              <a href={contest.link} target="_blank" rel="noopener noreferrer" className="card-link">
                View Contest
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastContests;
