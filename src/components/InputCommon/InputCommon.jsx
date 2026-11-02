import { useState } from 'react';
import styles from './styles.module.scss';
import classnames from 'classnames';
import { IoEyeSharp } from 'react-icons/io5';
import { IoEyeOffSharp } from 'react-icons/io5';

function InputCommon({
  label,
  type = 'text',
  isRequired = false,
  formik,
  id,
  value,
  defaultValue,
  onChange,
  onBlur,
  className,
  inputClassName,
  compact = false,
  ...inputProps
}) {
  const {
    labelInput,
    boxInput,
    container,
    boxIcon,
    errors,
    compactContainer,
  } = styles;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isErr = formik?.touched?.[id] && formik?.errors?.[id];
  const messErr = formik?.errors?.[id];
  const isShowTextPassword = type === 'password' && showPassword ? 'text' : type;
  const handleShowPassWord = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={classnames(container, className, {
        [compactContainer]: compact,
      })}
    >
      <label className={labelInput} htmlFor={id}>
        {label}
        {isRequired && <span>*</span>}
      </label>
      <div className={boxInput}>
        <input
          id={id}
          name={id}
          type={isShowTextPassword}
          required={isRequired}
          aria-invalid={Boolean(isErr)}
          className={inputClassName}
          {...inputProps}
          onBlur={formik ? formik.handleBlur : onBlur}
          onChange={formik ? formik.handleChange : onChange}
          {...(formik || value !== undefined
            ? { value: formik ? formik.values[id] : value }
            : { defaultValue })}
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
