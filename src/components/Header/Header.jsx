import BoxIcon from './Boxicon/Boxicon';
import { dataBoxicon, dataMenu } from './constants';
import Menu from './Menu/Menu';
import styles from './styles.module.scss';
import logo from '@icons/images/logo.png';
import reloadIcon from '@icons/svgs/reloadIcon.svg';
import cartIcon from '@icons/svgs/cartIcon.svg';
import heartIcon from '@icons/svgs/heartIcon.svg';

function MyHeader() {
  const {
    containerBoxIcon,
    containerMenu,
    containerHeader,
    containerBox,
    container,
    topHeader,
  } = styles;
  return (
    <div className={`${container} ${topHeader}`}>
      <div className={containerHeader}>
        <div className={containerBox}>
          <div className={containerBoxIcon}>
            {dataBoxicon.map((item) => {
              return <BoxIcon type={item.type} href={item.href} />;
            })}
          </div>
          <div className={containerMenu}>
            {dataMenu.slice(0, 3).map((item) => {
              return <Menu content={item.content} href={item.href} />;
            })}
          </div>
        </div>
        <div>
          <img
            src={logo}
            alt='logo'
            style={{ width: '153px', height: '53px' }}
          />
        </div>
        <div className={containerBox}>
          <div className={containerMenu}>
            {dataMenu.slice(3, dataMenu.length).map((item) => {
              return <Menu content={item.content} href={item.href} />;
            })}
          </div>
          <div className={containerBoxIcon}>
            <img width='26' height='26' src={reloadIcon} alt='reload' />
            <img width='26' height='26' src={heartIcon} alt='heart' />
            <img width='26' height='26' src={cartIcon} alt='search' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyHeader;
