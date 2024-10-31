import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Globe, Phone } from "lucide-react";
import { AuthContext } from "../AuthContext";

const Footer = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const navigationLinks = [
    { label: "Home", path: "/home" },
    { label: "Alumni Directory", path: "/alumni-directory" },
    { label: "Job Board", path: "/job-board" },
    { label: "News", path: "/news" },
    { label: "Events", path: "/events" },
    { label: "Mentorship", path: "/mentorship" },
    { label: "Journeys", path: "/journeys" },
    { label: "Give Back", path: "/give-back" },
  ];

  const socialLinks = [
    {
      Icon: Facebook,
      href: "https://www.facebook.com/lccb1919",
      label: "Facebook",
    },
    { Icon: Twitter, href: "https://x.com/LaConsolacionU", label: "Twitter" },
    {
      Icon: Instagram,
      href: "https://www.instagram.com/lccb1919/",
      label: "Instagram",
    },
    { Icon: Globe, href: "https://lcc.edu.ph/", label: "Website" },
    { Icon: Phone, href: "asdadsad", label: "Phone" },
  ];

  return (
    <footer
      className="text-background pt-12 pb-6"
      style={{
        backgroundColor: "hsla(240,27%,19%,1)",
        backgroundImage: `
          radial-gradient(at 18% 3%, hsla(240,27%,19%,1) 0px, transparent 50%),
          radial-gradient(at 100% 100%, hsla(240,27%,19%,1) 0px, transparent 50%),
          radial-gradient(at 100% 0%, hsla(240,28%,50%,1) 0px, transparent 50%),
          radial-gradient(at 15% 60%, hsla(240,23%,27%,1) 0px, transparent 50%)
        `,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo and Social Icons Column */}
          <div className="space-y-6">
            <img
              src={`${process.env.PUBLIC_URL}/images/footerlogo.svg`}
              alt="Footer Logo"
              className="h-6"
            />
            <div className="flex space-x-4">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="text-background hover:text-gold transition-colors"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Middle Column - Different content based on auth status */}
          <div className="lg:col-span-1">
            {isAuthenticated ? (
              <>
                <h3 className="text-gold font-medium text-lg mb-4">
                  Quick Links
                </h3>
                <nav className="grid grid-cols-2 gap-4">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-background hover:text-gold transition-colors font-inter text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </>
            ) : (
              <div className="space-y-4">
                <h3 className="text-gold font-medium text-lg mb-4">
                  Join Our Community
                </h3>
                <p className="text-background/80 font-inter text-sm leading-relaxed">
                  Connect with fellow alumni, access exclusive resources, and
                  stay updated with the latest opportunities from LCCB.
                </p>
                <Link
                  to="/sign-up"
                  className="inline-block bg-gold text-text px-6 py-2 rounded hover:bg-opacity-90 transition-colors font-inter text-sm"
                >
                  Become a Member Now
                </Link>
              </div>
            )}
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-1">
            <h3 className="text-gold font-medium text-lg mb-4">Get in Touch</h3>
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-background/10 border border-background/20 rounded focus:outline-none focus:border-gold text-background placeholder:text-background/60 font-light text-sm"
                />
              </div>
              <div>
                <textarea
                  rows="3"
                  placeholder="Your message"
                  className="w-full px-4 py-2 bg-background/10 border border-background/20 rounded focus:outline-none focus:border-gold text-background placeholder:text-background/60 font-light text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-gold text-text px-6 py-2 rounded hover:bg-opacity-90 transition-colors font-inter text-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Copyright Section with Additional Info */}
        <div className="mt-12 pt-6 border-t border-background/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-background/60 text-sm font-inter font-light tracking-wide">
              <p>La Consolacion College Bacolod</p>
              <p>Alumni Connect Platform</p>
            </div>
            {!isAuthenticated && (
              <div className="text-right text-background/60 text-sm font-inter">
                <Link to="/login" className="hover:text-gold">
                  Login
                </Link>
                {" · "}
                <Link to="/sign-up" className="hover:text-gold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <p className="text-center text-background/60 text-xs font-inter font-light">
            © {new Date().getFullYear()} LCCB Alumni Connect. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
