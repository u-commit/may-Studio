import { useState } from 'react';
import styles from './styles.module.scss';
import { IoEyeSharp } from 'react-icons/io5';
import { IoEyeOffSharp } from 'react-icons/io5';
function InputCommon({ label, type, isRequired = false }) {
  const { labelInput, boxInput, container, boxIcon } = styles;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isShowTextPassword =
    type === 'password' && showPassword ? 'text ' : type;
  const handleShowPassWord = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className={container}>
      <div className={labelInput}>
        {label}
        {isRequired && <span>*</span>}
      </div>
      <div className={boxInput}>
        <input type={isShowTextPassword} />
        {isPassword && (
          <div className={boxIcon} onClick={handleShowPassWord}>
            {showPassword ? <IoEyeOffSharp /> : <IoEyeSharp />}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputCommon;
