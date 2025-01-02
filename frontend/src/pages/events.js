import React, { useContext, useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import "swiper/css";

// Base API URL
const BASE_URL = "http://localhost:5000";

// Authentication overlay component shown to non-authenticated users
const AuthOverlay = () => (
  <div className="group">
    <div className="absolute inset-0 bg-text/85 group-hover:bg-text/95 transition ease-linear backdrop-blur-md rounded-3xl z-10 flex items-center justify-center">
      <div className="bg-background group-hover:shadow-neon rounded-xl p-8 max-w-md mx-4 relative transition ease-linear">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-darker-blue mb-8">
            Access exclusive events and activities
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

// Modal component to display event details
const EventModal = ({ event, onClose }) => {
  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-text" />
            </button>
          </div>
          <img
            src={`${BASE_URL}${event.image}`}
            alt={event.title}
            className="w-full h-[300px] object-cover rounded-2xl mb-6"
          />
          <span className="text-gold font-inter font-medium">
            {formatDate(event.event_date)}
          </span>
          <h2 className="text-4xl font-paralucent font-medium text-darker-blue mt-2 mb-4">
            {event.title}
          </h2>
          <div className="text-text/90 font-inter text-lg leading-relaxed">
            {event.excerpt}
          </div>
          {event.location && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-paralucent font-medium text-darker-blue mb-4">
                Event Details
              </h3>
              <div className="space-y-3 font-inter">
                <p className="flex items-start gap-2">
                  <span className="font-medium">Location:</span>
                  <span className="text-text/90">{event.location}</span>
                </p>
                {event.time && (
                  <p className="flex items-start gap-2">
                    <span className="font-medium">Time:</span>
                    <span className="text-text/90">{event.time}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Events component
const Events = () => {
  // Context and refs
  const { isAuthenticated } = useContext(AuthContext);
  const swiperRef = React.useRef(null);

  // State management
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  // Fetch events data
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/api/events`);
        setEvents(response.data);
        setFilteredEvents(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const intervalId = setInterval(fetchEvents, 30000);
    fetchEvents();
    return () => clearInterval(intervalId);
  }, []);

  // Filter events based on status
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) => event.status === activeFilter)
      );
    }
  }, [activeFilter, events]);

  // Helper functions
  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + "...";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Count events by status
  const upcomingEvents = events.filter(
    (event) => event.status === "upcoming"
  ).length;
  const ongoingEvents = events.filter(
    (event) => event.status === "ongoing"
  ).length;
  const completedEvents = events.filter(
    (event) => event.status === "completed"
  ).length;

  if (isLoading) return null;

  return (
    <section className="py-20 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-6xl text-darker-blue mb-5 font-paralucent">
            Upcoming <strong className="text-gold">Events</strong>
          </h2>
          <p className="text-text/70 font-medium font-inter mb-8 max-w-2xl mx-auto text-lg">
            Join us in celebrating achievements, fostering connections, and
            building a stronger alumni community through our events.
          </p>

          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-6 py-2 rounded-full font-inter font-medium transition-all duration-300 ${
                activeFilter === "all"
                  ? "bg-gold text-darker-blue"
                  : "border border-text/50 text-text/70 hover:bg-gold/10"
              }`}
            >
              All Events ({events.length})
            </button>
            <button
              onClick={() => setActiveFilter("upcoming")}
              className={`px-6 py-2 rounded-full font-inter font-medium transition-all duration-300 ${
                activeFilter === "upcoming"
                  ? "bg-gold text-darker-blue"
                  : "border border-text/50 text-text/70 hover:bg-gold/10"
              }`}
            >
              Upcoming ({upcomingEvents})
            </button>
            <button
              onClick={() => setActiveFilter("ongoing")}
              className={`px-6 py-2 rounded-full font-inter font-medium transition-all duration-300 ${
                activeFilter === "ongoing"
                  ? "bg-gold text-darker-blue"
                  : "border border-text/50 text-text/70 hover:bg-gold/10"
              }`}
            >
              Ongoing ({ongoingEvents})
            </button>
            <button
              onClick={() => setActiveFilter("completed")}
              className={`px-6 py-2 rounded-full font-inter font-medium transition-all duration-300 ${
                activeFilter === "completed"
                  ? "bg-gold text-darker-blue"
                  : "border border-text/50 text-text/70 hover:bg-gold/10"
              }`}
            >
              Completed ({completedEvents})
            </button>
          </div>

          {isAuthenticated && events.length > 0 && (
            <Link
              to="/events"
              className="inline-block cursor-pointer border border-text/50 shadow-sm rounded-full py-3.5 px-7 w-52 text-text/70 font-inter font-medium transition-all duration-300 hover:bg-gold hover:text-darker-blue/80 hover:border-gold"
            >
              View All Events
            </Link>
          )}
        </div>

        <div className="relative mb-16">
          {!isAuthenticated && <AuthOverlay />}
          {filteredEvents.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px] border-2 border-dashed border-text/20 rounded-3xl">
              <p className="text-text/50 text-lg">
                No {activeFilter !== "all" ? activeFilter : ""} events at the
                moment
              </p>
            </div>
          ) : (
            <div className="relative">
              <Swiper
                ref={swiperRef}
                slidesPerView={1}
                spaceBetween={28}
                loop={filteredEvents.length > 1}
                className={!isAuthenticated ? "blur-sm" : ""}
              >
                {filteredEvents.map((event) => (
                  <SwiperSlide key={event.id} className="group">
                    <div className="relative">
                      <img
                        src={`${BASE_URL}${event.image}`}
                        alt={event.title}
                        className="w-full h-[500px] object-cover rounded-2xl"
                      />
                      <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                          onClick={() => swiperRef.current?.swiper.slidePrev()}
                          className="group flex justify-center items-center bg-white/80 hover:bg-gold size-12 transition-all duration-500 rounded-full"
                        >
                          <ChevronLeft className="h-6 w-6 text-darker-blue" />
                        </button>
                        <button
                          onClick={() => swiperRef.current?.swiper.slideNext()}
                          className="group flex justify-center items-center bg-white/80 hover:bg-gold size-12 transition-all duration-500 rounded-full"
                        >
                          <ChevronRight className="h-6 w-6 text-darker-blue" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-gold font-inter font-medium">
                          {formatDate(event.event_date)}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium capitalize bg-gold/10 text-gold">
                          {event.status}
                        </span>
                      </div>
                      <h3 className="text-3xl font-paralucent font-medium text-text group-hover:text-gold/70">
                        {event.title}
                      </h3>
                      <div className="text-text/90 font-inter text-lg leading-relaxed">
                        {event.excerpt}
                      </div>
                      <div className="flex items-center gap-6 text-sm text-text/70">
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                        {event.time && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                      {isAuthenticated && (
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="cursor-pointer flex items-center gap-2 text-lg text-gold font-inter font-medium"
                        >
                          Learn more
                          <ChevronRight className="size-4" />
                        </button>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>

        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </section>
  );
};

export default Events;
