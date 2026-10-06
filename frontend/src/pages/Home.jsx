import React from "react";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import CategoryStrip from "../components/CategoryStrip";
import LatestCollection from "../components/LatestCollection";
import PromoBanner from "../components/PromoBanner";
import BestSeller from "../components/BestSeller";
import DyeBath from "../components/DyeBath";
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

      {/* The page owns the rhythm: sections carry no vertical padding of
          their own, so the gap between any two is the same whether they are
          open or boxed. */}
      <div className="mt-16 flex flex-col gap-20 sm:mt-24 sm:gap-28">
        <CategoryStrip />
        <LatestCollection />
        <PromoBanner />
        <BestSeller />
        <DyeBath />
        <BrandStory />
        <Testimonials />
        <OurPolicy />
        <NewsLetterBox />
      </div>
    </div>
  );
}

export default Home;
