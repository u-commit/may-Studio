import styles from '../styles.module.scss';
import fbIcon from '@icons/svgs/fbIcon.svg';
import igIcon from '@icons/svgs/insIcon.svg';
import ttIcon from '@icons/svgs/ttIcon.svg';

function BoxIcon({ type, href }) {
  const { boxIcon } = styles;

  const handRenderIcon = (type) => {
    switch (type) {
      case 'fb':
        return fbIcon;
      case 'tt':
        return ttIcon;
      case 'ig':
        return igIcon;

      default:
        return fbIcon;
    }
  };

  return (
    <div className={boxIcon}>
      <img src={handRenderIcon(type)} alt={type} />
    </div>
  );
}

export default BoxIcon;
