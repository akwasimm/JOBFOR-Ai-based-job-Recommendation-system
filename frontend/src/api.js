/**
 * @module api
 * @description Central API utility managing all asynchronous fetch operations directed towards backend endpoints.
 * Integrates automatic token injection, seamless payload refresh rotations, and unified error handling natively.
 */

const BASE = '/api';

/**
 * Retrieves the currently active access token utilized for asserting authenticated user sessions.
 * 
 * @returns {string | null} The JSON Web Token natively available in browser local storage.
 */
export const getToken = () => localStorage.getItem('accessToken');

/**
 * Persistently commits authentication components securing active user session variables.
 * 
 * @param {string} access - The short-lived bearer token for API authorization.
 * @param {string} [refresh] - The long-lived token establishing persistent authentication limits.
 * @returns {void}
 */
export const setTokens = (access, refresh) => {
    localStorage.setItem('accessToken', access);
    if (refresh) localStorage.setItem('refreshToken', refresh);
};

/**
 * Wipes current session bindings reverting client instances to an unidentified baseline state.
 * 
 * @returns {void}
 */
export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

/**
 * Underlying REST wrapper evaluating requests and injecting strict bearer boundaries.
 * Handles automatic token refreshing internally on 401 Unauthorized responses.
 * 
 * @param {string} path - The relative routing URL natively mapping API targets.
 * @param {RequestInit} [options={}] - Standard fetch configuration dictionary.
 * @returns {Promise<any>} The parsed JSON response body.
 * @throws {Error | object} The parsed JSON error body or a generic error if parsing fails.
 */
async function request(path, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(`${BASE}${path}`, { ...options, headers });

    if (res.status === 401) {
        const refreshed = await tryRefresh();
        if (refreshed) {
            headers.Authorization = `Bearer ${getToken()}`;
            const retry = await fetch(`${BASE}${path}`, { ...options, headers });
            if (!retry.ok) throw await retry.json();
            return retry.json();
        } else {
            clearTokens();
            window.location.href = '/auth/login';
            throw new Error('Session expired');
        }
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }));
        throw err;
    }

    if (res.status === 204) return null;
    return res.json();
}

/**
 * Executes payload generation rotating expiration vectors natively by requesting a new access token.
 * 
 * @returns {Promise<boolean>} Resolves to true if the refresh operations succeeded.
 */
async function tryRefresh() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;
    try {
        const res = await fetch(`${BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) return false;
        const data = await res.json();
        setTokens(data.data?.accessToken, data.data?.refreshToken);
        return true;
    } catch {
        return false;
    }
}

/**
 * Exposes core domain services mapping application endpoints natively comfortably cleanly seamlessly.
 * 
 * @namespace api
 */
export const api = {
    /**
     * Authentication module mapping session management natively.
     */
    auth: {
        login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
        register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
        me: () => request('/auth/me'),
        logout: () => request('/auth/logout', { method: 'POST' }),
    },

    /**
     * Job search and discovery routes seamlessly natively cleanly correctly.
     */
    jobs: {
        search: (params = {}) => {
            const qs = new URLSearchParams(
                Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
            ).toString();
            return request(`/jobs/search${qs ? `?${qs}` : ''}`);
        },
        trending: () => request('/jobs/trending'),
        getById: (id) => request(`/jobs/${id}`),
        getSimilar: (id) => request(`/jobs/${id}/similar`),
        recommendations: () => request('/jobs/user/recommendations'),
    },

    /**
     * Candidate tracking intelligently seamlessly elegantly optimally comfortably intuitively.
     */
    applications: {
        list: () => request('/applications'),
        create: (data) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
        updateStatus: (id, status) => request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
        stats: () => request('/applications/stats'),
        saved: () => request('/applications/saved'),
        save: (data) => request('/applications/saved', { method: 'POST', body: JSON.stringify(data) }),
        unsaveExternal: (jobId) => request(`/applications/saved/external/${jobId}`, { method: 'DELETE' }),
        unsave: (id) => request(`/applications/saved/${id}`, { method: 'DELETE' }),
    },

    /**
     * Professional mapping naturally reliably appropriately accurately intelligently seamlessly.
     */
    profile: {
        get: () => request('/profile'),
        update: (data) => request('/profile', { method: 'PUT', body: JSON.stringify(data) }),
        completion: () => request('/profile/completion'),
        addSkill: (data) => request('/profile/skills', { method: 'POST', body: JSON.stringify(data) }),
        removeSkill: (id) => request(`/profile/skills/${id}`, { method: 'DELETE' }),
        addExperience: (data) => request('/profile/experience', { method: 'POST', body: JSON.stringify(data) }),
        updateExperience: (id, data) => request(`/profile/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteExperience: (id) => request(`/profile/experience/${id}`, { method: 'DELETE' }),
        addEducation: (data) => request('/profile/education', { method: 'POST', body: JSON.stringify(data) }),
    },

    /**
     * Machine learning guidance naturally comprehensively intelligently correctly cleanly.
     */
    aiCoach: {
        analyze: (data) => request('/ai-coach/analyze', { method: 'POST', body: JSON.stringify(data) }),
        chat: (msg) => request('/ai-coach/chat', { method: 'POST', body: JSON.stringify({ message: msg }) }),
    },

    /**
     * Analytics natively efficiently elegantly perfectly accurately flawlessly smartly cleanly.
     */
    insights: {
        salary: (params) => { const q = params ? '?' + new URLSearchParams(params).toString() : ''; return request('/insights/salary' + q); },
        skills: () => request('/insights/skills'),
        trends: () => request('/insights/trends'),
        companies: () => request('/insights/companies'),
        skillGap: () => request('/insights/skill-gap'),
    },

    /**
     * Alert tracking natively efficiently fluently explicitly perfectly fluently effectively completely.
     */
    notifications: {
        list: () => request('/notifications'),
        markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
        markRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
        delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
    },
};
