import styles from './styles.module.scss';
import MainLayout from '@components/Layout/Layout';
import ProductItem from '@components/ProductItem/ProductItem';
function PopularProduct({ data, searchMode = false }) {
  const containerClass = [
    styles.container,
    searchMode && styles.searchResults,
    searchMode && data.length > 0 && data.length < 4 && styles.searchResultsFew,
  ].filter(Boolean).join(' ');
  return (
    <MainLayout>
      <div id={searchMode ? 'product-list' : undefined} className={containerClass}>
        {data.map((item) => (
          <ProductItem
            key={item.id}
            src={item.images[0]}
            prevSrc={item.images[1]}
            name={item.name}
            price={item.price}
            details={item}
          />
        ))}
      </div>
    </MainLayout>
  );
}

export default PopularProduct;
