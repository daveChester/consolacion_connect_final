import React from "react";
import { Link } from "react-router-dom";

const GiveBackPage = () => {
  return (
    <section className="py-20 bg-background relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="block text-center lg:text-left mb-16">
          <h2 className="text-6xl text-darker-blue leading-[3.25rem] mb-5 font-paralucent">
            Give{" "}
            <span className="text-gold text-6xl font-paralucent font-semibold">
              Back
            </span>
          </h2>
          <p className="text-text/70 font-medium font-inter max-w-2xl lg:mx-0 mx-auto text-lg">
            Support La Consolacion College Bacolod and make a difference in the
            lives of current and future students.
          </p>
        </div>

        {/* Donation Information Section */}
        <div className="bg-background border-2 border-gold/20 p-8 rounded-3xl mb-12 transition-all duration-300 hover:shadow-neon">
          <h3 className="text-3xl font-paralucent text-text mb-6">
            How to Donate
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xl font-paralucent text-gold mb-4">
                Bank Transfer
              </h4>
              <div className="space-y-2 text-text/70 font-inter">
                <p>RCBC</p>
                <p>Account Name: La Consolacion College Bacolod</p>
                <p>Account No: 1419-372-443</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-xl font-paralucent text-gold mb-4">
                Palawan Express
              </h4>
              <div className="space-y-2 text-text/70 font-inter">
                <p>Name of Receiver: Jimmy S. Ong</p>
                <p>
                  Address: La Consolacion College Bacolod, Galo corner Gatuslao
                  Streets, Bacolod City
                </p>
                <p>Contact No: +639489754138</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-background border-2 border-gold/20 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-paralucent text-darker-blue mb-6">
            Join Us in Making a Difference
          </h3>
          <p className="text-text/70 font-medium font-inter mb-8 max-w-2xl mx-auto">
            Your contributions help us provide better facilities, scholarships,
            and opportunities for our students.
          </p>
          <Link
            to="/donate"
            className="inline-flex items-center justify-center cursor-pointer border border-gold shadow-sm rounded-full py-3.5 px-7 text-gold font-inter font-medium transition-all duration-300 hover:bg-gold hover:text-darker-blue group"
          >
            <span>Donate Now</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GiveBackPage;
