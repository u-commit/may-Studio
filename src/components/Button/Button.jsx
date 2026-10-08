import styles from './style.module.scss';
import classnames from 'classnames';
function Button({ content, isPrimary = true }) {
  const { btn, primaryBtn, secondaryBtn } = styles;
  return (
    <button
      className={classnames(btn, {
        [primaryBtn]: isPrimary,
        [secondaryBtn]: !isPrimary,
      })}
    >
      {content}
    </button>
  );
}

export default Button;
