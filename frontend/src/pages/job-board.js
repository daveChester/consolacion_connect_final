import React from "react";

const JobBoardPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-paralucent text-darker-blue mb-4">
          Job Board
        </h1>
        <p className="text-lg font-inter text-text">
          Discover career opportunities and job listings for La Consolacion
          College Bacolod alumni.
        </p>
        {/* Add job board content here */}
      </main>
    </div>
  );
};

export default JobBoardPage;
