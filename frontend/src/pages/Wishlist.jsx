import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useUserStore from '../utils/useUserStore';
import { authAPI } from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import WishlistPageSkeleton from '../components/WishlistPageSkeleton';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const { user, wishlist, setWishlist } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await authAPI.getWishlist();
        setWishlist(response.data.wishlist || []);
      } catch (error) {
        console.error('Failed to fetch wishlist:', error);
        toast.error('Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user, setWishlist]);

  const removeFromWishlist = async (productId) => {
    setRemovingId(productId);
    try {
      await authAPI.removeFromWishlist(productId);
      setWishlist(wishlist.filter(item => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  const addToCart = (product) => {
    // This would integrate with your cart system
    toast.success(`${product.name} added to cart!`);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto text-hash-pink/50 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4 font-space">Your Wishlist</h2>
          <p className="text-muted-foreground mb-6">Please log in to view your wishlist</p>
          <Button asChild className="bg-hash-purple hover:bg-hash-purple/90 text-white shadow-lg shadow-hash-purple/25">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <WishlistPageSkeleton />;
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 mx-auto text-hash-pink/50 mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4 font-space">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mb-6">Start adding items you love to your wishlist</p>
          <Button asChild className="bg-hash-purple hover:bg-hash-purple/90 text-white shadow-lg shadow-hash-purple/25">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-hash-pink" />
          <h1 className="text-3xl font-bold text-foreground font-space">My Wishlist</h1>
          <Badge variant="secondary" className="bg-hash-purple/10 text-hash-purple border border-hash-purple/20">{wishlist.length} items</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group bg-card/80 backdrop-blur-sm border border-border hover:shadow-lg transition-shadow duration-300 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-50">
                      <img
                        src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      disabled={removingId === product._id}
                      className="absolute top-2 right-2 p-2 bg-card/80 backdrop-blur-sm rounded-full shadow-md hover:bg-destructive/10 transition-colors border border-border"
                    >
                      {removingId === product._id ? (
                        <div className="w-4 h-4 animate-spin border-2 border-hash-pink border-t-transparent rounded-full"></div>
                      ) : (
                        <Trash2 className="w-4 h-4 text-hash-pink" />
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-lg mb-2 text-foreground hover:text-hash-purple transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-hash-purple">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-hash-blue/10 text-hash-blue border border-hash-blue/20">{product.category}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-hash-purple hover:bg-hash-purple/90 text-white shadow-lg shadow-hash-purple/25"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button asChild variant="outline" size="sm" className="border-border hover:bg-accent">
                        <Link to={`/product/${product._id}`}>View</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
