"use client";
import { useState } from "react";
import styles from "./styles/about.module.scss";
import YandexMap from "../components/YandexMap";
import Lightbox, { type SlideImage } from 'yet-another-react-lightbox'
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css"
import Image from "next/image";

// type Slide = {
//   src: string;
//   alt: string;
//   width: number;
//   height: number;
// };
export default function AboutPage() {

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const images: SlideImage[] = Array.from({ length: 9 }, (_, i) => ({
    src: `/images/sertificates/${i + 1}.png`,
    alt: `Сертификат ${i + 1}`,
    width: 350,
    height: 600,
  }));
  return (
    <div className={styles.about}>
      <h3>О нас</h3>
      <div className={styles.info}>
        <h4>Не штампуем, а создаем!</h4>
        <p> Каждый торт, капкейк, пирожное - уникальный, сделанный только для вас. Только свежие, натуральные продукты: бельгийский шоколад, фрукты, ягоды, молоко, сливки. Мечтаете о чем-то особенном? Расскажите - мы воплотим! Идеальные сочетания вкусов, постоянные новинки и всегда вовремя. Закажите и получите свежайший десерт, созданный именно таким, как вы хотели! Ваш праздник будет незабываемым!</p>
      </div>
      <div className={styles.sertificates}>
        <h4>Сертификаты и Дипломы </h4>
        <div className={styles.sertificatesImages}>
          {images.map((img, i) => (
            <Image
              key={img.src}
              src={img.src}
              alt={img.alt || ''}
              width={img.width}
              height={img.height}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
            />
          ))}
        </div>
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images}
          plugins={[Zoom]}
          zoom={{
            scrollToZoom: true,      // 🔍 Включает приближение по колёсику
            maxZoomPixelRatio: 3,    // 🔝 Максимальный зум (3x)
            zoomInMultiplier: 1.5,   // 🔍 Насколько увеличивать при скролле
            doubleTapDelay: 300,
            doubleClickDelay: 300,
            doubleClickMaxStops: 2,
          }}
          styles={{
            container: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        />

      </div>
      <div id="delivery" className={styles.sertificates}>
        <h4>Доставка</h4>
        <YandexMap />
      </div>
    </div>
  );
}
