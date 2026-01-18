import React, { useEffect, useState } from 'react';
import { getUserRoadmaps } from '../services/api';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        loadRoadmaps();
    }, []);

    const loadRoadmaps = async () => {
        try {
            const data = await getUserRoadmaps(user.id);
            setRoadmaps(data.roadmaps);
        } catch (error) {
            console.error("Failed to load roadmaps", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNew = () => {
        navigate('/generate');
    };

    const handleOpenRoadmap = (id) => {
        navigate(`/roadmap/${id}`);
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1>QUEST BOARD</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ color: '#ffd700' }}>RANK: NOVICE</div>
                    <button onClick={handleCreateNew}>+ NEW QUEST</button>
                    <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ borderColor: 'red', color: 'red' }}>LOGOUT</button>
                </div>
            </div>

            {loading ? <p>Loading Quests...</p> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {roadmaps.map(roadmap => (
                        <div 
                            key={roadmap.id} 
                            onClick={() => handleOpenRoadmap(roadmap.id)}
                            style={{ 
                                border: '4px solid #fff', 
                                padding: '20px', 
                                cursor: 'pointer',
                                background: '#000',
                                boxShadow: '8px 8px 0px #444',
                                transition: 'transform 0.1s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-4px, -4px)'; e.currentTarget.style.boxShadow = '12px 12px 0px #00ffff'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '8px 8px 0px #444'; }}
                        >
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#00ffff' }}>{roadmap.title}</h3>
                            <p style={{ fontSize: '12px', color: '#aaa' }}>Created: {new Date(roadmap.createdAt).toLocaleDateString()}</p>
                            <div style={{ marginTop: '20px', textAlign: 'right', fontSize: '10px', color: '#00ff00' }}>[ OPEN ]</div>
                        </div>
                    ))}
                    
                    {roadmaps.length === 0 && (
                        <p>No active quests. Start a new one!</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
