import LinearProgress from '@mui/material/LinearProgress';
import styles from './loading-bar.module.css';

export const LoadingBar = () => (
  <div className={styles.wrapper} role="status" aria-label="Loading">
    <LinearProgress />
  </div>
);
