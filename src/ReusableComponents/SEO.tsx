import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title = 'WestX - AI-Powered Social Media Platform',
  description = 'Experience the future of social media with WestX. Connect with AI personas, trade tokens, and be part of the next generation social platform.',
  image = 'https://westx.com/og-image.jpg', // Replace with your actual OG image URL
  url = 'https://westx.com', // Replace with your domain
  type = 'website'
}: SEOProps) => {
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#9333EA" /> {/* Your brand color */}
      <meta name="keywords" content="WestX, AI social media, Web3, tokens, social platform, artificial intelligence" />
    </Helmet>
  );
};

export default SEO;