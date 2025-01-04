import { Helmet } from "react-helmet";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Index() {
  return (
    <>
      <Helmet>
        <title>Lovable - AI-Powered Development & Marketing Platform</title>
        <meta name="description" content="Build web apps, Android apps, and manage marketing campaigns with advanced AI technology. The most comprehensive AI-powered development and marketing platform." />
        <meta name="keywords" content="AI development, Android apps, marketing automation, Claude AI, web development, artificial intelligence, app builder" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Lovable - AI-Powered Development & Marketing Platform" />
        <meta property="og:description" content="Build web apps, Android apps, and manage marketing campaigns with advanced AI technology. The most comprehensive AI-powered development and marketing platform." />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lovable - AI-Powered Development & Marketing Platform" />
        <meta name="twitter:description" content="Build web apps, Android apps, and manage marketing campaigns with advanced AI technology." />
        <meta name="twitter:image" content="/og-image.png" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://lovable.dev" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Schema.org markup for rich results */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Lovable",
              "applicationCategory": "DeveloperApplication",
              "description": "AI-powered platform for building web apps, Android apps, and managing marketing campaigns.",
              "operatingSystem": "Web, Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Helmet>

      <main className="min-h-screen bg-gradient-to-br from-black to-black/95">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </>
  );
}