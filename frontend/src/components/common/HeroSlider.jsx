import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Fallback slides for when no hero products are available
const fallbackSlides = [
  {
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    title: "HASHify Your Style",
    subtitle: "From campus to culture, redefining fashion for the next generation.",
    productId: null
  },
  {
    img: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
    title: "Premium T-Shirts",
    subtitle: "Elevate your wardrobe with comfort and class.",
    productId: null
  },
  {
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    title: "Streetwear Collection",
    subtitle: "Own your vibe, set your trend.",
    productId: null
  },
  {
    img: "https://images.unsplash.com/photo-1537799921743-6fd2a58e0a77",
    title: "Campus Essentials",
    subtitle: "Perfect fits for every college day.",
    productId: null
  },
  {
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    title: "Cultural Vibes",
    subtitle: "Celebrate every occasion with HASH style.",
    productId: null
  },
];

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7 },
  },
};

const HeroSlider = ({ heroProducts = [] }) => {
  // Use hero products if available, otherwise use fallback slides
  const slides = heroProducts.length > 0 
    ? heroProducts.map(product => ({
        img: product.images?.[0]?.url || product.images?.[0] || "https://placehold.co/1200x600/f8fafc/222?text=HASH+Product",
        title: product.name,
        subtitle: product.description?.substring(0, 100) + (product.description?.length > 100 ? "..." : "") || "Discover this amazing product",
        productId: product._id
      }))
    : fallbackSlides;

  return (
    <section className="relative h-[360px] md:h-[480px] text-white overflow-hidden rounded-b-3xl">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-[360px] md:h-[480px] flex items-center justify-center">
              <img
                src={slide.img}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 brightness-110"
              />
              <motion.div
                className="relative z-10 text-center max-w-2xl mx-auto px-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1
                  className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg"
                  variants={itemVariants}
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  className="text-base md:text-lg mb-6"
                  variants={itemVariants}
                >
                  {slide.subtitle}
                </motion.p>
                {slide.productId && (
                  <motion.div variants={itemVariants}>
                    <Link
                      to={`/product/${slide.productId}`}
                      className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Shop Now
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
