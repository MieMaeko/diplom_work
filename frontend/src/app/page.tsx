import styles from "@/styles/page.module.scss";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Sweetlana",
  description: "Кондитерская",
};

export default function HomePage() {
  return (
    <div>
        <div className={styles['first-block']}>
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
        </div>
        <div className={styles.news}>
          <div className={styles.benefits}>
            <div className={styles.candle}></div>
            <div className={styles.firstLayerofCake}>
              <div>icon 
                <span>все заказы исполняются без задержек</span>
              </div>
              <div></div>
            </div>
            <div className={styles.secondLayerofCake}>
              <div>icon 
                <span>только качественные ингредиенты</span>
              </div>
              <div></div>
            </div>
            <div className={styles.thirdLayerofCake}>
              <div>icon 
                <span>большой ассортимент вкусов </span>
              </div>
              <div></div>
            </div>
          </div>
          <div className={styles.newChocolate}>
              <div>
                <p>Новинка</p>
                <p>Дубайский шоколад  и прочее с фисташковой пастой и тестом катаифи</p>
                <button>Перейти</button>
              </div>
              <div>
                <img src="" alt="" />
              </div>
          </div>
        </div>
    </div>

  );
}
