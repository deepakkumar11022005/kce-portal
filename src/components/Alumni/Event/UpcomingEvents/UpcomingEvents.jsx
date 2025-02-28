import React, { useState, useEffect } from "react";
import { ChevronDown, X, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import "./UpcomingEvents.css";
import bannerImg from '../../../../assets/images/carousel3.png'
// Event Card Component
const EventCard = ({ event }) => {
  const eventDate = new Date(event.event_date);
  const month = eventDate.toLocaleString("default", { month: "short" });
  const day = eventDate.getDate();

  // Determine the event status based on the current date
  const getStatus = () => {
    const currentDate = new Date();
    const eventDateOnly = eventDate.setHours(0, 0, 0, 0);
    const currentDateOnly = currentDate.setHours(0, 0, 0, 0);

    if (eventDateOnly > currentDateOnly) return "UPCOMING"; // Future event
    if (eventDateOnly === currentDateOnly) return "ONGOING"; // Event today
    return "PAST"; // Past event
  };

  const status = getStatus();

  return (
    <Link to={`/alumni/event/${event._id}`} className="event-card"> {/* Wrap in Link */}
      <div className="event-image-container">
        <img
          src={
            "https://ca-times.brightspotcdn.com/dims4/default/1b70a40/2147483647/strip/true/crop/1024x500+0+0/resize/1200x586!/quality/75/?url=https%3A%2F%2Fcalifornia-times-brightspot.s3.amazonaws.com%2Fdb%2F41%2F492145d642d9a3e01a57421cee11%2Fconciertos-1589446877-1024x500.jpg"
          }
          alt={event.title}
          className="event-image"
        />
        <div className="event-date-badge">
          <span className="event-month">{month}</span>
          <span className="event-day">{day}</span>
        </div>
      </div>

      <div className="event-content">
        <div className="event-tags">
          <span className="event-status">{status}</span>
          <span className="event-time">{event.time}</span>
        </div>

        <h3 className="event-name">{event.event_name}</h3>
        <h4 className="event-title">{event.title}</h4>
        <p className="event-description">{event.event_details}</p>

        <div className="event-meta">
          <div className="event-meta-item">
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className="event-meta-item">
            <MapPin size={16} />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Archive Sidebar Component
const ArchiveSidebar = ({ events, onFilterChange, onClear, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openYear, setOpenYear] = useState(null);

  const eventsByYear = events.reduce((acc, event) => {
    const year = new Date(event.event_date).getFullYear();
    const month = new Date(event.event_date).toLocaleString("default", {
      month: "long",
    });

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = 0;
    acc[year][month] += 1;
    return acc;
  }, {});

  const archiveContent = (
    <div className="archive-content">
      {Object.keys(eventsByYear)
        .sort((a, b) => b - a)
        .map((year) => (
          <div key={year} className="year-section">
            <button
              onClick={() => setOpenYear(openYear === year ? null : year)}
              className={`year-buttonn ${openYear === year ? "active" : ""}`}
            >
              <span>{year}</span>
              <ChevronDown size={16} />
            </button>

            {openYear === year && (
              <div className="month-list">
                {Object.keys(eventsByYear[year]).map((month) => (
                  <button
                    key={month}
                    onClick={() => {
                      onFilterChange(year, month);
                      if (isMobile) setIsOpen(false);
                    }}
                    className="month-button"
                  >
                    <span>{month}</span>
                    <span className="count">({eventsByYear[year][month]})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );

  if (isMobile) {
    return (
      <div className="archive-dropdown">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`archive-button-in-mobile ${isOpen ? "active" : ""}`}
        >
          <span>Archive Filter</span>
          <ChevronDown size={16} className="archive-icon" />
        </button>

        {isOpen && (
          <div className="archive-menu">
            <div className="archive-header">
              <h3>Filter by Date</h3>
              <button
                onClick={() => {
                  onClear();
                  setIsOpen(false);
                }}
                className="clear-button-in-mobile"
              >
                <X size={16} /> clear
              </button>
            </div>
            {archiveContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="archive-sidebar">
      <div className="archive-sidebar-header">
        <h3>Archive Filter</h3>
        <button onClick={onClear} className="clear-button">
          Clear All
        </button>
      </div>
      {archiveContent}
    </div>
  );
};

// Upcoming Events Component
const UpcomingEvents = ({ events }) => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Function to get event status
  const getStatus = (event) => {
    const eventDate = new Date(event.event_date);
    const currentDate = new Date();
    const eventDateOnly = eventDate.setHours(0, 0, 0, 0);
    const currentDateOnly = currentDate.setHours(0, 0, 0, 0);

    if (eventDateOnly > currentDateOnly) return "UPCOMING";
    if (eventDateOnly === currentDateOnly) return "ONGOING";
    return "PAST";
  };

  // Function to categorize and sort events
  const categorizeAndSortEvents = (events) => {
    const ongoing = [];
    const upcoming = [];
    const past = [];

    // Categorize events by status
    events.forEach((event) => {
      const status = getStatus(event);
      if (status === "ONGOING") ongoing.push(event);
      else if (status === "UPCOMING") upcoming.push(event);
      else past.push(event);
    });

    // Concatenate categories in the desired order
    return [...ongoing, ...upcoming, ...past];
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update filtered events with categorized and sorted events
  const handleFilterChange = (selectedYear, selectedMonth) => {
    const filtered = events.filter((event) => {
      const eventDate = new Date(event.event_date);
      const eventYear = eventDate.getFullYear().toString();
      const eventMonth = eventDate.toLocaleString("default", { month: "long" });
      return eventYear === selectedYear && eventMonth === selectedMonth;
    });
    setFilteredEvents(categorizeAndSortEvents(filtered)); // Categorize and sort after filtering
  };

  return (
    <div className="events-container">
      <div className="events-header">
        <h2>Upcoming Events</h2>
        {isMobile && (
          <ArchiveSidebar
            events={events}
            onFilterChange={handleFilterChange}
            onClear={() => setFilteredEvents(events)}
            isMobile={true}
          />
        )}
      </div>

      <div className="events-layout">
        {!isMobile && (
          <ArchiveSidebar
            events={events}
            onFilterChange={handleFilterChange}
            onClear={() => setFilteredEvents(events)}
            isMobile={false}
          />
        )}

        <div className="events-main">
          {filteredEvents.length > 0 ? (
            <div className="events-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No events available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
