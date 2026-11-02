import styles from './style.module.scss';
import classnames from 'classnames';
function Button({ content, isPrimary = true, className, ...Props }) {
  const { btn, primaryBtn, secondaryBtn } = styles;
  return (
    <button
      {...Props}
      className={classnames(
        btn,
        className,
        isPrimary ? primaryBtn : secondaryBtn
      )}
    >
      {content}
    </button>
  );
}

export default Button;
