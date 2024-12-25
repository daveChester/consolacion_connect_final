import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";

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
    <div className="p-8 border-b border-text/20">
      <h3 className="text-xl font-semibold text-text mb-2">{event.title}</h3>
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
        <h2 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
          Upcoming{" "}
          <span className="text-gold text-6xl font-paralucent font-semibold">
            Events
          </span>
        </h2>
        <p className="text-text mb-10 text-lg text-left">
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
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-text/50" />
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
      </div>
    </section>
  );
};

export default Event;
