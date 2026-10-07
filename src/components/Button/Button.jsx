import styles from './style.module.scss';

function Button({ content }) {
  const { btn, primaryBtn, secondaryBtn } = styles;
  return <button className={btn}>{content}</button>;
}

export default Button;
