import { useEffect, useState } from "react";
import productService from "../services/productServices";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await productService.getAll();
      setProducts(data);
      console.log(products);
    };

    fetch();
  }, []);

  return products;
};