import styles from './styles.module.scss';
function VariantStats({ stats }) {
  const { statsGrid, statCard, statIcon, statLabel } = styles;
  return (
    <section className={statsGrid} aria-label='thống kê biến thể'>
      {stats.map(({ label, value, icon: Icon }) => (
        <article className={statCard} key={label}>
          <span className={statIcon}>
            <Icon aria-hidden='true' />
          </span>
          <div>
            <span className={statLabel}>{label}</span>
            <strong>{value.toLocaleString('vi-VN')}</strong>
          </div>
        </article>
      ))}
    </section>
  );
}

export default VariantStats;
