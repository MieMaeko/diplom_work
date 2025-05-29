"use client";
import styles from "./styles/about.module.scss";
import YandexMap from "../components/YandexMap";
export default function AboutPage() {
  
  return (
    <div className={styles.about}>
      <h3>О нас</h3>
      <div className={styles.info}>
        <h4>Не штампуем, а создаем!</h4>
        <p> Каждый торт, капкейк, пирожное - уникальный, сделанный только для вас. Только свежие, натуральные продукты: бельгийский шоколад, фрукты, ягоды, молоко, сливки. Мечтаете о чем-то особенном? Расскажите - мы воплотим! Идеальные сочетания вкусов, постоянные новинки и всегда вовремя. Закажите и получите свежайший десерт, созданный именно таким, как вы хотели! Ваш праздник будет незабываемым!</p>
      </div>
      <div className={styles.sertificates}>
        <h4>Сертификаты и Дипломы </h4>
        <div></div>
      </div>
      <div className={styles.sertificates}>
        <h4>Доставка</h4>
        <YandexMap/>
      </div>
    </div>
  );
}
