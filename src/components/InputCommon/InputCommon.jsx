import { useState } from 'react';
import styles from './styles.module.scss';
import { IoEyeSharp } from 'react-icons/io5';
import { IoEyeOffSharp } from 'react-icons/io5';
function InputCommon({ label, type, isRequired = false, ...props }) {
  const { labelInput, boxInput, container, boxIcon, errors } = styles;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const { formik, id } = props;
  const isErr = formik.touched[id] && formik.errors[id];
  const messErr = formik.errors[id];
  const isShowTextPassword =
    type === 'password' && showPassword ? 'text ' : type;
  const handleShowPassWord = () => {
    setShowPassword(!showPassword);
  };
  console.log(props);
  return (
    <div className={container}>
      <div className={labelInput}>
        {label}
        {isRequired && <span>*</span>}
      </div>
      <div className={boxInput}>
        <input
          type={isShowTextPassword}
          {...props}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values[id]}
        />
        {isPassword && (
          <div className={boxIcon} onClick={handleShowPassWord}>
            {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
          </div>
        )}

        {isErr && <div className={errors}>{messErr}</div>}
      </div>
    </div>
  );
}

export default InputCommon;
