import React, { useState, useEffect, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import NewsSection from "../pages/news";
import Footer from "../components/Footer";
import { AuthContext } from "../AuthContext";
import "./animations.css";

const images = [
  "/images/image.jpg",
  "/images/image2.jpg",
  "/images/image3.jpg",
  "/images/image4.jpg",
];

const HomePage = () => {
  const [[page, direction], setPage] = useState([0, 0]);
  const { isAuthenticated } = useContext(AuthContext);
  const ctaSectionRef = useRef(null);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(([prevPage, _]) => [(prevPage + 1) % images.length, 1]);
    }, 4000);
    return () => clearTimeout(timer);
  }, [page, setPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("cta-visible");
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (ctaSectionRef.current) {
      observer.observe(ctaSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const CTAItem = ({ icon, title, description, linkText, linkHref }) => (
    <div className="cta-item text-background px-3 mb-8 md:mb-0">
      <img
        src={`${process.env.PUBLIC_URL}${icon}`}
        alt={`${title} Icon`}
        className="size-12 mb-4 mt-10"
      />
      <h3 className="text-2xl text-background mb-3">{title}</h3>
      <p className="font-inter font-light text-background mb-4">
        {description}
      </p>
      <Link
        to={linkHref}
        className="text-gold font-inter font-medium flex items-center"
      >
        {linkText}
        <img
          src={`${process.env.PUBLIC_URL}/images/arrow.svg`}
          alt="Arrow"
          className="ml-2 w-4 h-4"
        />
      </Link>
    </div>
  );

  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[calc(100vh-60px)] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={`${process.env.PUBLIC_URL}${images[page]}`}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20 },
              opacity: { duration: 1 },
            }}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </AnimatePresence>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 px-3 py-2 rounded-full z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                page === index ? "bg-gold" : "bg-blue1/30"
              }`}
            />
          ))}
        </div>

        <div
          className={`p-8 absolute top-[calc(60px+2rem)] left-4 md:left-12 rounded-xl z-10 w-[90%] md:w-[357px] h-auto ${
            isAuthenticated ? "md:h-[210px]" : "md:h-[357px]"
          }`}
          style={{
            background: `linear-gradient(30deg, #24243F, #5E5EA5)`,
          }}
        >
          {isAuthenticated ? (
            <>
              <h2 className="text-gold text-2xl md:text-3xl mb-4">
                Welcome back to the LCCB family,{" "}
                <span className="text-background">{user?.first_name}</span>
                <span className="text-background">!</span>
              </h2>
              <p className="text-background font-inter font-light text-sm md:text-base leading-relaxed mt-5">
                Share your story, find a mentor, or connect with fellow alumni.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-gold font-inter font-bold font-italic text-2xl md:text-3xl mb-4">
                Welcome back to the LCCB family
              </h2>
              <p className="text-background font-inter font-light text-sm md:text-base leading-relaxed mt-5">
                Stay connected and reconnect with your fellow alumni, discover
                new opportunities, and share your success stories.
              </p>
              <Link
                to="/sign-up"
                className="group relative bg-blue-500 hover:bg-blue-700 text-white font-inter py-2 w-full rounded mt-8 md:mt-12 inline-flex items-center justify-center h-12 px-6"
              >
                <span>Become a Member</span>
                <div className="ml-1 -rotate-45 transition-all duration-200 group-hover:rotate-0">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path
                      d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        ref={ctaSectionRef}
        className="cta-section p-10 z-10 w-full"
        style={{ background: "linear-gradient(120deg, #24243F, #2F62BE)" }}
      >
        <div className="flex flex-col md:flex-row justify-between max-w-7xl mx-auto mb-8">
          <CTAItem
            icon="/images/rocket.svg"
            title="Advance Your Career"
            description="Gain valuable insights, explore job opportunities, and connect with mentors."
            linkText="Discover Resources"
            linkHref="/job-board"
          />
          <CTAItem
            icon="/images/lccb.svg"
            title="Stay Connected to LCCB"
            description="Receive updates on school news, alumni events, and celebrate success stories."
            linkText="Read More"
            linkHref="/news"
          />
          <CTAItem
            icon="/images/contribute.svg"
            title="Get Involved"
            description="Connect with alumni chapters, attend events, and give back to your alma mater."
            linkText="Explore Community Events"
            linkHref="/give-back"
          />
        </div>
      </div>

      <NewsSection />
      <Footer />
    </div>
  );
};

export default HomePage;
