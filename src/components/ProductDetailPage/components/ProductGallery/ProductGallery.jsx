import { useEffect, useState } from 'react';
import { FiZoomIn, FiX } from 'react-icons/fi';
import Button from '@components/Button/Button';
import styles from './styles.module.scss';
const {
  container,
  mainImage,
  thumbnails,
  thumbnail,
  placeholder,
  zoomButton,
  zoomOverlay,
  zoomDialog,
  zoomedImage,
  closeZoomButton,
} = styles;

function ProductGallery({ images, name, featuredImage }) {
  const [activeImage, setActiveImage] = useState(images[0] ?? '');
  const [zoomOpen, setZoomOpen] = useState(false);

  function moveZoomOrigin(event) {
    const bounds = event.currentTarget.parentElement.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    event.currentTarget.style.setProperty('--zoom-x', `${x}%`);
    event.currentTarget.style.setProperty('--zoom-y', `${y}%`);
  }

  useEffect(() => {
    setActiveImage(featuredImage || images[0] || '');
  }, [featuredImage, images]);

  useEffect(() => {
    if (!zoomOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setZoomOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [zoomOpen]);

  return (
    <div className={container}>
      <div className={mainImage}>
        {activeImage ? (
          <img src={activeImage} alt={name} onMouseMove={moveZoomOrigin} />
        ) : (
          <span className={placeholder}>MÂY STUDIO</span>
        )}
        {activeImage && (
          <Button
            type='button'
            variant='icon'
            className={zoomButton}
            content={<FiZoomIn aria-hidden='true' />}
            onClick={() => setZoomOpen(true)}
            aria-label='Phóng to ảnh sản phẩm'
          />
        )}
      </div>
      {images.length > 1 && (
        <div className={thumbnails} aria-label='Ảnh sản phẩm'>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type='button'
              className={thumbnail}
              onClick={() => setActiveImage(image)}
              aria-label={`Xem ảnh ${index + 1}`}
              aria-pressed={activeImage === image}
            >
              <img src={image} alt='' />
            </button>
          ))}
        </div>
      )}
      {zoomOpen && activeImage && (
        <div className={zoomOverlay} onClick={() => setZoomOpen(false)}>
          <div
            className={zoomDialog}
            role='dialog'
            aria-modal='true'
            aria-label={`Ảnh phóng to: ${name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <Button
              type='button'
              variant='icon'
              className={closeZoomButton}
              content={<FiX aria-hidden='true' />}
              onClick={() => setZoomOpen(false)}
              aria-label='Đóng ảnh phóng to'
            />
            <img className={zoomedImage} src={activeImage} alt={name} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
