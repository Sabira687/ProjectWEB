const API_URL = 'http://localhost:3000/api';

export async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Что-то пошло не так');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
}