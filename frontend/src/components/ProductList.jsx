import ProductCard from './ProductCard';

export default function ProductList({ products }) {
  if (!products.length) return <div className="text-zinc-500 text-center py-12">No products found.</div>;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 