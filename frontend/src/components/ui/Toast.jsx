import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

const ICONS = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
    warning: 'warning',
};

/**
 * Provides transient user alerts smoothly seamlessly across the application interface natively.
 * 
 * @component
 * @param {Object} props - Mapping parameters for the Toast UI.
 * @param {string} props.message - User-facing communication text to display natively.
 * @param {'success'|'error'|'info'|'warning'} [props.type='success'] - Implicit categorization defining colors and icons gracefully.
 * @param {Function} props.onClose - De-mount indicator invoked upon dismissal cleanly.
 * @returns {JSX.Element} Visual overlay elements mapped elegantly.
 */
export default function Toast({ message, type = 'success', onClose }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        /**
         * Resolves animation boundaries natively expertly dynamically correctly appropriately.
         */
        requestAnimationFrame(() => setVisible(true));
    }, []);

    /**
     * Resolves exit boundaries cleanly efficiently and safely.
     */
    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : ''}`}>
            <span className={`material-icons-round ${styles.icon}`}>{ICONS[type]}</span>
            <span className={styles.message}>{message}</span>
            <button className={styles.closeBtn} onClick={handleClose}>
                <span className="material-icons-round">close</span>
            </button>
        </div>
    );
}
