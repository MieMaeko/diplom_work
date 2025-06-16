import Image from "next/image";
import styles from "../catalog/[type]/styles/catalog.module.scss";
import Link from "next/link";
interface ProductProps {
  id: number;
  name: string;
  img: string;
  price: number;
  type: string;
}

const Product = ({ id, name, img, price, type }: ProductProps) => {
  return (
    <div key={id} className={styles.product}>
      <Image
        src={`/images/catalog/${type}/${img}`}
        alt={name}
        width={300}
        height={300}
        priority
      />
      <div className={styles['name-price']}>
        <p>{name}</p>
        <p>от {price}р/кг</p>
      </div>
      <Link href={`/product/${id}`}>
        <button className={styles['button-order']}>Оформить</button>
      </Link>
    </div>
  );
};

export default Product;
