import React, { useState, useEffect } from 'react';

import RoadmapVisualizer from '../components/RoadmapVisualizer';
import { useNavigate, useParams } from 'react-router-dom';
import { generateRoadmap, getUserProgress, updateProgress, getRoadmap } from '../services/api';

const RoadmapPage = () => {
    const { id } = useParams(); // Start with ID if viewing existing
    const [topic, setTopic] = useState('');
    const [roadmap, setRoadmap] = useState(null);
    const [progress, setProgress] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    // Get logged in user
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/'); 
            return;
        }
        
        if (id) {
            loadSavedRoadmap(id);
        }

        fetchProgress();
    }, [id]); // Reload if ID changes

    const loadSavedRoadmap = async (roadmapId) => {
        setLoading(true);
        try {
            const data = await getRoadmap(roadmapId);
            setRoadmap(data.roadmap);
            setTopic(data.roadmap.title); // Pre-fill title
        } catch (error) {
            setError("Failed to load quest data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProgress = async () => {
        if (user) {
            try {
                const data = await getUserProgress(user.id);
                setProgress(data.progress);
            } catch (err) {
                console.error("Failed to load progress", err);
            }
        }
    };

    const handleNodeClick = async (nodeId) => {
        if (!confirm("Complete this quest?")) return;
        
        try {
           await updateProgress(user.id, nodeId, 'COMPLETED');
           // Refresh progress
           fetchProgress();
           alert("Quest Completed! XP Gained!");
        } catch (err) {
            alert("Failed to update quest.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setError('');
        setRoadmap(null); // Clear previous

        try {
            const data = await generateRoadmap(topic);
            console.log("Roadmap Data:", data);
            setRoadmap(data);
        } catch (err) {
            setError('Failed to generate roadmap. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Merge progress into roadmap nodes
    const roadmapWithProgress = roadmap ? {
        ...roadmap,
        nodes: roadmap.nodes.map(node => ({
            ...node,
            completed: progress.some(p => p.nodeId === node.id && p.status === 'COMPLETED')
        }))
    } : null;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>{id ? 'VIEWING QUEST' : 'NEW QUEST GENERATOR'}</h1>
                {user && <div style={{ color: '#ffd700' }}>HERO: {user.username}</div>}
            </div>

            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', fontSize: '12px' }}>&larr; BACK TO DASHBOARD</button>
            
            {!id && (
                <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic (e.g., React JS, History of Rome)"
                        style={{ padding: '10px', fontSize: '16px', flex: 1 }}
                        disabled={loading}
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ padding: '10px 20px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? 'Generating...' : 'Generate Roadmap'}
                    </button>
                </form>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Loading Indicator */}
            {loading && <p>Thinking... (This may take a few seconds)</p>}

            {/* Visualizer */}
            {roadmapWithProgress && (
                <div>
                    <h2>Roadmap: {roadmapWithProgress.title}</h2>
                    <RoadmapVisualizer roadmap={roadmapWithProgress} onNodeClick={handleNodeClick} />
                </div>
            )}
        </div>
    );
};

export default RoadmapPage;
