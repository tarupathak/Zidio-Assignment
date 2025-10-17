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

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { degree: "", school: "", gpa: "", period: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { title: "", period: "", details: [""] }]
    }));
  };

  const removeExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setResume(prev => ({
      ...prev,
      projects: [...prev.projects, { title: "", link: "", details: [""] }]
    }));
  };

  const removeProject = (index: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const addDetail = (section: "experience" | "projects", idx: number) => {
    setResume(prev => {
      const updated: any = { ...prev };
      updated[section][idx].details.push("");
      return updated;
    });
  };

  const removeDetail = (section: "experience" | "projects", idx: number, detailIdx: number) => {
    setResume(prev => {
      const updated: any = { ...prev };
      updated[section][idx].details = updated[section][idx].details.filter((_: any, i: number) => i !== detailIdx);
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

          {/* Education */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 text-lg">Education</h3>
            {resume.education.map((edu, idx) => (
              <div key={idx} className="space-y-2 border p-3 rounded-lg">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(`education.${idx}.degree`, e.target.value)}
                  placeholder="Degree"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) => handleChange(`education.${idx}.school`, e.target.value)}
                  placeholder="School/University"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => handleChange(`education.${idx}.gpa`, e.target.value)}
                  placeholder="GPA/Score"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={edu.period}
                  onChange={(e) => handleChange(`education.${idx}.period`, e.target.value)}
                  placeholder="Period"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <button
                  onClick={() => removeEducation(idx)}
                  className="px-4 py-1 text-red-600 border border-red-600 rounded-lg mt-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={addEducation}
              className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg"
            >
              Add Education
            </button>
          </div>

          {/* Experience */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 text-lg">Experience</h3>
            {resume.experience.map((exp, idx) => (
              <div key={idx} className="space-y-2 border p-3 rounded-lg">
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => handleChange(`experience.${idx}.title`, e.target.value)}
                  placeholder="Job Title / Company"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={exp.period}
                  onChange={(e) => handleChange(`experience.${idx}.period`, e.target.value)}
                  placeholder="Period"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                {exp.details.map((det, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={det}
                      onChange={(e) => handleChange(`experience.${idx}.details.${dIdx}`, e.target.value)}
                      placeholder="Detail"
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                    <button
                      onClick={() => removeDetail("experience", idx, dIdx)}
                      className="px-3 py-1 text-red-600 border border-red-600 rounded-lg"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addDetail("experience", idx)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                >
                  Add Detail
                </button>
                <button
                  onClick={() => removeExperience(idx)}
                  className="px-4 py-1 text-red-600 border border-red-600 rounded-lg mt-2"
                >
                  Remove Experience
                </button>
              </div>
            ))}
            <button
              onClick={addExperience}
              className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg"
            >
              Add Experience
            </button>
          </div>

          {/* Projects */}
          <div className="mt-4">
            <h3 className="font-semibold text-gray-900 text-lg">Projects</h3>
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="space-y-2 border p-3 rounded-lg">
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => handleChange(`projects.${idx}.title`, e.target.value)}
                  placeholder="Project Title"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                <input
                  type="text"
                  value={proj.link}
                  onChange={(e) => handleChange(`projects.${idx}.link`, e.target.value)}
                  placeholder="Project Link"
                  className="w-full px-4 py-2 border rounded-xl"
                />
                {proj.details.map((det, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={det}
                      onChange={(e) => handleChange(`projects.${idx}.details.${dIdx}`, e.target.value)}
                      placeholder="Detail"
                      className="w-full px-4 py-2 border rounded-xl"
                    />
                    <button
                      onClick={() => removeDetail("projects", idx, dIdx)}
                      className="px-3 py-1 text-red-600 border border-red-600 rounded-lg"
                    >
                      X
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addDetail("projects", idx)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg"
                >
                  Add Detail
                </button>
                <button
                  onClick={() => removeProject(idx)}
                  className="px-4 py-1 text-red-600 border border-red-600 rounded-lg mt-2"
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              onClick={addProject}
              className="px-4 py-2 mt-2 bg-green-600 text-white rounded-lg"
            >
              Add Project
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <h1 className="text-2xl font-bold">{resume.name}</h1>
            <p className="text-gray-700 mt-2">{resume.summary}</p>
            <p className="mt-1 text-sm text-gray-600">{resume.contact.email}</p>
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Education</h2>
              {resume.education.map((edu, idx) => (
                <div key={idx} className="mt-2">
                  <p className="font-semibold">{edu.degree} – {edu.school}</p>
                  <p className="text-sm">{edu.gpa} | {edu.period}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Experience</h2>
              {resume.experience.map((exp, idx) => (
                <div key={idx} className="mt-2">
                  <p className="font-semibold">{exp.title} | {exp.period}</p>
                  <ul className="list-disc list-inside">
                    {exp.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h2 className="font-semibold text-lg">Projects</h2>
              {resume.projects.map((proj, idx) => (
                <div key={idx} className="mt-2">
                  <p className="font-semibold">{proj.title} | <a href={proj.link} className="text-blue-600">{proj.link}</a></p>
                  <ul className="list-disc list-inside">
                    {proj.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
