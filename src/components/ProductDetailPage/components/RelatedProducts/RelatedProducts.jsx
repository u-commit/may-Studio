import { useMemo, useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ShopProductCard from '@components/ShopPage/components/ShopProductCard';
import { getShopCategoryName, getShopProductId } from '@components/ShopPage/hooks/shopHelpers';
import styles from './styles.module.scss';
const { container, relatedHeading, relatedViewport, relatedTrack, relatedCard, relatedArrow, relatedPrevious, relatedNext } = styles;

function RelatedProducts({ product, products, variantsByProductId }) {
  const trackRef = useRef(null);
  const relatedProducts = useMemo(() => {
    const currentId = getShopProductId(product);
    const others = products.filter((item) => getShopProductId(item) !== currentId);
    const currentCategory = getShopCategoryName(product);
    const sameCategory = currentCategory
      ? others.filter((item) => getShopCategoryName(item) === currentCategory)
      : [];
    const remaining = others.filter(
      (item) => !sameCategory.some((related) => getShopProductId(related) === getShopProductId(item))
    );
    return [...sameCategory, ...remaining].slice(0, 8);
  }, [product, products]);

  if (relatedProducts.length === 0) return null;

  function scroll(direction) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * track.clientWidth,
      behavior: 'smooth',
    });
  }

  return (
    <section className={container} aria-labelledby='related-products-title'>
      <h2 id='related-products-title' className={relatedHeading}>
        SẢN PHẨM LIÊN QUAN
      </h2>
      <div className={relatedViewport}>
        {relatedProducts.length > 4 && (
          <button
            type='button'
            className={`${relatedArrow} ${relatedPrevious}`}
            onClick={() => scroll(-1)}
            aria-label='Xem các sản phẩm trước'
          >
            <FiChevronLeft aria-hidden='true' />
          </button>
        )}
        <div className={relatedTrack} ref={trackRef}>
          {relatedProducts.map((item) => (
            <div className={relatedCard} key={item.id}>
              <ShopProductCard
                product={item}
                variants={variantsByProductId.get(getShopProductId(item)) ?? []}
                listView={false}
              />
            </div>
          ))}
        </div>
        {relatedProducts.length > 4 && (
          <button
            type='button'
            className={`${relatedArrow} ${relatedNext}`}
            onClick={() => scroll(1)}
            aria-label='Xem các sản phẩm tiếp theo'
          >
            <FiChevronRight aria-hidden='true' />
          </button>
        )}
      </div>
    </section>
  );
}

export default RelatedProducts;
