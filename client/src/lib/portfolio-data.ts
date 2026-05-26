export const profile = {
  name: "Abhijit Das",
  logo: "AD",
  handle: "abhijit.dev",
  taglines: [
    "Full Stack Developer",
    "AI/ML Enthusiast",
    "Modern UI Engineer",
  ],
  bio: "Passionate CSE student and full stack developer building immersive digital experiences with modern web technologies.",
  fullBio:
    "I am Abhijit Das, a passionate Computer Science student and full stack developer focused on creating modern, responsive, and immersive web applications. I specialize in MERN stack development, React ecosystem technologies, and modern UI/UX engineering. I enjoy building performant digital experiences with clean architecture, smooth animations, and scalable backend systems. Alongside web development, I actively explore AI/ML technologies and continuously improve my problem-solving and software engineering skills through projects, hackathons, and real-world applications.",
  city: "Hooghly, West Bengal, India",
  email: "abhijitskv3@gmail.com",
  github: "https://github.com/abhijit5996",
  linkedin: "https://linkedin.com/in/abhijit-das-35b72224a",
  status: "AVAILABLE",
  focus:
    "Building immersive Apple-style full stack web experiences using Next.js, Three.js, GSAP, and AI integrations.",
  open: "Freelance & Internship opportunities",
  traits: ["Creative Problem Solver", "Fast Learner", "Detail-Oriented Developer"],
  resumeUrl: "https://drive.google.com/uc?export=download&id=REPLACE_WITH_FILE_ID",
  resumeFilename: "Abhijit_Das_Resume.pdf",
};

export const stats = [
  { label: "Projects", value: "10+" },
  { label: "Experience", value: "2+ yrs" },
  { label: "Repos", value: "20+" },
  { label: "Certifications", value: "3+" },
];

export const journey = [
  { year: "2022", title: "Origin", text: "Started B.Tech in CSE and began exploring web development." },
  { year: "2023", title: "Frontend Era", text: "Built multiple frontend projects and learned the MERN stack." },
  { year: "2024", title: "Full Stack", text: "Developed full stack apps and explored AI/ML technologies." },
  { year: "2025", title: "Immersive", text: "Building premium modern portfolios and advanced immersive experiences." },
];

export type Skill = { name: string; level: number; orbit: "inner" | "middle" | "outer"; color: string };
export const skills: Skill[] = [
  { name: "JavaScript", level: 95, orbit: "inner", color: "#fde047" },
  { name: "React.js", level: 92, orbit: "inner", color: "#67e8f9" },
  { name: "Next.js", level: 88, orbit: "inner", color: "#e5e7eb" },
  { name: "Tailwind CSS", level: 90, orbit: "middle", color: "#38bdf8" },
  { name: "Node.js", level: 85, orbit: "middle", color: "#86efac" },
  { name: "Express.js", level: 82, orbit: "middle", color: "#cbd5e1" },
  { name: "MongoDB", level: 78, orbit: "middle", color: "#4ade80" },
  { name: "TypeScript", level: 84, orbit: "outer", color: "#60a5fa" },
  { name: "React Native", level: 70, orbit: "outer", color: "#22d3ee" },
  { name: "GSAP", level: 75, orbit: "outer", color: "#a3e635" },
  { name: "Framer Motion", level: 80, orbit: "outer", color: "#f472b6" },
  { name: "AWS", level: 65, orbit: "outer", color: "#fbbf24" },
];

export const skillCategories = [
  { cat: "Frontend", items: "React.js, Next.js, Tailwind CSS, TypeScript, GSAP, Framer Motion", level: 90 },
  { cat: "Backend", items: "Node.js, Express.js", level: 85 },
  { cat: "Database", items: "MongoDB", level: 75 },
  { cat: "DevOps", items: "AWS, Git, GitHub, Vite", level: 75 },
  { cat: "Languages", items: "JavaScript, TypeScript, HTML, CSS", level: 88 },
];

export type Project = { name: string; stack: string[]; desc: string; url: string; tag: string };
export const projects: Project[] = [
  { name: "Orbit Blueprint", stack: ["Next.js", "Tailwind", "TypeScript"], desc: "Premium enterprise website scaffold with modern UI architecture and scalable frontend structure.", url: "https://orbit-blueprint.vercel.app", tag: "ENTERPRISE" },
  { name: "Stone Legacy", stack: ["React", "Tailwind"], desc: "Modern business website with booking/visit scheduling functionality and responsive UX.", url: "https://stone-legacy.vercel.app", tag: "BUSINESS" },
  { name: "Transit Hub", stack: ["React", "Tailwind", "JavaScript"], desc: "Transportation platform with responsive navbar, mobile menu, and modern navigation system.", url: "https://transit-hub.vercel.app", tag: "PLATFORM" },
  { name: "Birthday Surprise", stack: ["React", "Framer Motion"], desc: "Interactive animated personalized greeting site with immersive visual storytelling.", url: "https://birthday-surprise-to-love.vercel.app", tag: "EXPERIENCE" },
  { name: "Fit Eats", stack: ["MongoDB", "Express", "React", "Node"], desc: "Food recommendation & delivery platform with organized product structure and responsive design.", url: "https://fit-eats.vercel.app", tag: "MERN" },
  { name: "Nutri Order", stack: ["React", "jsPDF"], desc: "Nutrition ordering platform featuring invoice generation and automated PDF creation.", url: "https://nutri-order3.vercel.app", tag: "TOOLING" },
  { name: "Social Sahayak", stack: ["HTML", "CSS", "JS"], desc: "Government/social assistance platform focused on accessibility and public service interaction.", url: "https://social-sahayak.vercel.app", tag: "CIVIC" },
  { name: "Optimal Way", stack: ["React", "Tailwind"], desc: "Travel and route optimization platform with modern UI and interactive experience.", url: "https://optimal-way.vercel.app", tag: "TRAVEL" },
];

export const education = [
  { school: "Adamas University", degree: "B.Tech, Computer Science & Engineering", year: "2022 – 2026", score: "CGPA 7.98/10" },
  { school: "Saharda Kalipada Vidyapith H.S.", degree: "Higher Secondary", year: "2020 – 2022", score: "79.4%" },
];

export const achievements = [
  "10+ shipped full-stack projects in production",
  "Active open-source contributions across React ecosystem",
  "Built immersive cinematic UI systems with GSAP & Framer Motion",
  "Designed scalable MERN backends with clean architecture",
];

export const certifications = [
  "Full Stack Web Development — Self-directed track",
  "AI/ML Fundamentals — Coursework + projects",
  "Modern Frontend Engineering — React / Next.js specialization",
];
