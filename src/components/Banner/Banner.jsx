import Button from '../Button/Button';
import styles from './style.module.scss';
function Banner() {
  const { container, content, title, des } = styles;
  return (
    <div className={container}>
      <div className={content}>
        <h1 className={title}>MÂY-STUDIO</h1>
        <div className={des}>Your Style, Your Story, Your Statement</div>

        <Button content={'Go to shop'} />
      </div>
    </div>
  );
}

export default Banner;
