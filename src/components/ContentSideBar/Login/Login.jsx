import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../Button/Button';
import InputCommon from '../../InputCommon/InputCommon';
import styles from './styles.module.scss';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login, register } from '../../../apis/authService';
import { addRegisteredCustomer } from '../../../utils/customerStore';
import { DEMO_ADMIN_CREDENTIALS } from '../../../config/auth';
import { useAuth } from '../../../contexts/useAuth';
import { SideBarContext } from '../../../contexts/SideBarProvide';
import { ToastContext } from '../../../contexts/ToastProvide';

function readLoginResponse(response, identifier) {
  const candidates = [];
  let current = response?.payload ?? response;

  for (let depth = 0; current && typeof current === 'object' && depth < 5; depth += 1) {
    candidates.push(current);
    const nested = current.data ?? current.result ?? current.payload;
    if (!nested || nested === current) break;
    current = nested;
  }

  const findValue = (selector) => candidates.map(selector).find((value) => value != null);
  const token = findValue((value) => value.token ?? value.accessToken ?? value.access_token ?? value.jwt)
    ?? response?.headerToken;
  const apiUser = findValue((value) => value.user ?? value.account ?? value.customer ?? value.profile ?? value.userInfo);
  const userRecord = apiUser && typeof apiUser === 'object'
    ? apiUser
    : candidates.find((value) => value.role != null || value.roleName != null || value.username != null || value.email != null) ?? {};
  const user = {
    ...userRecord,
    email: userRecord.email ?? userRecord.username ?? identifier,
    username: userRecord.username ?? userRecord.email ?? identifier,
    role: userRecord.role ?? userRecord.roleName ?? 'user',
  };

  return { token, user };
}

function LogIn() {
  const { container, title, BoxRemeber, lostpw } = styles;
  const [isRegister, setIsRegister] = useState(false);
  const { toast } = useContext(ToastContext);
  const { signIn } = useAuth();
  const { setIsOpen } = useContext(SideBarContext);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      cfmpassword: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
      password: Yup.string()
        .min(6, 'Mật khẩu cần ít nhất 6 ký tự')
        .required('Vui lòng nhập mật khẩu'),
      cfmpassword: isRegister
        ? Yup.string()
            .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
            .required('Vui lòng xác nhận mật khẩu')
        : Yup.string().notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        if (isRegister) {
          if (values.email.trim().toLowerCase() === DEMO_ADMIN_CREDENTIALS.email) {
            throw new Error('Email quản trị được dành riêng, vui lòng dùng email khác để đăng ký.');
          }
          const response = await register({
            username: values.email.trim(),
            password: values.password,
          });
          const result = response?.data ?? response;
          const account = result?.user ?? result?.customer ?? result?.account ?? result?.data?.user ?? result?.data ?? result;
          addRegisteredCustomer({
            ...(account && typeof account === 'object' ? account : {}),
            email: account?.email ?? values.email,
          });
          toast('Đăng ký thành công. Hãy đăng nhập.');
          setIsRegister(false);
          formik.resetForm();
          return;
        }

        const normalizedEmail = values.email.trim().toLowerCase();
        if (normalizedEmail === DEMO_ADMIN_CREDENTIALS.email) {
          if (values.password !== DEMO_ADMIN_CREDENTIALS.password) {
            throw new Error('Email hoặc mật khẩu quản trị không đúng.');
          }
          signIn({
            token: 'demo-admin-session',
            user: { email: DEMO_ADMIN_CREDENTIALS.email, role: 'admin', name: 'Quản trị viên' },
          });
          setIsOpen(false);
          toast('Đăng nhập admin thành công.');
          navigate('/admin');
          return;
        }

        const response = await login({
          username: values.email.trim(),
          password: values.password,
        });
        const { token, user } = readLoginResponse(response, values.email.trim());

        if (!token) {
          throw new Error('API đăng nhập thành công nhưng không trả token. Kiểm tra phần Response của endpoint /login.');
        }

        if (String(user.role ?? user.roleName).toLowerCase() === 'admin') {
          throw new Error('Tài khoản này không được phép vào trang quản trị.');
        }

        signIn({ token, user });
        setIsOpen(false);
        toast('Đăng nhập thành công.');
        navigate('/user');
      } catch (error) {
        toast(error.response?.data?.message ?? error.message ?? 'Không thể hoàn tất yêu cầu.');
      }
    },
  });

  const handleToggle = () => {
    setIsRegister((current) => !current);
    formik.resetForm();
  };

  return (
    <div className={container}>
      <div className={title}>{isRegister ? 'Đăng ký' : 'Đăng nhập'}</div>
      <form onSubmit={formik.handleSubmit}>
        <InputCommon
          id='email'
          label='Email'
          type='email'
          isRequired
          formik={formik}
        />
        <InputCommon
          id='password'
          label='Mật khẩu'
          type='password'
          isRequired
          formik={formik}
        />
        {isRegister && (
          <InputCommon
            id='cfmpassword'
            label='Xác nhận mật khẩu'
            type='password'
            isRequired
            formik={formik}
          />
        )}
        {!isRegister && (
          <div className={BoxRemeber}>
            <input type='checkbox' />
            <span> Ghi nhớ đăng nhập</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            content={formik.isSubmitting ? 'Đang xử lý...' : isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
            type='submit'
            disabled={formik.isSubmitting}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '10px',
          }}
        >
          <Button
            content={
              isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'
            }
            isPrimary={false}
            type='button'
            onClick={handleToggle}
          />
        </div>
      </form>
      {!isRegister && <div className={lostpw}>Quên mật khẩu?</div>}
    </div>
  );
}

export default LogIn;
