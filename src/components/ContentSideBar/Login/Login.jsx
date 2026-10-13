import InputCommon from '../../InputCommon/InputCommon';
import styles from './styles.module.scss';
function LogIn() {
  const { container, title } = styles;
  return (
    <div className={container}>
      <div className={title}>Sign In</div>
      <InputCommon />
    </div>
  );
}

export default LogIn;
