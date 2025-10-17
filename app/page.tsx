"use client"

import { useState } from "react";

interface Contact {
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
}

interface Education {
  degree: string;
  school: string;
  gpa: string;
  period: string;
}

interface Experience {
  title: string;
  period: string;
  details: string[];
}

interface Project {
  title: string;
  link: string;
  details: string[];
}

interface Resume {
  name: string;
  contact: Contact;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
}


export default function Home() {
  const [resume, setResume] = useState<Resume>({
    name: "John Doe",
    contact: {
      location: "New York, USA",
      email: "john.doe@email.com",
      phone: "+1 234 567 890",
      website: "www.johndoe.com",
      linkedin: "linkedin.com/in/johndoe",
      github: "github.com/johndoe",
    },
    summary:
      "Passionate full-stack developer skilled in React, Next.js, and Node.js. I build scalable, high-performance web applications with clean code and thoughtful design.",
    education: [
      { degree: "BSc in Computer Science", school: "University of Pennsylvania", gpa: "GPA: 3.9/4.0", period: "Sept 2019 – May 2023" },
    ],
    experience: [
      { title: "Software Engineer, Apple – Cupertino, CA", period: "June 2023 – Present", details: ["Optimized backend services improving load times by 75%.", "Built reusable front-end components with TypeScript and TailwindCSS."] },
    ],
    projects: [
      { title: "Real-Time Collaboration Tool", link: "github.com/johndoe/realtime-collab", details: ["Created a web-socket-based collaboration app enabling multi-user live editing.", "Tech Used: React, Node.js, Socket.io, MongoDB."] },
    ],
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">Download PDF</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6">Editor Panel</div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h1 className="text-xl font-bold">{resume.name}</h1>
            <p>{resume.summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
