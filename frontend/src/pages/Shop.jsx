import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { productsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: pagination.page,
          limit: 12,
          search: searchTerm,
          category: selectedCategory,
          sort: sortBy.split('-')[0],
          order: sortBy.split('-')[1] || 'desc',
        };

        // Handle price range filtering
        if (priceRange !== 'all') {
          if (priceRange.startsWith('under-')) {
            params.minPrice = 0;
            params.maxPrice = parseInt(priceRange.split('-')[1]);
          } else if (priceRange.endsWith('-above')) {
            params.minPrice = parseInt(priceRange.split('-')[0]);
          } else {
            const [min, max] = priceRange.split('-');
            params.minPrice = parseInt(min);
            params.maxPrice = parseInt(max);
          }
        }
        
        if (params.category === 'all') delete params.category;

        const response = await productsAPI.getProducts(params);
        setProducts(response.data.products);
        setPagination({
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
        });
      } catch (err) {
        setError('Failed to fetch products.');
        toast.error('Could not load products.');
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchProducts();
    }, 300); // Debounce search input

    return () => clearTimeout(debounceFetch);
  }, [searchTerm, selectedCategory, priceRange, sortBy, pagination.page]);

  // Filter and sort products - This is now handled by the backend
  const filteredProducts = products;

  const categories = useMemo(() => {
    // This should ideally come from an API endpoint
    return ['T-Shirts', 'Jeans', 'Dresses', 'Accessories'];
  }, []);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-hash-purple/20 border-t-hash-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-hash-purple via-hash-blue to-hash-pink text-white py-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-50"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-space">
              <span className="text-white/90">#Shop</span> Collection
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4">
              Discover our complete range of premium fashion pieces
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="bg-card border-b border-border sticky top-16 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 md:w-5 md:h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 md:pl-12 pr-4 py-2 md:py-3 text-base md:text-lg bg-background border-border focus:ring-hash-purple"
              />
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 md:gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border text-sm md:text-base">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="t-shirts">T-Shirts</SelectItem>
                  <SelectItem value="jeans">Jeans</SelectItem>
                  <SelectItem value="dresses">Dresses</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border text-sm md:text-base">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-500">Under ₹500</SelectItem>
                  <SelectItem value="500-1000">₹500 - ₹1,000</SelectItem>
                  <SelectItem value="1000-2500">₹1,000 - ₹2,500</SelectItem>
                  <SelectItem value="2500-5000">₹2,500 - ₹5,000</SelectItem>
                  <SelectItem value="5000-above">₹5,000 & Above</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40 bg-background border-border text-sm md:text-base">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="name-asc">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-none border-r border-border px-2 md:px-3"
                >
                  <Grid className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none px-2 md:px-3"
                >
                  <List className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-2">
            <div className="text-sm md:text-base text-muted-foreground">
              Showing {filteredProducts.length} of {pagination.total} products
              {searchTerm && (
                <span className="ml-2 block sm:inline">
                  for "<span className="font-medium text-foreground">{searchTerm}</span>"
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {filteredProducts.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/product/${product._id}`}>
                    <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border bg-card h-full">
                      <CardContent className="p-0">
                        <div className="aspect-square overflow-hidden rounded-t-xl relative">
                          <img
                            src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-hash-purple transition-colors duration-200">{product.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-xl font-bold text-hash-purple">₹{product.price}</span>
                            <Badge variant="secondary" className="bg-hash-purple/10 text-hash-purple border-hash-purple/20">
                              {product.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}