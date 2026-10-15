import { useState } from 'react';
import Button from '../../Button/Button';
import InputCommon from '../../InputCommon/InputCommon';
import styles from './styles.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
function LogIn() {
  const { container, title, BoxRemeber, lostpw } = styles;
  const [isRegister, setIsRegister] = useState(false);
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
      cfmpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'password must match')
        .required('Confirm password is required'),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const handleTogge = () => {
    setIsRegister(!isRegister);
    formik.resetForm();
  };
  return (
    <div className={container}>
      <div className={title}>{isRegister ? 'Sign Up' : 'Sign In'}</div>
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
        {isRegister && (
          <InputCommon
            id='cfmpassword'
            label='Confirm Password'
            type='password'
            isRequired

            formik={formik}
          />
        )}
        {!isRegister && (
          <div className={BoxRemeber}>
            <input type='checkbox' />
            <span> Remeber me</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            content={isRegister ? 'Create Account' : 'LogIn'}
            type='submit'
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
          onClick={handleTogge}
        >
          <Button
            content={
              isRegister ? 'Already have an account?' : "Don't have an account?"
            }
            isPrimary={false}
            type='button'
            onClick={handleTogge}
          />
        </div>
      </form>
      {!isRegister && <div className={lostpw}>Lost your password</div>}
    </div>
  );
}

export default LogIn;
