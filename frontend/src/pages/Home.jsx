import React from "react";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import CategoryStrip from "../components/CategoryStrip";
import LatestCollection from "../components/LatestCollection";
import PromoBanner from "../components/PromoBanner";
import BestSeller from "../components/BestSeller";
import BrandStory from "../components/BrandStory";
import Testimonials from "../components/Testimonials";
import OurPolicy from "../components/OurPolicy";
import NewsLetterBox from "../components/NewsLetterBox";

function Home() {
  return (
    <div className="pt-4 sm:pt-6">
      <Hero />

      {/* Sits right under the hero, bridging it and the first product grid */}
      <div className="mt-6">
        <Marquee />
      </div>

      <CategoryStrip />
      <LatestCollection />
      {/* The banner has no vertical padding of its own, so the gap to the
          best-seller card lives here */}
      <div className="mb-16 sm:mb-20">
        <PromoBanner />
      </div>

      <BestSeller />
      <BrandStory />
      <Testimonials />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
}

export default Home;
