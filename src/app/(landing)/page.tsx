import Footer from "@/components/Landing/Footer";
import Heading from "@/components/Landing/Heading";
import MainHero from "@/components/Landing/MainHero";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-y-8 px-6 pb-10 text-center md:justify-start">
      <Heading />
      <MainHero />
    </div>
  );
}
