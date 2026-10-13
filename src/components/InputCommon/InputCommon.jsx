import styles from './styles.module.scss';
function InputCommon() {
  const { labelInput, boxInput, container } = styles;
  return (
    <div className={container}>
      <div className={labelInput}>userName or email</div>
      <div className={boxInput}>
        <input type='text' />
      </div>
    </div>
  );
}

export default InputCommon;
