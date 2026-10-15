import Button from '../../Button/Button';
import InputCommon from '../../InputCommon/InputCommon';
import styles from './styles.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
function LogIn() {
  const { container, title, BoxRemeber, lostpw } = styles;
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),

      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div className={container}>
      <div className={title}>Sign In</div>
      <form onSubmit={formik.handleSubmit}>
        <InputCommon
          id='email'
          label=' Username or email'
          type='text'
          isRequired

          formik={formik}
        />

        <InputCommon
          id='password'
          label='Password'
          type='password'
          isRequired

          formik={formik}
        />

        <div className={BoxRemeber}>
          <input type='checkbox' />
          <span> Remeber me</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button content={'LogIn'} type='submit' />
        </div>
      </form>
      <div className={lostpw}>Lost your password</div>
    </div>
  );
}

export default LogIn;
