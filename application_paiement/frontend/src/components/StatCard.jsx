const StatCard = ({ icon: Icon, title, value, color, suffix = '' }) => {
  return (
    <div className="card" style={styles.card}>
      <div style={{ ...styles.iconContainer, background: color }}>
        <Icon size={24} color="white" />
      </div>
      <div style={styles.content}>
        <p style={styles.title}>{title}</p>
        <p style={styles.value}>
          {value} {suffix && <span style={styles.suffix}>{suffix}</span>}
        </p>
      </div>
    </div>
  );
};

const styles = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    marginBottom: '4px'
  },
  value: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  suffix: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  }
};

export default StatCard;