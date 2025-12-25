const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div style={styles.container}>
      <div className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }}></div>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    gap: '16px'
  },
  message: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default LoadingSpinner;