import styles from './style.module.scss';
import classnames from 'classnames';
function Button({
  content,
  isPrimary = true,
  variant,
  size,
  className,
  ...Props
}) {
  const {
    btn,
    primaryBtn,
    secondaryBtn,
    outlineBtn,
    adminPrimaryBtn,
    ghostBtn,
    dangerBtn,
    iconBtn,
    compactBtn,
  } = styles;
  const variantClass = {
    primary: primaryBtn,
    'admin-primary': adminPrimaryBtn,
    outline: outlineBtn,
    secondary: secondaryBtn,
    ghost: ghostBtn,
    danger: dangerBtn,
    icon: iconBtn,
  }[variant ?? (isPrimary ? 'primary' : 'secondary')];
  return (
    <button
      {...Props}
      className={classnames(
        btn,
        variantClass,
        size === 'compact' && compactBtn,
        className
      )}
    >
      {content}
    </button>
  );
}

export default Button;
