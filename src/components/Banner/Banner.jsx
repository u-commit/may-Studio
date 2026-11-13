import Button from '../Button/Button';
import styles from './style.module.scss';
function Banner() {
  const { container, content, title, des } = styles;
  return (
    <div className={container}>
      <div className={content}>
        <h1 className={title}>Mây</h1>
        <div className={des}>Your Style, Your Story, Your Statement</div>
      </div>
    </div>
  );
}

export default Banner;
