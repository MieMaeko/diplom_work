import styles from "@/styles/page.module.scss";
import type { Metadata } from "next";
import Categories from "./components/Categories";
export const metadata: Metadata = {
  title: "Sweetlana",
  description: "Кондитерская",
};

export default function HomePage() {
  return (
    <div>
        <section className={styles['first-block']}>
            <div className={styles['first-block-half1']}>
              <h1>Торты на заказ</h1>
              <p>воплощаем ваши сладкие мечты</p>
              <div className={styles['buttons-cake']}>
                <button className={styles['button-delivery']}>Доставка</button>
                <button className={styles['button-contacts']}>Контакты</button>
              </div>
            </div>
            <div className={styles['first-block-half2']}>
              <img className={styles["vector-cake"]} src="/images/vectors/cakeMain.svg" alt="" />
              <img className={styles["strawberry-cake"]} src="/images/page/pageCake.png" alt="cake"/>
            </div>
        </section>
        <section className={styles.news}>
          <div className={styles.benefits}>
            <div className={styles.candle}>
              <img src="/images/vectors/candle.svg" alt="candle" />
            </div>
            <div className={styles.firstLayerofCake}>
              <div className={styles['layer-content']}>
                <img src="/icons/clock.svg" alt="clock" />
                <span>все заказы исполняются без задержек</span>
              </div>
              <div className={styles.groundLayerofCake}></div>
            </div>
            <div className={styles.secondLayerofCake}>
              <div className={styles['layer-content']}>
                <img src="/icons/heart.svg" alt="clock" />
                <span>только качественные ингредиенты</span>
              </div>
              <div className={styles.groundLayerofCake}></div>
            </div>
            <div className={styles.thirdLayerofCake}>
              <div className={styles['layer-content']}>
                <img src="/icons/smile.svg" alt="clock" />
                <span>большой ассортимент вкусов </span>
              </div>
              <div className={styles.groundLayerofCake}></div>
            </div>
          </div>
          <div className={styles.newChocolate}>
              <div>
                <p className={styles.newChocolateH}>Новинка</p>
                <p>Дубайский шоколад  и прочее с фисташковой пастой и тестом катаифи</p>
                <button>Перейти</button>
              </div>
              <div>
                <img src="/images/page/chocolateBar.png"  alt="chocolateBar" />
              </div>
          </div>
        </section>
        <section className={styles.cakes}>
          <h4>Торты</h4>
          <Categories type='cake'/>
        </section>
        <section className={styles.desserts}>
          <h4>Десерты</h4>
          <Categories type='dessert'/>
        </section>
    </div>

  );
}
