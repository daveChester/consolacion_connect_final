import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const News = () => {
  const swiperRef = React.useRef(null);

  const newsItems = [
    {
      image: "/images/news1.jpg",
      title: "LCCB Alumni Spotlight: Success Stories from Our Graduates",
      excerpt:
        "Discover inspiring journeys of LCCB alumni who have made significant impacts in their fields...",
    },
    {
      image: "/images/news2.jpg",
      title: "Upcoming Alumni Networking Event: Connect and Grow",
      excerpt:
        "Join us for an evening of networking, knowledge sharing, and career opportunities...",
    },
    {
      image: "/images/news2.jpg",
      title: "LCCB Launches New Mentorship Program for Recent Graduates",
      excerpt:
        "Learn about our new initiative connecting experienced alumni with recent graduates for career guidance...",
    },
    {
      image: "/images/news1.jpg",
      title: "Alumni Giving Back: How Our Graduates are Supporting LCCB",
      excerpt:
        "Explore the various ways LCCB alumni are contributing to the growth and development of our institution...",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-wrap md:flex-wrap lg:flex-nowrap lg:flex-row lg:justify-between gap-8">
          <div className="w-full flex justify-between flex-col lg:w-2/5">
            <div className="block lg:text-left text-center">
              <h2 className="text-6xl font-bold text-text leading-[3.25rem] mb-5 font-inter">
                Latest{" "}
                <span className="text-gold text-6xl font-inter">News</span>
              </h2>
              <p className="text-text font-inter mb-10 max-lg:max-w-xl max-lg:mx-auto text-lg">
                Stay updated with the latest news, events, and success stories
                from the LCCB alumni community.
              </p>
              <Link
                to="/news"
                className="cursor-pointer border border-text/50 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-text/70 font-inter font-medium transition-all duration-300 hover:bg-gold hover:text-darker-blue/80 hover:border-gold"
              >
                View All News
              </Link>
            </div>
            <div className="flex items-center lg:justify-start justify-center lg:mt-0 mt-8 gap-9 mb-4">
              <button
                onClick={() => swiperRef.current.swiper.slidePrev()}
                className="group flex justify-center items-center border border-solid border-gold size-12 transition-all duration-500 rounded-full hover:bg-gold"
              >
                <ChevronLeft className="h-6 w-6 text-gold group-hover:text-darker-blue" />
              </button>
              <button
                onClick={() => swiperRef.current.swiper.slideNext()}
                className="group flex justify-center items-center border border-solid border-gold size-12 transition-all duration-500 rounded-full hover:bg-gold"
              >
                <ChevronRight className="h-6 w-6 text-gold group-hover:text-darker-blue" />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-3/5">
            <Swiper
              ref={swiperRef}
              slidesPerView={2}
              spaceBetween={28}
              loop={true}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                568: {
                  slidesPerView: 2,
                  spaceBetween: 28,
                },
                1024: {
                  slidesPerView: 2,
                  spaceBetween: 32,
                },
              }}
            >
              {newsItems.map((item, index) => (
                <SwiperSlide key={index} className="group">
                  <div className="flex items-center mb-9">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="rounded-2xl w-full object-cover"
                    />
                  </div>
                  <h3 className="text-3xl font-paralucent font-medium text-text leading-8 mb-4 group-hover:text-gold/70">
                    {item.title}
                  </h3>
                  <p className="text-text font-inter transition-all duration-500 mb-8">
                    {item.excerpt}
                  </p>
                  <Link
                    to="/news"
                    className="cursor-pointer flex items-center gap-2 text-lg text-gold font-inter font-medium"
                  >
                    Read more
                    <ChevronRight className="size-4" />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
