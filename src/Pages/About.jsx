import Navbar from '@/Components/Navbar';
import React from 'react';

const About = () => {
  const teamMembers = [
    {
      name: 'Henrique Silva',
      role: 'Front-End Developer',
      bio: 'Henrique is a passionate Front-End Developer with experience in creating beautiful and responsive user interfaces. He is skilled in React, Tailwind CSS, and other modern web technologies.',
      imageUrl: '/path/to/henrique.jpg', // Replace with actual image path
    },
    {
      name: 'Gemini',
      role: 'AI Assistant',
      bio: 'Gemini is a powerful AI assistant that helps with a variety of tasks, from generating code to answering questions. It is an expert in many different fields and is always learning new things.',
      imageUrl: '/path/to/gemini.jpg', // Replace with actual image path
    },
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-8">About Us</h1>
        <p className="text-lg text-center mb-12">
          The Exomoon Archive is a project dedicated to providing the latest and most accurate data on exomoons. Our goal is to make this information accessible to everyone, from researchers to amateur astronomers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-gray-800 rounded-lg p-6">
              <img
                src={member.imageUrl}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-center">{member.name}</h2>
              <p className="text-lg text-center text-gray-400 mb-4">{member.role}</p>
              <p className="text-center">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;