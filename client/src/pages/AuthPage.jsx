import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000/api/users';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/login' : '/register';
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            navigate('/dashboard'); // Go to dashboard/roadmap page
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>{isLogin ? 'QUEST LOGIN' : 'NEW PLAYER'}</h1>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '300px' }}>
                {!isLogin && (
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="USERNAME" 
                        value={formData.username} 
                        onChange={handleChange} 
                    />
                )}
                <input 
                    type="email" 
                    name="email" 
                    placeholder="EMAIL" 
                    value={formData.email} 
                    onChange={handleChange} 
                />
                <input 
                    type="password" 
                    name="password" 
                    placeholder="PASSWORD" 
                    value={formData.password} 
                    onChange={handleChange} 
                />
                
                {error && <p style={{ color: 'red', fontSize: '10px' }}>{error}</p>}

                <button type="submit">{isLogin ? 'START GAME' : 'CREATE HERO'}</button>
            </form>

            <button 
                onClick={() => setIsLogin(!isLogin)} 
                style={{ marginTop: '20px', background: 'transparent', border: 'none', color: '#00ffff', textDecoration: 'underline' }}
            >
                {isLogin ? 'Create New Account' : 'Already have an account?'}
            </button>
        </div>
    );
};

export default AuthPage;
