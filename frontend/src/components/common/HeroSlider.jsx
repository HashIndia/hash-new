import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    title: "HASHify Your Style",
    subtitle:
      "From campus to culture, redefining fashion for the next generation.",
  },
  {
    img: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47",
    title: "Premium T-Shirts",
    subtitle: "Elevate your wardrobe with comfort and class.",
  },
  {
    img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    title: "Streetwear Collection",
    subtitle: "Own your vibe, set your trend.",
  },
  {
    img: "https://images.unsplash.com/photo-1537799921743-6fd2a58e0a77",
    title: "Campus Essentials",
    subtitle: "Perfect fits for every college day.",
  },
  {
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
    title: "Cultural Vibes",
    subtitle: "Celebrate every occasion with HASH style.",
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

const HeroSlider = () => {
  return (
    <section className="relative h-[400px] md:h-[600px] text-white">
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
            <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
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
                  className="text-base md:text-lg"
                  variants={itemVariants}
                >
                  {slide.subtitle}
                </motion.p>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;
