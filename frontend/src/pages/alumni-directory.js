import React from "react";
import Header from "../components/Header.js";

const AlumniDirectoryPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-paralucent text-darker-blue mb-4">
          Alumni Directory
        </h1>
        <p className="text-lg font-inter text-text">
          Explore and connect with fellow alumni from La Consolacion College
          Bacolod.
        </p>
        {/*alumni directory content here */}
      </main>
    </div>
  );
};

export default AlumniDirectoryPage;
