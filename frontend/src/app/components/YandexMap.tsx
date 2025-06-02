"use client";
export default function YandexMap() {
  return (
    <div>
      <iframe
        src="https://yandex.ru/map-widget/v1/?um=constructor%3A6cdae434170a61d0b1b53b97261876b263c5fda9eb97d5baae866df6b78ff92a&amp;source=constructor"
        width="586"
        height="307"
        id="map"
        frameBorder="0"
        allowFullScreen
        style={{ display: "block", border: "none" }}
      />
    </div>
  );
}
