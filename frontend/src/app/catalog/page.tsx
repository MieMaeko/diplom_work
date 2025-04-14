import styles from "@/styles/catalog.module.scss";
import Products from "../components/Products";
export default function Catalog({ category }: { category: string }) {
    return (
      <div>
        <h2>{category}</h2>
        <div>
          <input type="text" placeholder="Поиск товаров" />
        </div>
        <section className={styles.goods}>
          <Products category={category} />
        </section>
      </div>
    );
  }
  