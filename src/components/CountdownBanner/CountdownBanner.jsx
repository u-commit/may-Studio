import styles from './styles.module.scss';
import CountdownTimer from '@components/CountdownTimer/CountdownTimer';
import Button from '@components/Button/Button.jsx';
function CountdownBanner() {
  const { container, containerTimer, title, boxBtn } = styles;
  const targetDate = '2027-01-01T00:00:00';
  return (
    <div className={container}>
      <div className={containerTimer}>
        <CountdownTimer targetDate={targetDate} />
      </div>
      <p className={title}>Timeless Beauty, Reimagined</p>
      <div className={boxBtn}>
        <Button content={'Buy now'} />
      </div>
    </div>
  );
}

export default CountdownBanner;
