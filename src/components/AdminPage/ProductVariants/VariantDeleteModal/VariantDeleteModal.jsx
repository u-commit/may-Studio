import styles from './styles.module.scss';

function VariantStats({ stats }) {
  return (
    <section className={styles.statsGrid} aria-label='Thống kê biến thể'>
      {stats.map(({ label, value, icon: Icon }) => (
        <article className={styles.statCard} key={label}>
          <span className={styles.statIcon}>
            <Icon aria-hidden='true' />
          </span>
          <div>
            <span className={styles.statLabel}>{label}</span>
            <strong>{value.toLocaleString('vi-VN')}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

export default VariantStats;
