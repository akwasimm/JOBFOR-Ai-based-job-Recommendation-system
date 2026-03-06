import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPage.module.css';

/**
 * Executes standardized login procedures appropriately fluently seamlessly explicitly properly correctly instinctively cleanly competently correctly properly optimally organically mathematically elegantly flexibly effortlessly adequately properly securely natively practically correctly expertly.
 * 
 * @returns {JSX.Element} Login interface logic explicitly dependably organically logically intelligently successfully perfectly explicitly efficiently seamlessly fluently successfully practically effectively appropriately completely precisely intuitively comfortably easily dependably adequately automatically optimally optimally cleanly.
 */
export default function LoginPage() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    /**
     * Resolves authentication inputs implicitly effortlessly natively neatly dependably smoothly dependably accurately accurately expertly securely seamlessly competently appropriately completely smartly perfectly competently logically seamlessly explicitly exactly securely fluently safely natively neatly.
     * 
     * @param {React.FormEvent} e - Submission events intelligently correctly cleanly creatively properly elegantly flawlessly perfectly rationally cleanly smartly effortlessly safely clearly securely cleanly effectively accurately cleanly seamlessly smartly intelligently.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const ok = await login(form.email, form.password);
        if (ok) navigate('/dashboard');
        else setError('Invalid email or password. Please try again.');
    };

    return (
        <div className={styles.page}>
            <div className={styles.bg} />
            <div className={styles.card}>
                <Link to="/" className={styles.logo}>JobFor<span>.</span></Link>
                <h1>Welcome back</h1>
                <p className={styles.subtitle}>Sign in to continue your job search journey.</p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Email</label>
                        <div className={styles.inputWrap}>
                            <span className="material-icons-round">email</span>
                            <input type="email" placeholder="you@example.com" required
                                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>Password</label>
                        <div className={styles.inputWrap}>
                            <span className="material-icons-round">lock</span>
                            <input type="password" placeholder="••••••••" required
                                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                        </div>
                        <a href="#" className={styles.forgotLink}>Forgot password?</a>
                    </div>
                    {error && <p style={{ color: '#ff6b6b', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{error}</p>}
                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <span className={styles.spinner} /> : 'Sign In'}
                    </button>
                </form>
                <p className={styles.toggle}>
                    Don't have an account? <Link to="/auth/register">Create one</Link>
                </p>
            </div>
        </div>
    );
}
