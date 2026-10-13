import styles from './styles.module.scss';
import logo from '@/assets/icons/images/logo.png';
import { dataMenu } from './constain';
import checkout from '@/assets/icons/images/check.png';
function MyFooter() {
  const { container, boxNav } = styles;

  return (
    <div className={container}>
      <div>
        <img src={logo} width={160} height={50} alt='' />
      </div>
      <div className={boxNav}>
        {dataMenu.map((item) => (
          <div>{item.content}</div>
        ))}
      </div>
      <div>
        <p style={{ textAlign: 'center' }}>Secure Payment Guaranteed</p>
        <img src={checkout} alt='' />
      </div>
      <div>
        <p style={{ textAlign: 'center', marginTop: '10px' }}>
          Copyright © 2024 Mây Studio. Designed & Developed by Mây Studio
        </p>
      </div>
    </div>
  );
}

export default MyFooter;
