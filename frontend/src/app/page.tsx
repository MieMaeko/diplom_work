'use client'
import styles from "@/styles/page.module.scss";
import type { Metadata } from "next";
import Categories from "./components/Categories";
import Image from 'next/image';
import Link from "next/link";
// export const metadata: Metadata = {
//   title: "Sweetlana",
//   description: "Кондитерская",
// };

export default function HomePage() {

  return (
    <div>
      <section className={styles['first-block']}>
        <div className={styles['first-block-half1']}>
          <h1>
            <span>Торты</span>
            <span>на заказ</span>
          </h1>
          <p>воплощаем ваши сладкие мечты</p>
          <div className={styles['buttons-cake']}>
            <button className={styles['button-delivery']}>Доставка</button>
            <button className={styles['button-contacts']}>Контакты</button>
          </div>
        </div>
        <div className={styles['first-block-half2']}>
          <Image
            className={styles["vector-cake"]}
            src="/images/vectors/cakeMain.svg"
            alt="vector-cake"
            height={612}
            width={600} />
          <Image
            className={styles["strawberry-cake"]}
            src="/images/page/pageCake.png"
            alt="strawberry-cake"
            height={558}
            width={558} />
        </div>
      </section>
      <section className={styles.news}>
        <div className={styles.benefits}>
          <div className={styles.candle}>
            <Image
              src="/images/vectors/candle.svg"
              alt="candle"
              height={125}
              width={20} />
          </div>
          <div className={styles.firstLayerofCake}>
            <div className={styles['layer-content']}>
              <Image
                src="/icons/clock.svg"
                alt="clock"
                height={37}
                width={37} />
              <span>все заказы исполняются без задержек</span>
            </div>
            <div className={styles.groundLayerofCake}></div>
          </div>
          <div className={styles.secondLayerofCake}>
            <div className={styles['layer-content']}>
              <Image
                src="/icons/heart.svg"
                alt="heart"
                height={37}
                width={37} />
              <span>только качественные ингредиенты</span>
            </div>
            <div className={styles.groundLayerofCake}></div>
          </div>
          <div className={styles.thirdLayerofCake}>
            <div className={styles['layer-content']}>
              <Image
                src="/icons/smile.svg"
                alt="smile"
                height={37}
                width={37} />
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
            <Image
              className={styles.chocolateBar}
              src="/images/page/chocolateBar.png"
              alt="chocolateBar"
              height={424}
              width={318} />
          </div>
        </div>
      </section>
      <section className={styles.cakes}>
        <h4>Торты</h4>
        <Categories type='cake' />
      </section>
      <section className={styles.desserts}>
        <h4>Десерты</h4>
        <Categories type='dessert' />
      </section>
      <section className={styles.builder}>
        <h4>Конструктор Торта</h4>
        <div className={styles['builder-blocks']}>
          <div className={styles['blocks-adv']}>
            <div className={styles.circle}>1</div>
            <div>
              <p>Начинка</p>
              <p>Откройте для себя мир восхитительных вкусов! Выберите любимую начинку, от классического шоколада до экзотических фруктовых муссов</p>
            </div>
          </div>
          <div className={styles['blocks-adv']}>
            <div className={styles.circle}>2</div>
            <div>
              <p>Дизайн</p>
              <p>Дайте волю фантазии! Прикрепите понравившийся вам дизайн, или выберите один из наших готовых вариантов</p>
            </div>
          </div>
          <div className={styles['blocks-adv']}>
            <div className={styles.circle}>3</div>
            <div>
              <p>Вес</p>
              <p>Рассчитайте идеальный размер для вашего праздника! Мы предлагаем торты различного веса, чтобы угодить каждому гостю.</p>
            </div>
          </div>
        </div>
        <button><Link href='/builder'>Перейти</Link></button>
      </section>
    </div>

  );
}
