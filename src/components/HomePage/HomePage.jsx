import Banner from '@components/Banner/Banner';
import MyHeader from '@components/Header/Header';
import SalesHomePage from '@components/SalesHomePage/salesHomePage.jsx';
import AdvanceHeading from '@components/AdvanceHeading/AdvanceHeading';
import Info from '@components/Info/Info';
import HeadingListProduct from '../HeadingListProduct/HeadingListProduct';
import { useEffect, useState } from 'react';
import { getProduct } from '@/apis/productsService';
import PopularProduct from '../PopularProduct/PopularProduct';
import MyFooter from '@components/Footer/Footer';
function HomePage() {
  const [listProducts, setListProducts] = useState([]);

  useEffect(() => {
    const query = {
      sortType: 0,
      page: 1,
      limit: 10,
    };

    getProduct(query).then((res) => {
      setListProducts(res.contents);
    });
  }, []);
  return (
    <>
      <MyHeader />
      <Banner />
      <Info />
      <AdvanceHeading />
      <HeadingListProduct data={listProducts.slice(0, 2)} />
      <PopularProduct data={listProducts.slice(2, listProducts.length - 1)} />
      <SalesHomePage />
      <MyFooter />
    </>
  );
}

export default HomePage;
