import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeatureSection";
import HowItWorks from "../components/HowItWorks";
import TopDestinations from "../components/TopDestinations";

const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <TopDestinations />
      <FeaturesSection />
      <HowItWorks />
    </div>
  );
};

export default HomePage;
