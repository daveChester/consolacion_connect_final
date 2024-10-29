// frontend/src/pages/landing-page.js
import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div
      className="bg-cover bg-center min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/lcc-bg.png)`,
      }}
    >
      <div className="text-background text-center">
        <div className="text-[19px] font-paralucent font-extralight">
          Welcome to
        </div>
        <img
          src={process.env.PUBLIC_URL + "/images/CCLogo.svg"}
          alt="Consolacion Connect Logo"
          className="w-[248] h-[100.25px] mx-auto mb-10"
        />

        <div className="flex flex-col items-center w-[248px]">
          <Link
            to="/login"
            className="text-[14px] bg-secondary hover:bg-darker-blue/80 text-background font-inter py-2 px-6 rounded-md mb-4 w-full flex items-center justify-center"
          >
            Continue with Email
          </Link>
          <button className="text-[14px] bg-blue3 hover:bg-blue3/80 text-background font-inter py-2 px-6 rounded-md mb-4 w-full flex items-center justify-center">
            <img
              src={`${process.env.PUBLIC_URL}/images/Google icon.svg`}
              alt="Google Icon"
              className="size-4 mr-2"
            />
            Continue with Google
          </button>
          <Link
            to="/home"
            className="text-background/70 hover:text-background text-sm font-inter font-light"
          >
            Look around for now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
