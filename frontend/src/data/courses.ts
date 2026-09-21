import fullStack from '@/assets/courses/full-stack.jpg';
import generativeAi from '@/assets/courses/generative-ai.svg';
import pythonAiMl from '@/assets/courses/python-ai-ml.svg';
import gitResume from '@/assets/courses/git-resume.svg';

export interface Course {
  id: string;
  title: string;
  duration: string;
  price: string;
  type: string;
  description: string;
  features: string[];
  category: 'main' | 'value-added';
  detailedDescription?: string;
  image: string;
  brochureProgramId: string;
  domains: string[];
  overview?: string;
  skillsCovered?: string[];
  outcome?: string;
}

export const courses: Course[] = [
  {
    id: 'full-stack-web-dev',
    title: 'Full Stack Web Development',
    duration: '180 Days',
    price: '35000',
    type: 'Certified Program',
    category: 'main',
    description: 'Comprehensive full stack web development program taking you from foundational frontend technologies to advanced full-stack systems with modern frameworks, robust APIs, and AI-powered capabilities.',
    detailedDescription: 'Master web development from scratch across 3 progressive levels: HTML, CSS, JavaScript in Level 1 (45 days); React.js, Next.js, and TypeScript in Level 2 (90 days); and Node.js, Express.js, MongoDB, and AI Integration in Level 3 (180 days).',
    features: [
      'Level 1 (45 Days): HTML, CSS, JavaScript & Mini Projects',
      'Level 2 (90 Days): React.js, Next.js, TypeScript & Modern Frontend',
      'Level 3 (180 Days): Node.js, Express.js, MongoDB & AI Integration',
      'Capstone Project & Industry-Oriented Mentorship',
      'MSME Recognized Certification'
    ],
    domains: [
      'Level 1 — Foundation (45 Days)',
      'Level 2 — Intermediate (90 Days)',
      'Level 3 — Advanced (180 Days)'
    ],
    image: fullStack,
    brochureProgramId: 'full-stack-web-dev',
    overview: 'Progress from web fundamentals to enterprise-grade AI-powered full stack development.',
    skillsCovered: [
      'HTML5 & Responsive CSS3',
      'Modern JavaScript (ES6+)',
      'React.js & Next.js Frameworks',
      'TypeScript for Scalable Code',
      'Node.js & Express.js APIs',
      'MongoDB & Database Modeling',
      'AI-Powered Applications & Integration',
      'Deployment & Production Practices'
    ],
    outcome: 'Build and deploy complete full-stack applications with AI-powered capabilities.'
  },
  {
    id: 'generative-ai',
    title: 'Generative AI',
    duration: '180 Days',
    price: '20000',
    type: 'Certified Program',
    category: 'main',
    description: 'Master modern Generative AI technologies from Python, mathematics, and machine learning fundamentals to deep learning, LLMs, prompt engineering, RAG, and production AI agents.',
    detailedDescription: 'A 3-level journey into modern artificial intelligence: Level 1 (45 days) covers Python, Math & ML fundamentals; Level 2 (90 days) advances into Deep Learning, Transformers, LLMs, Prompt Engineering, and RAG; Level 3 (180 days) culminates in Autonomous AI Agents, Multimodal AI, LLMOps, and a production Capstone system.',
    features: [
      'Level 1 (45 Days): Python, Mathematics & Machine Learning Fundamentals',
      'Level 2 (90 Days): Deep Learning, NLP, Transformers, LLMs, Prompt Engineering & RAG',
      'Level 3 (180 Days): AI Agents, Multimodal AI, LLMOps, Deployment & Capstone',
      'Capstone Project: Build a Production-Style GenAI System',
      'MSME Recognized Certification'
    ],
    domains: [
      'Level 1 — Basic (45 Days)',
      'Level 2 — Intermediate (90 Days)',
      'Level 3 — Advanced (180 Days)'
    ],
    image: generativeAi,
    brochureProgramId: 'generative-ai',
    overview: 'Understand modern GenAI technologies and engineer production-grade Generative AI systems.',
    skillsCovered: [
      'Python for AI & Mathematics for ML',
      'Supervised & Unsupervised ML Algorithms',
      'Neural Networks & Deep Learning',
      'Transformers & Large Language Models (LLMs)',
      'Prompt Engineering & Embeddings',
      'Vector Search & Retrieval-Augmented Generation (RAG)',
      'AI Agents & Agentic Workflows',
      'Multimodal AI & LLMOps Deployment'
    ],
    outcome: 'Build and deploy production-style Generative AI systems.'
  },
  {
    id: 'python-ai-ml',
    title: 'Python with AI/ML',
    duration: '6 Months',
    price: '35000',
    type: 'Certified Program',
    category: 'main',
    description: 'Our flagship 6-month comprehensive program spanning Python programming from zero, data analysis, core machine learning, deep learning, and generative AI applications.',
    detailedDescription: 'Designed across 3 distinct 2-month phases: Months 1–2 build your programming and data foundation with Python, OOP, NumPy, Pandas, and Matplotlib; Months 3–4 cover mathematics for ML, supervised/unsupervised machine learning, and model tuning; Months 5–6 deliver next-gen AI skills with PyTorch/TensorFlow deep learning, LLMs, RAG, and an end-to-end Capstone project.',
    features: [
      'Level 1 (Months 1–2): Python Fundamentals, OOP, NumPy, Pandas & Matplotlib',
      'Level 2 (Months 3–4): Math + ML Fundamentals, Supervised/Unsupervised ML & Tuning',
      'Level 3 (Months 5–6): Deep Learning (PyTorch/TensorFlow), LLMs, RAG & GenAI',
      '5 Industry Project Tracks including Capstone Project',
      'MSME Recognized Certification & Career Mentorship'
    ],
    domains: [
      'Level 1 — Basic (Months 1–2)',
      'Level 2 — Intermediate (Months 3–4)',
      'Level 3 — Advanced (Months 5–6)'
    ],
    image: pythonAiMl,
    brochureProgramId: 'python-ai-ml',
    overview: 'From basic coding to deploying real-world deep learning and GenAI applications.',
    skillsCovered: [
      'Python Programming from Zero',
      'Object-Oriented Programming (OOP)',
      'NumPy, Pandas & Matplotlib',
      'Statistics & Mathematics for ML',
      'Supervised & Unsupervised Machine Learning',
      'Neural Networks, CNNs & RNNs (PyTorch/TensorFlow)',
      'LLMs, Embeddings & RAG Solutions',
      'End-to-End Capstone Project'
    ],
    outcome: 'Create real-world AI applications and build an industry-ready portfolio.'
  },
  {
    id: 'git-resume',
    title: 'Git & Resume',
    duration: '8 Weeks',
    price: '8000',
    type: 'Value-Added Program',
    category: 'value-added',
    description: 'Version Control Your Skills. Build Your Career. Master Git, GitHub collaboration, professional resume building, LinkedIn optimization, and technical interview preparation.',
    detailedDescription: 'An intensive 8-week career acceleration program: Weeks 1–5 cover Git fundamentals, GitHub workflows, branching, pull requests, and advanced workflows (rebasing, stashing, cherry-picking); Weeks 6–8 transform your career presence with resume writing, LinkedIn optimization, portfolio showcases, and mock technical interview preparation.',
    features: [
      'Weeks 1–2: Git Fundamentals, Essential Commands & GitHub Repositories',
      'Weeks 3–4: Branching, Merge Conflict Resolution & PR Collaboration',
      'Week 5: Advanced Git (Stashing, Rebasing, Cherry-Picking, .gitignore)',
      'Weeks 6–7: Resume Writing, LinkedIn Optimization & GitHub Portfolio',
      'Week 8: Resume Polishing, Interview Preparation & Job Strategies'
    ],
    domains: [
      '8-Week Git & Career Track'
    ],
    image: gitResume,
    brochureProgramId: 'git-resume',
    overview: 'Version control your code like a professional and build an impressive career portfolio.',
    skillsCovered: [
      'Git CLI (init, add, commit, status, log)',
      'GitHub Remote Repositories & Collaboration',
      'Branching, Merging & Conflict Resolution',
      'Pull Requests & Code Review Workflows',
      'Advanced Git (Stash, Rebase, Cherry-Pick, Reset)',
      'Professional Resume Crafting & Polishing',
      'LinkedIn Profile Optimization & Project Presentation',
      'Technical Interview Preparation & Job Strategy'
    ],
    outcome: 'Job-ready with confidence, possessing a polished resume, active GitHub portfolio, and professional Git mastery.'
  }
];

