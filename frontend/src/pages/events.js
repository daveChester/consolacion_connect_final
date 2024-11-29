import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const mockEvents = [
  {
    id: 1,
    title: "Alumni Networking Event",
    date: "December 10, 2023",
    description: "Join us for an evening of networking with fellow alumni.",
  },
  {
    id: 2,
    title: "Career Development Workshop",
    date: "January 15, 2024",
    description: "Enhance your career skills with our expert-led workshop.",
  },
  {
    id: 3,
    title: "Annual Alumni Reunion",
    date: "February 25, 2024",
    description: "Reconnect with classmates and celebrate our achievements.",
  },
  {
    id: 4,
    title: "Guest Speaker Series",
    date: "March 5, 2024",
    description: "Learn from industry leaders in our guest speaker series.",
  },
];

const Event = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = mockEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const EventItem = ({ event }) => (
    <div className="p-4 border-b border-text/20">
      <h3 className="text-xl font-bold text-text mb-2">{event.title}</h3>
      <p className="text-text mb-1 font-inter">{event.date}</p>
      <p className="text-text mb-4 font-inter">{event.description}</p>
      <Link
        to={`/events/${event.id}`}
        className="text-gold font-medium flex items-center"
      >
        View Details
        <ChevronRight className="ml-2" />
      </Link>
    </div>
  );

  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-6xl font-bold text-text mb-5 text-center">
          Upcoming <span className="text-gold">Events</span>
        </h2>
        <p className="text-text mb-10 text-lg text-center">
          Stay updated with our latest events and opportunities to connect.
        </p>

        <div className="mb-8">
          <input
            type="text"
            placeholder="Search events..."
            className="p-3 border border-text/30 rounded w-full font-inter"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div>
          {filteredEvents.length === 0 ? (
            <p className="text-text text-center">
              No events available at the moment.
            </p>
          ) : (
            filteredEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))
          )}
        </div>

        {isAuthenticated && (
          <div className="mt-10 text-center">
            <Link
              to="/post-event"
              className="bg-gold text-darker-blue py-2 px-4 rounded font-medium hover:bg-gold/90 transition-all duration-300"
            >
              Post a New Event
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Event;
