import React from 'react';
import { ProductCard } from './ProductCard';
import './ProductsList.css';

export const ProductsList = ({ products, onAddToCart, onOpenCart = () => {} }) => {
  return (
    <div className="products-list">
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onOpenCart={onOpenCart}
          />
        ))}
      </div>
    </div>
  );
};