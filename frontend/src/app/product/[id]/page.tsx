'use client'
import axios from "axios";
import { useParams } from 'next/navigation';
import { isString } from "node:util";
import { useEffect, useState } from "react";

interface Product {
    id: string;
    name: string;
    price: number;
    img: string;
    type:string;
  }
export default function ProductPage (){
    const {id} = useParams();
    console.log(typeof(id))
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(()=>{
        if(id) {
            axios
            .get(`/api/products/${id}`)
            .then((response)=>{
                setProduct(response.data)
            })
            .catch((error)=>{
                console.log('Ошибка', error)
            })
        }
    },[id])
    if(!product) return <div>Ошибка</div>
    return (
        <div>
            <h3>{product.name}</h3>
            <p>{product.price}</p>
            <img src={`/images/catalog/${product.type}/${product.img}`} alt={product.name} /> 
        </div>
    )
}