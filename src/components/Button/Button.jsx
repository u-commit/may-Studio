import styles from './style.module.scss';
import classnames from 'classnames';
function Button({ content, isPrimary = true }) {
  const { btn, primaryBtn, secondaryBtn, ...props } = styles;
  return (
    <button
      className={classnames(btn, {
        [primaryBtn]: isPrimary,
        [secondaryBtn]: !isPrimary,
      })}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
