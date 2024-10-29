import React from "react";
import Header from "../components/Header.js";

const GiveBackPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-paralucent text-darker-blue mb-4">
          Give Back
        </h1>
        <p className="text-lg font-inter text-text">
          Support La Consolacion College Bacolod and make a difference in the
          lives of current and future students.
        </p>
        {/* Add give back content here */}
      </main>
    </div>
  );
};

export default GiveBackPage;
