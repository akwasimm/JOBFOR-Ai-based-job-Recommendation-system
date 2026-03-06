import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

/**
 * Fallback routing component rendered when users navigate to undefined URL paths.
 * Provides contextual recovery links directing traffic back to primary application hubs.
 * 
 * @component
 * @returns {JSX.Element} The 404 error interface.
 */
export default function NotFoundPage() {
    return (
        <div className={styles.page}>
            <div className={styles.bg} />
            <div className={styles.content}>
                <div className={styles.code}>404</div>
                <h1>CAREER PATH NOT FOUND</h1>
                <p>Looks like this link is a dead end. Let's get you back on track!</p>
                <div className={styles.btns}>
                    <Link to="/dashboard" className={styles.primary}>
                        <span className="material-icons-round">dashboard</span> Back to Dashboard
                    </Link>
                    <Link to="/jobs" className={styles.secondary}>
                        <span className="material-icons-round">search</span> Search Jobs
                    </Link>
                </div>
            </div>
        </div>
    );
}
