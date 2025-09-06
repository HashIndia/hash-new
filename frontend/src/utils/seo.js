// SEO utility functions for HASH India

export const generateProductSchema = (product) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "description": product.description,
  "image": product.images?.map(img => img.url || img) || [],
  "brand": {
    "@type": "Brand",
    "name": "HASH India"
  },
  "category": product.category,
  "sku": product._id,
  "offers": {
    "@type": "Offer",
    "price": product.price,
    "priceCurrency": "INR",
    "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    "seller": {
      "@type": "Organization",
      "name": "HASH India",
      "url": "https://hashindia.com"
    }
  },
  "aggregateRating": product.reviewStats?.totalReviews > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": product.reviewStats.averageRating || 5,
    "reviewCount": product.reviewStats.totalReviews || 1
  } : undefined
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": `https://hashindia.com${crumb.url}`
  }))
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HASH India",
  "alternateName": "hashindia",
  "url": "https://hashindia.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://hashindia.com/shop?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HASH India",
  "alternateName": ["hashindia", "HASH", "NITK HASH", "HASH NITK"],
  "url": "https://hashindia.com",
  "logo": "https://hashindia.com/hash-logo-text.jpg",
  "description": "HASH India - Student-run premium fashion startup from NITK Surathkal. Founded by engineering students, offering latest trends in men's and women's clothing with affordable prices and fast delivery across India. Quality fashion by students, for students.",
  "foundingDate": "2024",
  "foundingLocation": {
    "@type": "Place",
    "name": "NITK Surathkal, Karnataka, India"
  },
  "founder": {
    "@type": "Person",
    "name": "NITK Students",
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "National Institute of Technology Karnataka, Surathkal",
      "alternateName": "NITK Surathkal"
    }
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "areaServed": "India",
    "availableLanguage": ["English", "Hindi"]
  },
  "areaServed": "India",
  "keywords": "student startup, NITK, student run, fashion brand, engineering students, college brand, student entrepreneurs, youth fashion, affordable fashion, campus delivery",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "HASH India Fashion Collection",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Student-Friendly Premium T-Shirts",
          "category": "Men's & Women's Fashion"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Campus Wear Designer Jeans",
          "category": "Men's & Women's Fashion"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "College Event Trendy Dresses",
          "category": "Women's Fashion"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Student Fashion Accessories",
          "category": "Accessories"
        }
      }
    ]
  },
  "sameAs": [
    "https://www.instagram.com/hashindia",
    "https://www.facebook.com/hashindia",
    "https://twitter.com/hashindia"
  ]
});

// SEO keywords for different pages
export const SEO_KEYWORDS = {
  home: "HASH India, hashindia, premium fashion, online clothing store, men's fashion, women's fashion, t-shirts, jeans, dresses, accessories, fashion trends, Indian fashion brand, online shopping India, latest fashion, trendy clothes, NITK, student run, student startup, college brand, student fashion, NITK Surathkal, student entrepreneurs, engineering students, student business, young adults, college students, university students, youth brand, affordable fashion, student friendly, budget friendly, student discounts, campus delivery, made by students",
  shop: "shop fashion India, buy clothes online, HASH India shop, t-shirts online, jeans online, dresses online, accessories, fashion shopping, trendy clothes India, online clothing store, student shopping, NITK students, college fashion, university wear, student clothing, campus style, affordable student fashion, budget clothes, student discounts",
  about: "HASH India about, fashion brand story, premium clothing brand, fashion company India, HASH India history, quality fashion, brand values, NITK startup, student run company, student entrepreneurs, college brand story, NITK Surathkal, engineering students, student innovation, campus startup, youth entrepreneurship, student founders, academic excellence",
  contact: "HASH India contact, customer service, fashion support, online shopping help, brand contact information, student support, NITK contact, campus delivery, student queries, college customer service",
  category: {
    tshirts: "premium t-shirts, HASH India t-shirts, buy t-shirts online, men's t-shirts, women's t-shirts, trendy tees, student t-shirts, college tees, university wear, NITK merchandise, campus fashion, affordable tees",
    jeans: "designer jeans, HASH India jeans, buy jeans online, men's jeans, women's jeans, premium denim, student jeans, college wear, university fashion, affordable denim, campus style",
    dresses: "trendy dresses, HASH India dresses, buy dresses online, women's dresses, party dresses, casual dresses, college dresses, university wear, student fashion, campus events, affordable dresses",
    accessories: "fashion accessories, HASH India accessories, buy accessories online, trendy accessories, student accessories, college gear, university merchandise, NITK accessories, campus style"
  }
};

// Meta descriptions for different page types
export const META_DESCRIPTIONS = {
  home: "HASH India - Student-run premium fashion brand from NITK Surathkal. Discover latest trends in men's and women's clothing, t-shirts, jeans, dresses, and accessories. Quality fashion by students, for students. Fast delivery across India.",
  shop: "Shop the latest collection at HASH India - NITK's own fashion brand. Premium student-friendly t-shirts, jeans, dresses, and accessories. Affordable prices, quality guaranteed, and fast campus delivery!",
  about: "Learn about HASH India's journey - A student-run fashion startup from NITK Surathkal. Founded by engineering students with passion for fashion excellence. Discover our commitment to quality, affordability, and student community.",
  contact: "Get in touch with HASH India - NITK's student-run fashion brand. Contact our student team for orders, campus delivery, student discounts, or any questions about our fashion collection. We're here to help!",
  category: {
    tshirts: "Explore HASH India's premium t-shirt collection - designed by NITK students. Shop trendy, comfortable, and affordable t-shirts perfect for college life. Student discounts available!",
    jeans: "Discover HASH India's designer jeans collection from NITK's own fashion brand. Premium quality, student-friendly prices. Perfect for campus life and beyond.",
    dresses: "Shop HASH India's trendy dress collection - crafted by students for students. From campus events to parties, find the perfect dress. NITK's own fashion brand with student-friendly prices.",
    accessories: "Complete your campus look with HASH India's fashion accessories. Student-designed, premium quality accessories from NITK's own fashion startup. Affordable prices for students."
  }
};
