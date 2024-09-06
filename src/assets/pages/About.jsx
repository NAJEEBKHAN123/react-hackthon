import React from "react";

const About = () => {
  return (
    <div className="bg-gray-200 min-h-screen  flex items-center justify-center">
      <div className=" p-8 rounded shadow-lg max-w-2xl bg-blue-200 w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">About This Project</h1>
        <p className="text-gray-700 mb-4">
          Welcome to our Countdown Board web application! This project is designed to help teams manage tasks effectively in a project management environment. With a user-friendly interface, the application allows users to easily track tasks across different stages: To Do, In Progress, and Completed.
        </p>
        <p className="text-gray-700 mb-4">
          The application is built using modern web technologies like <span className="font-semibold">React</span> for the frontend and <span className="font-semibold">Firebase Firestore</span> for real-time database management. Our drag-and-drop functionality, powered by <span className="font-semibold">react-beautiful-dnd</span>, provides a seamless way to manage and organize tasks. 
        </p>
        <p className="text-gray-700 mb-4">
          We’ve focused on creating a smooth and intuitive user experience, using Tailwind CSS for styling to ensure a responsive and aesthetically pleasing design. The app includes features like task history tracking, where users can see the evolution of tasks through different stages, and a secure authentication system for personalized user experiences.
        </p>
        <p className="text-gray-700 mb-4">
          Whether you're managing a small project or coordinating a large team, this application is designed to make task management simple, efficient, and enjoyable.
        </p>
        <p className="text-center text-blue-500 font-semibold">
          Thank you for using our Countdown Board app!
        </p>
      </div>
    </div>
  );
};

export default About;
