import styles from './styles.module.css';
import item1 from '../../assets/images/Item.png';
import item3 from '../../assets/images/image3.png';
import Button from '@components/Button/Button';
import useTranslateXImage from './TranslateXImage.js';
import { useRef } from 'react';
function SalesHomePage() {
  const { container, title, des, boxbtn, boximg } = styles;
  const sectionRef = useRef(null);
  const { translateXPosition } = useTranslateXImage(sectionRef);

  return (
    <div className={container} ref={sectionRef}>
      <div
        className={boximg}
        style={{
          transform: `translateX(${translateXPosition}px)`,
          transition: 'transform 0.6s ease',
        }}
      >
        <img src={item1} alt='Item 1' />
      </div>
      <div>
        <h2 className={title}>Sale Of The Year</h2>
        <p className={des}>
          Timeless designs crafted with elegance. Discover your unique style
          every day.
        </p>

        <div className={boxbtn}>
          <Button content={'Read more'} isPrimary={false} />
        </div>
      </div>
      <div
        className={boximg}
        style={{
          transform: `translateX(-${translateXPosition}px)`,
          transition: 'transform 0.6s ease',
        }}
      >
        <img src={item3} alt='Item 2' />
      </div>
    </div>
  );
}

export default SalesHomePage;
