import styles from '../styles.module.scss';

function InfoCart({ content, description, src }) {
  const { containerCart, containerContent, title, des } = styles;
  return (
    <div className={containerCart}>
      <img width={40} height={41} src={src} alt='truckIcon' />
      <div className={containerContent}>
        <span className={title}>{content}</span>
        <span className={des}>{description}</span>
      </div>
    </div>
  );
}

export default InfoCart;
