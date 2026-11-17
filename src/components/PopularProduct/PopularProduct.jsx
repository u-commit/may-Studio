import styles from './styles.module.scss';
const { container, module, searchResults, searchResultsFew } = styles;
import MainLayout from '@components/Layout/Layout';
import ProductItem from '@components/ProductItem/ProductItem';
function PopularProduct({ data, variantsByProductId, searchMode = false }) {
  const containerClass = [
    container,
    searchMode && searchResults,
    searchMode && data.length > 0 && data.length < 4 && searchResultsFew,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <MainLayout>
      <div id='product-list' className={containerClass}>
        {data.map((item) => (
          <ProductItem
            key={item.id}
            src={item.images[0]}
            prevSrc={item.images[1]}
            name={item.name}
            price={item.price}
            variants={variantsByProductId?.get(String(item.id)) ?? []}
            details={item}
          />
        ))}
      </div>
    </MainLayout>
  );
}

export default PopularProduct;
