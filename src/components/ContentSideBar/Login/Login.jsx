import Button from '../../Button/Button';
import InputCommon from '../../InputCommon/InputCommon';
import styles from './styles.module.scss';
function LogIn() {
  const { container, title, BoxRemeber, lostpw } = styles;
  return (
    <div className={container}>
      <div className={title}>Sign In</div>
      <InputCommon label=' Username or email' type='text' isRequired />
      <InputCommon label='Password' type='password' isRequired />
      <div className={BoxRemeber}>
        <input type='checkbox' />
        <span> Remeber me</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button content={'LogIn'} />
      </div>
      <div className={lostpw}>Lost your password</div>
    </div>
  );
}

export default LogIn;
