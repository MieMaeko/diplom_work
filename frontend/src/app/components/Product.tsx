// components/Product.tsx
interface ProductProps {
    id: number;
    name: string;
    img: string;
    price: number;
    type: string;
  }
  
  export default function Product({
    id,
    name,
    img,
    price,
    type,
  }: ProductProps) {
    return (
      <div>
        <img src={`images/catalog/${type}/${img}`} alt={name} />
        <p>{name}</p>
        <p>{price} ₽</p>
        <button>Оформить</button>
      </div>
    );
  }
  