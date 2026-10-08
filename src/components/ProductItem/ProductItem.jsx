import styles from './styles.module.scss';
import reloadIcon from '@icons/svgs/reloadIcon.svg';
import cartIcon from '@icons/svgs/cartIcon.svg';
import heartIcon from '@icons/svgs/heartIcon.svg';
function ProductItem({ src, PrevSrc, prevSrc, name, price }) {
  const previewSrc = PrevSrc ?? prevSrc;
  const { boxImg, showImgWhenHover, showFncWhenHover, boxIcon, title, Price } =
    styles;
  return (
    <div>
      <div className={boxImg}>
        <img src={src} alt='' />
        {previewSrc && (
          <img src={previewSrc} alt={name} className={showImgWhenHover} />
        )}
        <div className={showFncWhenHover}>
          <div className={boxIcon}>
            <img src={cartIcon} alt='' />
          </div>
          <div className={boxIcon}>
            <img src={heartIcon} alt='' />
          </div>
          <div className={boxIcon}>
            <img src={reloadIcon} alt='' />
          </div>
          <div className={boxIcon}>
            <img src={reloadIcon} alt='' />
          </div>
        </div>
      </div>
      <div className={title}>{name}</div>
      <div className={Price}>${price}</div>
    </div>
  );
}

export default ProductItem;
