import React from "react";
import Header from "../components/Header.js";

const ConnectPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-paralucent text-darker-blue mb-4">
          Connect
        </h1>
        <p className="text-lg font-inter text-text">
          Engage with the La Consolacion College Bacolod community and build
          valuable connections.
        </p>
        {/* Add connect content here */}
      </main>
    </div>
  );
};

export default ConnectPage;