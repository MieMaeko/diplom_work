import styles from "../catalog/[type]/styles/catalog.module.scss";
import Product from "./Product"

interface ProductType {
    id: number;
    name: string;
    price: number;
    img: string;

  }
  
  interface ProductsProps {
    products: ProductType[];
    type: string;
  }
const Products: React.FC<ProductsProps> = ({ products,type }) => {

    return (
        <div className={styles.products}>
            {products.length ? (
                products.map(({ id, name, price, img }) => (
                    <Product key={id} id={id} name={name} price={price} img={img} type={type}/>))
            ): 
            (
            <p className={styles['no-products']}>Товары не найдены</p>
              )}

        </div>
    );

}
export default Products;