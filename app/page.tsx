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

  const handleChange = (path: string, value: string) => {
    const keys = path.split(".");
    setResume((prev) => {
      const updated: any = { ...prev };
      let curr: any = updated;
      for (let i = 0; i < keys.length - 1; i++) curr = curr[keys[i]];
      curr[keys[keys.length - 1]] = value;
      return updated;
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Personal Information</h3>
            <input
              type="text"
              value={resume.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border rounded-xl"
            />
            {Object.entries(resume.contact).map(([key, value]) => (
              <input
                key={key}
                type="text"
                value={value}
                onChange={(e) => handleChange(`contact.${key}`, e.target.value)}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full px-4 py-3 border rounded-xl"
              />
            ))}
          </div>
          <div>
            <textarea
              value={resume.summary}
              onChange={(e) => handleChange("summary", e.target.value)}
              placeholder="Professional Summary"
              rows={4}
              className="w-full px-4 py-3 border rounded-xl resize-none"
            />
          </div>

          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg">Download PDF</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6">Editor Panel</div>
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h1 className="text-2xl font-bold">{resume.name}</h1>
            <p className="text-gray-700 mt-2">{resume.summary}</p>
            <p className="mt-1 text-sm text-gray-600">{resume.contact.email}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
