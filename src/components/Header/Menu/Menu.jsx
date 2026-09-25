import styles from '../styles.module.scss';
function Menu({ content, hrefz }) {
  const { menu } = styles;
  return <div className={menu}>{content}</div>;
}

export default Menu;
