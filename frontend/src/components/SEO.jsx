import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title = "HASH India - Premium Fashion Store | Shop Latest Trends Online",
  description = "HASH India - Discover premium fashion and clothing. Shop the latest trends in men's and women's fashion, t-shirts, jeans, dresses, and accessories with fast delivery across India. Best quality guaranteed.",
  keywords = "HASH India, hashindia, premium fashion, online clothing store, men's fashion, women's fashion, t-shirts, jeans, dresses, accessories, fashion trends, Indian fashion brand, online shopping India",
  image = "https://hashindia.com/hash-logo-text.jpg",
  url = "https://hashindia.com/",
  type = "website",
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  schema
}) {
  const fullTitle = title.includes('HASH India') ? title : `${title} | HASH India`;
  const robotsContent = `${noIndex ? 'noindex' : 'index'}, ${noFollow ? 'nofollow' : 'follow'}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="HASH India" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Schema.org structured data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
