import React from "react";
import {
  Users,
  Briefcase,
  NewspaperIcon,
  Mentor,
  BookOpen,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const features = [
    {
      title: "Alumni Directory",
      description: "Connect with fellow LCCB graduates",
      icon: Users,
      stats: "2,500+ Alumni",
    },
    {
      title: "Job Board",
      description: "Explore career opportunities",
      icon: Briefcase,
      stats: "150+ Active Jobs",
    },
    {
      title: "News & Events",
      description: "Stay updated with LCCB happenings",
      icon: NewspaperIcon,
      stats: "20 Upcoming Events",
    },
    {
      title: "Mentorship",
      description: "Guide or be guided in your career",
      icon: Mentor,
      stats: "100+ Mentors",
    },
    {
      title: "Journeys",
      description: "Share your success story",
      icon: BookOpen,
      stats: "500+ Stories",
    },
    {
      title: "Honorem",
      description: "Remembering our fellow alumni",
      icon: Heart,
      stats: "In Memoriam",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <img
                src={`${process.env.PUBLIC_URL}/images/HomepageLogo.svg`}
                alt="LCCB Logo"
                className="h-8 w-auto"
              />
              <span className="ml-3 text-xl font-semibold text-gray-900">
                Consolacion Connect
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gray-100 p-2">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Your Alumni Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Stay connected with the LCCB community and explore opportunities
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {feature.title}
                </CardTitle>
                <feature.icon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{feature.description}</p>
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {feature.stats}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">
                    New job posted: Senior Software Engineer at Tech Corp
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">
                    Upcoming Event: Alumni Homecoming 2024
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                  <p className="text-sm">
                    New Success Story: "My Journey from LCCB to Silicon Valley"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
