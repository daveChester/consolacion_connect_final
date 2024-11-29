import React, { useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import "swiper/css";

const BASE_URL = "http://localhost:5000";

const Mentorship = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const swiperRef = React.useRef(null);
  const [mentors, setMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/mentors`);
        console.log("API Response:", response);
        setMentors(response.data);
      } catch (error) {
        console.error("Failed to fetch mentors:", error);
        if (error.response) {
          console.error(
            "Server responded with an error:",
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          console.error("No response received from server:", error.request);
        } else {
          console.error("Error setting up the request:", error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    const intervalId = setInterval(fetchMentors, 30000);
    fetchMentors();
    return () => clearInterval(intervalId);
  }, []);

  const AuthOverlay = () => (
    <div className="group">
      <div className="absolute inset-0 bg-text/85 group-hover:bg-text/95 transition ease-linear backdrop-blur-md rounded-3xl z-10 flex items-center justify-center">
        <div className="bg-background group-hover:shadow-neon rounded-xl p-8 max-w-md mx-4 relative transition ease-linear">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-darker-blue mb-8">
              Access our Mentorship Program
            </h3>
            <div className="flex gap-4 justify-center">
              <Link
                to="/login"
                className="bg-gold text-darker-blue px-6 py-2 rounded-full font-medium hover:bg-gold/90 transition-all duration-300"
              >
                Log In
              </Link>
              <p className="text-text mt-2 font-inter font-medium">or</p>
              <Link
                to="/signup"
                className="border border-gold text-gold px-6 py-2 rounded-full font-medium hover:bg-gold/10 transition-all duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between gap-8">
          <div className="w-full flex justify-between flex-col lg:w-2/5">
            <div className="block lg:text-left text-center">
              <h2 className="text-6xl font-bold text-text leading-[3.25rem] mb-5 font-inter">
                Mentorship{" "}
                <span className="text-gold text-6xl font-inter">Program</span>
              </h2>
              <p className="text-text font-inter mb-10 max-lg:max-w-xl max-lg:mx-auto text-lg">
                Connect with experienced alumni who can guide your professional
                journey and share invaluable insights.
              </p>
              {isAuthenticated && mentors.length > 0 && (
                <Link
                  to="/mentorship"
                  className="cursor-pointer border border-text/50 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-text/70 font-inter font-medium transition-all duration-300 hover:bg-gold hover:text-darker-blue/80 hover:border-gold"
                >
                  View All Mentors
                </Link>
              )}
            </div>
            {isAuthenticated && mentors.length > 2 && (
              <div className="flex items-center lg:justify-start justify-center lg:mt-0 mt-8 gap-9 mb-4">
                <button
                  onClick={() => swiperRef.current?.swiper.slidePrev()}
                  className="group flex justify-center items-center border border-solid border-gold size-12 transition-all duration-500 rounded-full hover:bg-gold"
                >
                  <ChevronLeft className="h-6 w-6 text-gold group-hover:text-darker-blue" />
                </button>
                <button
                  onClick={() => swiperRef.current?.swiper.slideNext()}
                  className="group flex justify-center items-center border border-solid border-gold size-12 transition-all duration-500 rounded-full hover:bg-gold"
                >
                  <ChevronRight className="h-6 w-6 text-gold group-hover:text-darker-blue" />
                </button>
              </div>
            )}
          </div>

          <div className="w-full lg:w-3/5 relative">
            {!isAuthenticated && <AuthOverlay />}
            {mentors.length === 0 ? (
              <div className="flex justify-center items-center min-h-[300px] border-2 border-dashed border-text/20 rounded-3xl">
                <p className="text-text/50 text-lg">
                  No mentors available at the moment
                </p>
              </div>
            ) : (
              <Swiper
                ref={swiperRef}
                slidesPerView={2}
                spaceBetween={28}
                loop={mentors.length > 2}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  568: {
                    slidesPerView: Math.min(2, mentors.length),
                    spaceBetween: 28,
                  },
                  1024: {
                    slidesPerView: Math.min(2, mentors.length),
                    spaceBetween: 32,
                  },
                }}
                className={!isAuthenticated ? "blur-sm" : ""}
              >
                {mentors.map((mentor) => (
                  <SwiperSlide key={mentor.id} className="group">
                    <div className="flex items-center mb-9">
                      <img
                        src={`${BASE_URL}${mentor.profile_image}`}
                        alt={mentor.name}
                        className="rounded-2xl w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-3xl font-paralucent font-medium text-text leading-8 mb-4 group-hover:text-gold/70">
                      {mentor.name}
                    </h3>
                    <p className="text-text font-inter transition-all duration-500 mb-4">
                      {mentor.professional_title}
                    </p>
                    <p className="text-text/70 font-inter text-sm mb-8">
                      {mentor.bio.substring(0, 100)}...
                    </p>
                    {isAuthenticated && (
                      <Link
                        to={`/mentorship/${mentor.id}`}
                        className="cursor-pointer flex items-center gap-2 text-lg text-gold font-inter font-medium"
                      >
                        View Profile
                        <ChevronRight className="size-4" />
                      </Link>
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentorship;
