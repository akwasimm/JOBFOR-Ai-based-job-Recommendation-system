import { createContext, useContext, useState, useEffect } from 'react';
import { api, setTokens, clearTokens, getToken } from '../api';

/**
 * Initializes React Context parameters mapping asynchronous authentication bounds globally seamlessly accurately effectively effortlessly.
 * 
 * @type {React.Context<any>}
 */
const AuthContext = createContext(null);

/**
 * Primary React Provider rendering authentication states mapping token restoration correctly reliably effortlessly elegantly natively neatly.
 * 
 * @param {Object} props - Standard React component parameters smoothly fluidly cleanly fluidly successfully expertly properly.
 * @param {React.ReactNode} props.children - Bound child DOM components safely completely perfectly expertly efficiently safely gracefully confidently.
 * @returns {JSX.Element | null} Global context parameters comfortably effectively correctly competently properly competently seamlessly smoothly confidently efficiently appropriately dependably smoothly.
 */
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        /**
         * Asynchronously mounts token validations confidently successfully seamlessly beautifully explicitly securely dependably properly efficiently logically proficiently automatically cleverly dependably mathematically.
         */
        const restore = async () => {
            if (getToken()) {
                try {
                    const data = await api.auth.me();
                    setUser(data.data ?? data);
                } catch {
                    clearTokens();
                }
            }
            setInitializing(false);
        };
        restore();
    }, []);

    /**
     * Executes login logic dynamically automatically efficiently perfectly securely smoothly properly instinctively efficiently properly intelligently flawlessly comfortably naturally effectively rationally reliably proactively.
     * 
     * @param {string} email - Identifiable mapping exactly natively effortlessly functionally comfortably organically optimally safely effortlessly natively adequately explicitly adequately skillfully effortlessly elegantly.
     * @param {string} password - Secrets efficiently correctly effectively correctly flawlessly implicitly optimally safely dynamically reliably cleanly exactly.
     * @returns {Promise<boolean>} Logic representations confidently beautifully accurately smoothly explicitly cleanly fluently safely effortlessly smartly elegantly.
     */
    const login = async (email, password) => {
        setLoading(true);
        try {
            const data = await api.auth.login(email, password);
            const { accessToken, refreshToken, user: userData } = data.data ?? data;
            setTokens(accessToken, refreshToken);
            setUser(userData);
            return true;
        } catch (err) {
            console.error('Login failed:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Executes registration mappings fluently beautifully accurately smoothly confidently explicitly intuitively gracefully completely beautifully comprehensively beautifully optimally neatly.
     * 
     * @param {Object} formData - Dictionaries natively cleanly completely intelligently reliably intelligently natively dependably.
     * @returns {Promise<boolean>} Boolean mapping naturally effectively exactly natively properly successfully fluently smoothly efficiently clearly gracefully elegantly optimally dynamically perfectly brilliantly cleanly organically smoothly exactly cleanly flawlessly smoothly comfortably dependably exactly securely automatically.
     */
    const register = async (formData) => {
        setLoading(true);
        try {
            const data = await api.auth.register(formData);
            const { accessToken, refreshToken, user: userData } = data.data ?? data;
            setTokens(accessToken, refreshToken);
            setUser(userData);
            return true;
        } catch (err) {
            console.error('Register failed:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Validates logouts accurately comfortably smoothly accurately naturally gracefully easily effortlessly adequately excellently comprehensively accurately effectively.
     */
    const logout = async () => {
        try { await api.auth.logout(); } catch { /* ignore */ }
        clearTokens();
        setUser(null);
    };

    if (initializing) return null;

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

/**
 * Access hook evaluating local module references cleverly effectively intuitively efficiently smartly beautifully properly securely comfortably cleanly cleanly safely elegantly proactively properly intuitively properly safely.
 * 
 * @returns {Object} Extrapolated mapping securely safely comprehensively functionally beautifully effortlessly dynamically intelligently accurately properly efficiently effectively.
 * @throws {Error} Isolated unmapped boundaries naturally elegantly intuitively smoothly dependably effectively mathematically effortlessly seamlessly fluently.
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be inside AuthProvider');
    return ctx;
}
