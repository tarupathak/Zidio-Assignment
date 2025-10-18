"use client";
import { useState, useRef, ChangeEvent } from "react";
import { Download, Plus, Trash2, Mail, Phone, MapPin, Globe, Linkedin, Github, AlertCircle } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

interface Errors {
  [key: string]: string | null;
}

export default function Home() {
  const resumeRef = useRef<HTMLDivElement | null>(null);

  const [errors, setErrors] = useState<Errors>({});

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
      {
        degree: "BSc in Computer Science",
        school: "University of Pennsylvania",
        gpa: "GPA: 3.9/4.0",
        period: "Sept 2019 – May 2023",
      },
    ],
    experience: [
      {
        title: "Software Engineer, Apple – Cupertino, CA",
        period: "June 2023 – Present",
        details: [
          "Optimized backend services improving load times by 75%.",
          "Built reusable front-end components with TypeScript and TailwindCSS.",
        ],
      },
    ],
    projects: [
      {
        title: "Real-Time Collaboration Tool",
        link: "github.com/johndoe/realtime-collab",
        details: [
          "Created a web-socket-based collaboration app enabling multi-user live editing.",
          "Tech Used: React, Node.js, Socket.io, MongoDB.",
        ],
      },
    ],
  });

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[\d\s\+\-\(\)]+$/;
    return phone.length >= 10 && re.test(phone);
  };

  const validateURL = (url?: string): boolean => {
    if (!url) return true;
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return re.test(url);
  };

  const validateField = (path: string, value: string): boolean => {
    let error: string | null = null;

    if (path === "name" && (!value || value.trim().length < 2)) {
      error = "Name must be at least 2 characters";
    } else if (path === "contact.email" && !validateEmail(value)) {
      error = "Please enter a valid email address";
    } else if (path === "contact.phone" && !validatePhone(value)) {
      error = "Please enter a valid phone number";
    } else if (
      (path === "contact.website" || path === "contact.linkedin" || path === "contact.github") &&
      !validateURL(value)
    ) {
      error = "Please enter a valid URL";
    } else if (path === "contact.location" && (!value || value.trim().length < 2)) {
      error = "Location is required";
    } else if (path === "summary" && (!value || value.trim().length < 50)) {
      error = "Summary should be at least 50 characters";
    }

    setErrors((prev) => ({
      ...prev,
      [path]: error,
    }));

    return !error;
  };

  const validateSectionItem = (
    section: keyof Pick<Resume, "education" | "experience" | "projects">,
    index: number,
    field: string,
    value: string
  ): boolean => {
    const errorKey = `${section}.${index}.${field}`;
    let error: string | null = null;

    if (section === "education") {
      if (field === "school" && (!value || value.trim().length < 2)) error = "School name is required";
      else if (field === "degree" && (!value || value.trim().length < 2)) error = "Degree is required";
      else if (field === "period" && (!value || value.trim().length < 2)) error = "Period is required";
    } else if (section === "experience") {
      if (field === "title" && (!value || value.trim().length < 2)) error = "Job title is required";
      else if (field === "period" && (!value || value.trim().length < 2)) error = "Period is required";
    } else if (section === "projects") {
      if (field === "title" && (!value || value.trim().length < 2)) error = "Project title is required";
      else if (field === "link" && value && !validateURL(value)) error = "Please enter a valid URL";
    }

    setErrors((prev) => ({ ...prev, [errorKey]: error }));

    return !error;
  };

  const validateAll = (): boolean => {
    let isValid = true;
    const newErrors: Errors = {};

    if (!resume.name || resume.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }
    if (!validateEmail(resume.contact.email)) {
      newErrors["contact.email"] = "Please enter a valid email address";
      isValid = false;
    }
    if (!validatePhone(resume.contact.phone)) {
      newErrors["contact.phone"] = "Please enter a valid phone number";
      isValid = false;
    }
    if (!resume.contact.location || resume.contact.location.trim().length < 2) {
      newErrors["contact.location"] = "Location is required";
      isValid = false;
    }
    if (!resume.summary || resume.summary.trim().length < 50) {
      newErrors.summary = "Summary should be at least 50 characters";
      isValid = false;
    }

    resume.education.forEach((edu, idx) => {
      if (!edu.school || edu.school.trim().length < 2) {
        newErrors[`education.${idx}.school`] = "School name is required";
        isValid = false;
      }
      if (!edu.degree || edu.degree.trim().length < 2) {
        newErrors[`education.${idx}.degree`] = "Degree is required";
        isValid = false;
      }
      if (!edu.period || edu.period.trim().length < 2) {
        newErrors[`education.${idx}.period`] = "Period is required";
        isValid = false;
      }
    });

    resume.experience.forEach((exp, idx) => {
      if (!exp.title || exp.title.trim().length < 2) {
        newErrors[`experience.${idx}.title`] = "Job title is required";
        isValid = false;
      }
      if (!exp.period || exp.period.trim().length < 2) {
        newErrors[`experience.${idx}.period`] = "Period is required";
        isValid = false;
      }
    });

    resume.projects.forEach((proj, idx) => {
      if (!proj.title || proj.title.trim().length < 2) {
        newErrors[`projects.${idx}.title`] = "Project title is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (path: string, value: string) => {
    validateField(path, value);
    const keys = path.split(".");
    setResume((prev) => {
      const updated: any = { ...prev };
      let curr: any = updated;
      for (let i = 0; i < keys.length - 1; i++) curr = curr[keys[i]];
      curr[keys[keys.length - 1]] = value;
      return { ...updated };
    });
  };

  const handleListChange = (
    section: keyof Pick<Resume, "education" | "experience" | "projects">,
    index: number,
    field: string,
    value: string | string[]
  ) => {
    if (typeof value === "string") {
      validateSectionItem(section, index, field, value);
    }
    const updatedSection = [...resume[section]];
    (updatedSection[index] as any)[field] = value;
    setResume({ ...resume, [section]: updatedSection });
  };

  const handleDetailChange = (
    section: keyof Pick<Resume, "experience" | "projects">,
    index: number,
    detailIndex: number,
    value: string
  ) => {
    const updatedSection = [...resume[section]];
    updatedSection[index].details[detailIndex] = value;
    setResume({ ...resume, [section]: updatedSection });
  };

  const addItem = (section: keyof Pick<Resume, "education" | "experience" | "projects">) => {
    const defaults: { [key: string]: any } = {
      education: { degree: "", school: "", gpa: "", period: "" },
      experience: { title: "", period: "", details: [""] },
      projects: { title: "", link: "", details: [""] },
    };
    setResume({ ...resume, [section]: [...resume[section], defaults[section]] });
  };

  const removeItem = (section: keyof Pick<Resume, "education" | "experience" | "projects">, index: number) => {
    const updated = [...resume[section]];
    updated.splice(index, 1);
    setResume({ ...resume, [section]: updated });
  };

  const removeDetail = (
    section: keyof Pick<Resume, "experience" | "projects">,
    index: number,
    detailIndex: number
  ) => {
    const updated = [...resume[section]];
    updated[index].details.splice(detailIndex, 1);
    setResume({ ...resume, [section]: updated });
  };

  const downloadPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    let y = 10;

    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text(resume.name, 105, y, { align: "center" });
    y += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    const contactInfo = [
      `Location: ${resume.contact.location}`,
      `Email: ${resume.contact.email}`,
      `Phone: ${resume.contact.phone}`,
      `Website: ${resume.contact.website}`,
      `LinkedIn: ${resume.contact.linkedin}`,
      `GitHub: ${resume.contact.github}`,
    ];
    contactInfo.forEach((line) => {
      pdf.text(line, 10, y);
      y += 5;
    });
    y += 5;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Professional Summary", 10, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    const splitSummary = pdf.splitTextToSize(resume.summary, 190);
    pdf.text(splitSummary, 10, y);
    y += splitSummary.length * 5 + 5;

    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 10, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    resume.education.forEach((edu) => {
      pdf.text(`${edu.degree} - ${edu.school}`, 10, y);
      pdf.text(`${edu.period}`, 160, y, { align: "right" });
      y += 5;
      if (edu.gpa) {
        pdf.text(`GPA: ${edu.gpa}`, 10, y);
        y += 5;
      }
      y += 2;
    });

    pdf.setFont("helvetica", "bold");
    pdf.text("Experience", 10, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    resume.experience.forEach((exp) => {
      pdf.text(`${exp.title}`, 10, y);
      pdf.text(`${exp.period}`, 160, y, { align: "right" });
      y += 5;
      exp.details.forEach((d) => {
        pdf.text(`- ${d}`, 12, y);
        y += 5;
      });
      y += 2;
    });

    pdf.setFont("helvetica", "bold");
    pdf.text("Projects", 10, y);
    y += 6;
    pdf.setFont("helvetica", "normal");
    resume.projects.forEach((proj) => {
      pdf.text(proj.title, 10, y);
      pdf.text(proj.link, 10, y + 5);
      y += 10;
      proj.details.forEach((d) => {
        pdf.text(`- ${d}`, 12, y);
        y += 5;
      });
      y += 2;
    });

    pdf.save("Resume.pdf");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-sm border-b border-gray-200 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-purple-800 bg-clip-text text-transparent">
              Resume Builder
            </h1>
            <p className="text-sm text-gray-600 mt-1">Create your professional resume in minutes</p>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-purple-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 print:hidden">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-8">
              <div className="bg-purple-800 p-6">
                <h2 className="text-xl font-bold text-white">Edit Your Resume</h2>
                <p className="text-blue-100 text-sm mt-1">Fill in your information below</p>
              </div>

              <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">Personal Information</h3>
                  <input
                    type="text"
                    value={resume.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Full Name"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                      }`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.name}</span>
                    </div>
                  )}

                  {Object.entries(resume.contact).map(([key, value]) => (
                    <div key={key}>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleChange(`contact.${key}`, e.target.value)}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400 ${errors[`contact.${key}`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`contact.${key}`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`contact.${key}`]}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  <div>
                    <textarea
                      value={resume.summary}
                      onChange={(e) => handleChange("summary", e.target.value)}
                      placeholder="Professional Summary (minimum 50 characters)"
                      rows={4}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder-gray-400 ${errors.summary ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                        }`}
                    />
                    <div className="flex items-center justify-between mt-1">
                      {errors.summary && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors.summary}</span>
                        </div>
                      )}
                      <span className={`text-xs ml-auto ${resume.summary.length < 50 ? "text-red-600" : "text-gray-500"}`}>
                        {resume.summary.length}/50
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Education</h3>
                    <button
                      onClick={() => addItem("education")}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  {resume.education.map((edu, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl space-y-2 relative group">
                      {resume.education.length > 1 && (
                        <button
                          onClick={() => removeItem("education", idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="text"
                        placeholder="School"
                        value={edu.school}
                        onChange={(e) => handleListChange("education", idx, "school", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`education.${idx}.school`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`education.${idx}.school`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`education.${idx}.school`]}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => handleListChange("education", idx, "degree", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`education.${idx}.degree`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`education.${idx}.degree`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`education.${idx}.degree`]}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="GPA"
                        value={edu.gpa}
                        onChange={(e) => handleListChange("education", idx, "gpa", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Period"
                        value={edu.period}
                        onChange={(e) => handleListChange("education", idx, "period", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`education.${idx}.period`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`education.${idx}.period`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`education.${idx}.period`]}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Experience</h3>
                    <button
                      onClick={() => addItem("experience")}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  {resume.experience.map((exp, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl space-y-2 relative group">
                      {resume.experience.length > 1 && (
                        <button
                          onClick={() => removeItem("experience", idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="text"
                        placeholder="Job Title & Company"
                        value={exp.title}
                        onChange={(e) => handleListChange("experience", idx, "title", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`experience.${idx}.title`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`experience.${idx}.title`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`experience.${idx}.title`]}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Period"
                        value={exp.period}
                        onChange={(e) => handleListChange("experience", idx, "period", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`experience.${idx}.period`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`experience.${idx}.period`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`experience.${idx}.period`]}</span>
                        </div>
                      )}
                      {exp.details.map((d, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Achievement ${i + 1}`}
                            value={d}
                            onChange={(e) => handleDetailChange("experience", idx, i, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                          />
                          {exp.details.length > 1 && (
                            <button
                              onClick={() => removeDetail("experience", idx, i)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => handleListChange("experience", idx, "details", [...exp.details, ""])}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Achievement
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-semibold text-gray-900 text-lg">Projects</h3>
                    <button
                      onClick={() => addItem("projects")}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  {resume.projects.map((proj, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-xl space-y-2 relative group">
                      {resume.projects.length > 1 && (
                        <button
                          onClick={() => removeItem("projects", idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={proj.title}
                        onChange={(e) => handleListChange("projects", idx, "title", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`projects.${idx}.title`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`projects.${idx}.title`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`projects.${idx}.title`]}</span>
                        </div>
                      )}
                      <input
                        type="text"
                        placeholder="Project Link"
                        value={proj.link}
                        onChange={(e) => handleListChange("projects", idx, "link", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 ${errors[`projects.${idx}.link`] ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"
                          }`}
                      />
                      {errors[`projects.${idx}.link`] && (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          <span>{errors[`projects.${idx}.link`]}</span>
                        </div>
                      )}
                      {proj.details.map((d, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            placeholder={`Detail ${i + 1}`}
                            value={d}
                            onChange={(e) => handleDetailChange("projects", idx, i, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                          />
                          {proj.details.length > 1 && (
                            <button
                              onClick={() => removeDetail("projects", idx, i)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => handleListChange("projects", idx, "details", [...proj.details, ""])}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Detail
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 w-full">
            <div className="bg-white rounded-2xl w-full shadow-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-0 print:rounded-none">
              <div
                ref={resumeRef}
                className="w-full  bg-white shadow-lg  rounded-lg p-6 space-y-4"
              >
                <div className="text-center mb-8 pb-6 border-b-2 border-gray-900">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{resume.name}</h1>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{resume.contact.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span>{resume.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-blue-600" />
                      <span>{resume.contact.phone}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-700 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span>{resume.contact.website}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span>{resume.contact.linkedin}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-blue-600" />
                      <span>{resume.contact.github}</span>
                    </div>
                  </div>
                </div>

                <section className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{resume.summary}</p>
                </section>

                <section className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                    Education
                  </h2>
                  {resume.education.map((edu, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-900">{edu.school}</h3>
                          <p className="text-gray-700 italic">{edu.degree}</p>
                        </div>
                        <p className="text-gray-600 text-sm">{edu.period}</p>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{edu.gpa}</p>
                    </div>
                  ))}
                </section>

                <section className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                    Professional Experience
                  </h2>
                  {resume.experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-gray-600 text-sm">{exp.period}</p>
                      </div>
                      <ul className="list-disc list-outside ml-5 space-y-1">
                        {exp.details.map((d, j) => (
                          <li key={j} className="text-gray-700">{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
                    Projects
                  </h2>
                  {resume.projects.map((proj, i) => (
                    <div key={i} className="mb-4">
                      <h3 className="font-bold text-gray-900">{proj.title}</h3>
                      <p className="text-blue-600 text-sm mb-1">{proj.link}</p>
                      <ul className="list-disc list-outside ml-5 space-y-1">
                        {proj.details.map((d, j) => (
                          <li key={j} className="text-gray-700">{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            margin: 0.5in;
            size: letter;
          }
        }
      `}</style>
    </div>
  );
}