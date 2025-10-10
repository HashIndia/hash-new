import { motion } from "framer-motion";

const offers = [
  "🎉 Get 30% OFF on all new arrivals! Use code: NEW30",
  "🚚 Free shipping on orders above ₹999",
  "🎁 Buy 2 Get 1 Free on all t-shirts",
  "⚡ Flash Sale: Extra 20% off on hoodies",
  "🌟 Student Special: 15% off with valid ID",
  "💫 Limited Time: Buy any 2 items and get free shipping",
];

export default function OffersStrip() {
  return (
    <div className="bg-black text-white py-3 overflow-hidden relative">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ 
          x: "-100%",
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }
        }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...Array(2)].map((_, arrayIndex) => (
          <div key={arrayIndex} className="flex gap-12 min-w-max">
            {offers.map((offer, index) => (
              <span 
                key={index} 
                className="text-sm md:text-base font-medium"
              >
                {offer}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}