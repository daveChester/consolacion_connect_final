import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import "swiper/css";

const BASE_URL = "http://localhost:5000";

const News = () => {
  const swiperRef = React.useRef(null);
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/news`);
        console.log("API Response:", response);
        setNewsItems(response.data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
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
    const intervalId = setInterval(fetchNews, 30000);
    fetchNews();
    return () => clearInterval(intervalId);
  }, []);

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
              <h2 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
                Latest{" "}
                <span className="text-gold text-6xl font-paralucent font-semibold">
                  News
                </span>
              </h2>
              <p className="text-text/70 font-medium font-inter mb-10 max-lg:max-w-xl max-lg:mx-auto text-lg">
                Stay updated with the latest news, events, and success stories
                from the LCCB alumni community.
              </p>
              {newsItems.length > 0 && (
                <Link
                  to="/news"
                  className="cursor-pointer border border-text/50 shadow-sm rounded-full py-3.5 px-7 w-52 lg:mx-0 mx-auto flex justify-center text-text/70 font-inter font-medium transition-all duration-300 hover:bg-gold hover:text-darker-blue/80 hover:border-gold"
                >
                  View All News
                </Link>
              )}
            </div>
            {newsItems.length > 2 && (
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
            {newsItems.length === 0 ? (
              <div className="flex justify-center items-center min-h-[300px] border-2 border-dashed border-text/20 rounded-3xl">
                <p className="text-text/50 text-lg">
                  No news available at the moment
                </p>
              </div>
            ) : (
              <Swiper
                ref={swiperRef}
                slidesPerView={2}
                spaceBetween={28}
                loop={newsItems.length > 2}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  568: {
                    slidesPerView: Math.min(2, newsItems.length),
                    spaceBetween: 28,
                  },
                  1024: {
                    slidesPerView: Math.min(2, newsItems.length),
                    spaceBetween: 32,
                  },
                }}
              >
                {newsItems.map((item) => (
                  <SwiperSlide key={item.id} className="group">
                    <div className="flex items-center mb-9">
                      <img
                        src={`${BASE_URL}${item.image}`}
                        alt={item.title}
                        className="rounded-2xl w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-3xl font-paralucent font-medium text-text leading-8 mb-4 group-hover:text-gold/70">
                      {item.title}
                    </h3>
                    <p className="text-text font-inter transition-all duration-500 mb-8">
                      {item.excerpt}
                    </p>
                    <Link
                      to={`/news/${item.id}`}
                      className="cursor-pointer flex items-center gap-2 text-lg text-gold font-inter font-medium"
                    >
                      Read more
                      <ChevronRight className="size-4" />
                    </Link>
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

export default News;
