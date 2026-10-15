import styles from './style.module.scss';
import classnames from 'classnames';
function Button({ content, isPrimary = true }) {
  const { btn, primaryBtn, secondaryBtn, ...Props } = styles;
  return (
    <button
      className={classnames(btn, {
        [primaryBtn]: isPrimary,
        [secondaryBtn]: !isPrimary,
      })}
      {...Props}
    >
      {content}
    </button>
  );
}

export default Button;
