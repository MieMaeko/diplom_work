"use client";

import Script from "next/script";

export default function YandexMap() {
  return (
    <>
      <div
        id="yandex-map-container"
        style={{ width: 586, height: 307, margin: "0 auto" }}
      />
      <Script
        src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A6cdae434170a61d0b1b53b97261876b263c5fda9eb97d5baae866df6b78ff92a&amp;width=586&amp;height=307&amp;lang=ru_RU&amp;scroll=true"
        strategy="lazyOnload"
        async
      />
    </>
  );
}
