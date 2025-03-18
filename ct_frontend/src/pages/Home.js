import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css"; // Import your CSS file

function Home() {
    const [contests, setContests] = useState([]);
    const [bookmarked, setBookmarked] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/contests/upcoming')
            .then(response => setContests(response.data))
            .catch(error => {
                if (error.response) {
                    console.error('Response error:', error.response.status, error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error:', error.message);
                }
            });
    }, []);

    const toggleBookmark = (id) => {
        setBookmarked(prev =>
            prev.includes(id) ? prev.filter(bmId => bmId !== id) : [...prev, id]
        );
    };

    return (
        <div className="container">
            <h1 className="title">Upcoming Contests</h1>
            <div className="contest-list">
                {Array.isArray(contests) && contests.filter(c => !c.past).map(contest => (
                    <div
                        key={contest._id}
                        className={`contest-item ${bookmarked.includes(contest._id) ? 'bookmarked' : ''}`}
                    >
                        <h2 className="contest-name">
                            {contest.name} ({contest.platform})
                            <button
                                className="bookmark-btn"
                                onClick={() => toggleBookmark(contest._id)}
                            >
                                {bookmarked.includes(contest._id) ? '★' : '☆'}
                            </button>
                        </h2>
                        <p className="contest-time">Starts at: {new Date(contest.startTime).toLocaleString()}</p>
                        <a
                            href={contest.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="join-btn"
                        >
                            Join Contest
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
