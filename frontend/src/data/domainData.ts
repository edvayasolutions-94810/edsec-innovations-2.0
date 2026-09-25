// Domain and syllabus data for Edsec Innovations platform programs

export interface SyllabusModule {
  title: string;
  topics: string[];
}

export interface DomainData {
  id: string;
  name: string;
  programId: string;
  programTitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: string;
  tagline: string;
  description: string;
  syllabus: SyllabusModule[];
  features: string[];
  brochureProgramId?: string;
}

export const domainData: DomainData[] = [
  // ── PROGRAM 1: FULL STACK WEB DEVELOPMENT ─────────────────────────────────
  {
    id: 'fswd-level-1',
    name: 'Level 1 — Foundation (45 Days)',
    programId: 'full-stack-web-dev',
    programTitle: 'Full Stack Web Development',
    level: 'Beginner',
    duration: '45 Days',
    price: '1999',
    tagline: 'Structure and style responsive websites from scratch',
    description: 'Learn foundational web technologies: HTML to structure the web, CSS to style with creativity, and JavaScript to bring websites to life with interactivity.',
    features: [
      'Web Development Fundamentals',
      'Responsive Web Design',
      'Basic JavaScript Programming',
      'Website Development',
      'Mini Projects'
    ],
    syllabus: [
      {
        title: 'HTML — Structure the Web',
        topics: [
          'HTML5 semantic elements & document structure',
          'Working with text, links, lists and images',
          'Forms, input types and client-side validation',
          'Accessibility (a11y) standards & SEO fundamentals'
        ]
      },
      {
        title: 'CSS — Style with Creativity',
        topics: [
          'CSS3 selectors, box model and typography',
          'Flexbox layouts for modern web pages',
          'CSS Grid for advanced multi-column layouts',
          'Responsive design, media queries & fluid units',
          'CSS transitions, transforms & basic animations'
        ]
      },
      {
        title: 'JavaScript — Bring Websites to Life',
        topics: [
          'Variables, primitive types and operators',
          'Control flow, conditionals and loops',
          'Functions, scope and event handling',
          'DOM selection, manipulation and dynamic styling',
          'Browser APIs: LocalStorage and basic timers'
        ]
      },
      {
        title: 'Website Development & Mini Projects',
        topics: [
          'Building fully responsive multi-section landing pages',
          'Interactive UI widgets (modals, sliders, menus)',
          'Debugging techniques using Chrome DevTools',
          'Code organization and hosting via GitHub Pages'
        ]
      }
    ]
  },
  {
    id: 'fswd-level-2',
    name: 'Level 2 — Intermediate (90 Days)',
    programId: 'full-stack-web-dev',
    programTitle: 'Full Stack Web Development',
    level: 'Intermediate',
    duration: '90 Days',
    price: '3499',
    tagline: 'Build modern, dynamic and scalable web applications',
    description: 'Everything in Level 1 plus React.js for interactive user interfaces, Next.js for modern web applications, and TypeScript for scalable production code.',
    features: [
      'Everything in Level 1',
      'React.js (Interactive UIs)',
      'Next.js (Modern Web Apps)',
      'TypeScript (Scalable Code)',
      'Advanced JavaScript, APIs & Real-World Projects'
    ],
    syllabus: [
      {
        title: 'Advanced JavaScript & Asynchronous Programming',
        topics: [
          'ES6+ modern syntax: destructuring, spread/rest, modules',
          'Asynchronous JavaScript: Promises and async/await',
          'Working with Fetch API and Axios for network requests',
          'Array transformations: map, filter, reduce and closures'
        ]
      },
      {
        title: 'React.js — Modern Frontend Development',
        topics: [
          'Component-driven architecture and JSX',
          'State and Props: useState, useEffect and custom hooks',
          'Context API for global application state',
          'Client-side routing using React Router'
        ]
      },
      {
        title: 'Next.js — Full-Featured Web Apps',
        topics: [
          'Next.js App Router and file-system routing',
          'Server Components vs. Client Components',
          'Server-side Rendering (SSR) & Static Site Generation (SSG)',
          'API routes, server actions and data revalidation'
        ]
      },
      {
        title: 'TypeScript — Scalable Production Code',
        topics: [
          'TypeScript types, interfaces, unions and enums',
          'Typing React components, hooks and events',
          'Generics and type utilities for robust APIs',
          'Configuring tsconfig and catching bugs at compile time'
        ]
      },
      {
        title: 'Application Architecture & Real-World Projects',
        topics: [
          'Clean modular frontend architecture',
          'Form validation with Zod and React Hook Form',
          'Integration with third-party authentication and APIs',
          'Building and deploying dynamic real-world web apps'
        ]
      }
    ]
  },
  {
    id: 'fswd-level-3',
    name: 'Level 3 — Advanced (180 Days)',
    programId: 'full-stack-web-dev',
    programTitle: 'Full Stack Web Development',
    level: 'Advanced',
    duration: '180 Days',
    price: '4999',
    tagline: 'Build and deploy full-stack applications with AI capabilities',
    description: 'Everything in Level 1 & 2 plus Node.js for backend development, Express.js to build robust APIs, MongoDB for modern databases, AI integration, and an industry Capstone project.',
    features: [
      'Everything in Level 1 & 2',
      'Node.js & Express.js Backend Development',
      'MongoDB & Modern Database Modeling',
      'REST APIs, Authentication & Authorization',
      'AI Integration & AI-Powered Applications',
      'Capstone Project & Industry Mentorship'
    ],
    syllabus: [
      {
        title: 'Node.js & Express.js — Backend Development',
        topics: [
          'Node.js runtime environment and asynchronous event loop',
          'Express.js server architecture, middleware and routers',
          'RESTful API design best practices and HTTP status codes',
          'Request validation, error handling middleware and logging'
        ]
      },
      {
        title: 'MongoDB — Modern Databases',
        topics: [
          'NoSQL schema design and document modeling',
          'Mongoose ODM: schemas, models, and validation',
          'CRUD operations and advanced aggregation pipelines',
          'Database indexing, performance optimization and transactions'
        ]
      },
      {
        title: 'Authentication & Security Best Practices',
        topics: [
          'JWT (JSON Web Token) authentication and refresh tokens',
          'Role-based access control (RBAC) and route protection',
          'Password hashing with bcrypt and security headers (Helmet)',
          'CORS configuration, rate limiting and environment secrets'
        ]
      },
      {
        title: 'AI Integration & AI-Powered Applications',
        topics: [
          'Integrating modern AI APIs (OpenAI, Gemini) into web backends',
          'Building AI-assisted features (summarization, smart search, chatbot)',
          'Streaming responses and handling token limits',
          'Creating production AI-powered full stack applications'
        ]
      },
      {
        title: 'Deployment, Production Practices & Capstone',
        topics: [
          'Containerization basics with Docker',
          'Deploying full-stack applications (Vercel, Render, AWS)',
          'CI/CD pipelines with GitHub Actions',
          'Production monitoring, health checks and logging',
          'Major Capstone Project build and industry mentorship review'
        ]
      }
    ]
  },

  // ── PROGRAM 2: GENERATIVE AI ──────────────────────────────────────────────
  {
    id: 'genai-level-1',
    name: 'Level 1 — Basic (45 Days)',
    programId: 'generative-ai',
    programTitle: 'Generative AI',
    level: 'Beginner',
    duration: '45 Days',
    price: '1999',
    tagline: 'Understand the foundations of AI and build your first ML models',
    description: 'Master Python for AI, mathematics for machine learning, data fundamentals, supervised and unsupervised learning, and build your first machine learning models.',
    features: [
      'Python for AI',
      'Mathematics for Machine Learning',
      'Data & ML Fundamentals',
      'Supervised & Unsupervised Learning',
      'Model Training & Evaluation'
    ],
    syllabus: [
      {
        title: 'Python for AI & Data Fundamentals',
        topics: [
          'Python essentials for AI developers',
          'NumPy arrays, vector operations and matrix math',
          'Pandas for dataset loading, inspection and cleaning',
          'Data exploration and visualization with Matplotlib'
        ]
      },
      {
        title: 'Mathematics for Machine Learning',
        topics: [
          'Linear algebra essentials: vectors, matrices, dot products',
          'Calculus fundamentals: derivatives and gradient descent',
          'Probability and statistics: distributions and expectations',
          'Cost functions, loss metrics and optimization techniques'
        ]
      },
      {
        title: 'Introduction to Artificial Intelligence',
        topics: [
          'What is AI? Overview of machine learning paradigms',
          'Supervised vs. Unsupervised vs. Reinforcement learning',
          'Regression algorithms: Linear & Polynomial regression',
          'Classification algorithms: Logistic regression & Decision trees'
        ]
      },
      {
        title: 'Model Training & Evaluation',
        topics: [
          'Dataset splitting: train, validation and test sets',
          'Evaluation metrics: MSE, RMSE, accuracy, precision, recall, F1',
          'Overfitting, underfitting and bias-variance tradeoff',
          'Building and evaluating your first machine learning models'
        ]
      }
    ]
  },
  {
    id: 'genai-level-2',
    name: 'Level 2 — Intermediate (90 Days)',
    programId: 'generative-ai',
    programTitle: 'Generative AI',
    level: 'Intermediate',
    duration: '90 Days',
    price: '3499',
    tagline: 'Understand modern GenAI technologies and build applications using LLMs',
    description: 'Covers everything in Level 1 plus neural network fundamentals, deep learning, NLP fundamentals, Transformers architecture, Large Language Models, prompt engineering, vector search, RAG, and fine-tuning.',
    features: [
      'Everything in Level 1',
      'Neural Network Fundamentals & Deep Learning',
      'Transformers Architecture & NLP',
      'Large Language Models (LLMs)',
      'Prompt Engineering, Embeddings, Vector Search & RAG',
      'Fine-Tuning LLMs'
    ],
    syllabus: [
      {
        title: 'Neural Networks & Deep Learning',
        topics: [
          'Perceptrons and feedforward neural network architecture',
          'Activation functions (ReLU, Sigmoid, Softmax) & backpropagation',
          'Building and training neural networks using PyTorch/TensorFlow',
          'Regularization techniques: Dropout, Weight Decay and batch norm'
        ]
      },
      {
        title: 'NLP Fundamentals & Transformers Architecture',
        topics: [
          'Text preprocessing, tokenization and word representations',
          'The attention mechanism and self-attention formula',
          'Transformer architecture: encoders, decoders, and attention heads',
          'How neural networks and Large Language Models actually work'
        ]
      },
      {
        title: 'Large Language Models & Prompt Engineering',
        topics: [
          'Understanding modern LLMs (GPT, Claude, Gemini, open-source)',
          'Zero-shot, few-shot, and chain-of-thought prompting',
          'Role prompting, system personas and prompt optimization',
          'Mitigating hallucinations and implementing guardrails'
        ]
      },
      {
        title: 'Embeddings, Vector Search & RAG',
        topics: [
          'Dense vector embeddings and semantic similarity metrics',
          'Vector databases: Pinecone, ChromaDB and FAISS',
          'Retrieval-Augmented Generation (RAG) architecture and chunking',
          'Building a document Q&A application with RAG pipelines'
        ]
      },
      {
        title: 'Fine-Tuning LLMs',
        topics: [
          'Prompting vs. RAG vs. Fine-tuning decision framework',
          'Supervised fine-tuning (SFT) workflows and dataset curation',
          'Parameter-Efficient Fine-Tuning (PEFT) and LoRA/QLoRA',
          'Evaluating and deploying fine-tuned models'
        ]
      }
    ]
  },
  {
    id: 'genai-level-3',
    name: 'Level 3 — Advanced (180 Days)',
    programId: 'generative-ai',
    programTitle: 'Generative AI',
    level: 'Advanced',
    duration: '180 Days',
    price: '4999',
    tagline: 'Build and deploy production-style Generative AI systems',
    description: 'Includes everything in Levels 1 & 2 plus AI Agents and agentic workflows, multimodal AI (text, image, audio, video), advanced LLM applications, LLMOps, production AI architecture, and a production Capstone project.',
    features: [
      'Everything in Level 1 & 2',
      'AI Agents & Agentic Workflows',
      'Multimodal AI (Text, Image, Audio, Video)',
      'LLMOps & Model Deployment',
      'Production AI Architecture & Capstone Project'
    ],
    syllabus: [
      {
        title: 'AI Agents & Agentic Workflows',
        topics: [
          'Agent architecture: ReAct, plan-and-solve, and tool calling',
          'Integrating external APIs and tools for autonomous action',
          'Multi-agent systems, collaboration and consensus protocols',
          'State persistence and conversational memory patterns'
        ]
      },
      {
        title: 'Multimodal AI (Text, Image, Audio, Video)',
        topics: [
          'Vision-language models and visual reasoning',
          'Text-to-image and diffusion model foundations',
          'Speech recognition (Whisper) and text-to-speech pipelines',
          'Building unified multimodal AI pipelines'
        ]
      },
      {
        title: 'Advanced LLM Applications & AI APIs',
        topics: [
          'Structured outputs and function calling in production',
          'Automated evaluation frameworks for RAG and agent responses',
          'Context window management and prompt caching',
          'Enterprise security, privacy and data compliance for GenAI'
        ]
      },
      {
        title: 'LLMOps & Production AI Architecture',
        topics: [
          'Model serving, API gateways and load balancing',
          'Latency optimization, semantic caching and rate limiting',
          'Observability, telemetry, tracing and cost monitoring',
          'CI/CD for AI models and automated evaluation suites'
        ]
      },
      {
        title: 'Real-World Projects & Capstone System',
        topics: [
          'Industry-standard GenAI project implementations',
          'Building a full production-style Generative AI system',
          'Production deployment, stress testing and documentation',
          'Capstone evaluation and industry mentorship presentation'
        ]
      }
    ]
  },

  // ── PROGRAM 3: PYTHON WITH AI/ML (FLAGSHIP, 180 DAYS) ────────────────────
  {
    id: 'python-ai-level-1',
    name: 'Level 1 — Basic (45 Days)',
    programId: 'python-ai-ml',
    programTitle: 'Python with AI/ML',
    level: 'Beginner',
    duration: '45 Days',
    price: '1999',
    tagline: 'Build Your Foundation with Python and Data Analysis',
    description: 'Covers Python from zero, core programming, data types, control flow, functions, modules, file handling, OOP concepts, NumPy, Pandas, and Matplotlib data visualization with real projects.',
    features: [
      'Python from Zero to Functions & Modules',
      'OOP Concepts & Advanced Python',
      'NumPy Array Computing',
      'Pandas Data Wrangling',
      'Matplotlib Visualization & Real Projects'
    ],
    syllabus: [
      {
        title: 'Phase 1: Python Fundamentals',
        topics: [
          'Python from zero & development environment setup (VS Code, Jupyter)',
          'Data types, variables, type casting and basic operators',
          'Control flow: if/else logic, while and for loops',
          'Functions, parameter passing, return values and lambda functions',
          'Modules, packages and file handling (reading/writing CSV, JSON)',
          'Hands-on Mini Projects'
        ]
      },
      {
        title: 'Phase 2: Advanced Python + Data',
        topics: [
          'Object-Oriented Programming (OOP): classes, objects, inheritance',
          'Encapsulation, polymorphism and special magic methods',
          'NumPy for high-performance numerical and matrix operations',
          'Pandas DataFrames: indexing, filtering, merging and grouping',
          'Data visualization with Matplotlib and Seaborn',
          'Real-World Data Projects'
        ]
      }
    ]
  },
  {
    id: 'python-ai-level-2',
    name: 'Level 2 — Intermediate (90 Days)',
    programId: 'python-ai-ml',
    programTitle: 'Python with AI/ML',
    level: 'Intermediate',
    duration: '90 Days',
    price: '3499',
    tagline: 'Learn the Core Concepts of Mathematics & Machine Learning',
    description: 'Covers statistics, probability, ML concepts, mathematics for ML, data preprocessing, evaluation metrics, supervised and unsupervised ML, regression, classification, clustering, tuning, and end-to-end ML projects.',
    features: [
      'Math & Statistics for ML',
      'Data Preprocessing & Feature Engineering',
      'Supervised Learning (Regression & Classification)',
      'Unsupervised Learning & Clustering',
      'Model Tuning, Validation & End-to-End ML Projects'
    ],
    syllabus: [
      {
        title: 'Phase 1: Math + ML Fundamentals',
        topics: [
          'Descriptive and inferential statistics for data science',
          'Probability concepts and distributions in machine learning',
          'Linear algebra and calculus principles for ML algorithms',
          'Data preprocessing, handling missing values and outlier detection',
          'Feature scaling, encoding categorical variables and normalization',
          'Model evaluation metrics (Accuracy, Precision, Recall, F1, ROC-AUC)'
        ]
      },
      {
        title: 'Phase 2: Machine Learning in Practice',
        topics: [
          'Supervised learning: Linear Regression, Ridge, and Lasso',
          'Classification: Logistic Regression, Decision Trees & Random Forests',
          'Ensemble methods: Gradient Boosting and XGBoost fundamentals',
          'Unsupervised learning: K-Means clustering and PCA dimensionality reduction',
          'Model tuning: Grid Search, Random Search, and cross-validation',
          'End-to-End Machine Learning Projects'
        ]
      }
    ]
  },
  {
    id: 'python-ai-level-3',
    name: 'Level 3 — Advanced (180 Days)',
    programId: 'python-ai-ml',
    programTitle: 'Python with AI/ML',
    level: 'Advanced',
    duration: '180 Days',
    price: '4999',
    tagline: 'Build Next-Gen AI Skills with Deep Learning and Generative AI',
    description: 'Covers neural networks, PyTorch/TensorFlow, CNNs, RNNs, model optimization, Generative AI, LLMs, embeddings, RAG, and an end-to-end Capstone project.',
    features: [
      'Neural Networks & Deep Learning Frameworks',
      'Computer Vision (CNNs) & Sequence Models (RNNs)',
      'Model Optimization & Training Pipelines',
      'Generative AI, LLMs, Embeddings & RAG',
      'Capstone Project: Complete End-to-End AI Solution'
    ],
    syllabus: [
      {
        title: 'Phase 1: Deep Learning',
        topics: [
          'Neural network fundamentals and multi-layer perceptrons',
          'Deep learning with PyTorch and TensorFlow frameworks',
          'Convolutional Neural Networks (CNNs) for image recognition',
          'Recurrent Neural Networks (RNNs & LSTMs) for sequential data',
          'Transfer learning and model optimization strategies',
          'Hands-on deep learning projects'
        ]
      },
      {
        title: 'Phase 2: Generative AI & Capstone Project',
        topics: [
          'Introduction to Large Language Models (LLMs) and transformers',
          'Embeddings, vector representations and semantic search',
          'Retrieval-Augmented Generation (RAG) systems',
          'Building real-world AI applications with APIs',
          'End-to-End Capstone Project development and deployment',
          'Mentorship review, portfolio presentation & job readiness'
        ]
      }
    ]
  },

  // ── PROGRAM 4: GIT & RESUME (VALUE-ADDED, 60 DAYS) ────────────────────────
  {
    id: 'git-resume-program',
    name: '60-Day Git & Career Track',
    programId: 'git-resume',
    programTitle: 'Git & Resume',
    level: 'Intermediate',
    duration: '60 Days',
    price: '1499',
    tagline: 'Version Control Your Skills. Build Your Career.',
    description: 'Master Git from everyday commands to advanced rebasing and pull request collaboration, then craft a standout resume, optimize your LinkedIn and GitHub, and prep for interviews.',
    features: [
      'Week 1: Git Fundamentals & Daily Commands',
      'Week 2: GitHub & Remote Repositories',
      'Week 3: Branching, Merging & Conflict Resolution',
      'Week 4: Pull Requests & Team Collaboration Workflow',
      'Week 5: Advanced Git (Stash, Rebase, Cherry-Pick, .gitignore)',
      'Week 6: Resume Writing, LinkedIn & GitHub Profile',
      'Week 7: Project Portfolio & README Presentation',
      'Week 8: Resume Polishing & Technical Interview Preparation'
    ],
    syllabus: [
      {
        title: 'Week 1 — Git Fundamentals + Basic Commands',
        topics: [
          'What Git is and why version control is essential for engineers',
          'Installing and configuring Git on Windows, Mac, and Linux',
          'Core commands: git init, git add, git commit, git status, git log',
          'Understanding the 3 states: working directory, staging area, repository',
          'Outcome: Confident with day-to-day Git commands'
        ]
      },
      {
        title: 'Week 2 — GitHub + Remote Repositories',
        topics: [
          'What GitHub is and how it enables remote software development',
          'Creating repositories, setting up SSH keys and personal access tokens',
          'Pushing code to GitHub: git remote add, git push -u, git fetch, git pull',
          'Cloning repositories and inspecting remote tracking branches',
          'Outcome: Your code online and organized on GitHub'
        ]
      },
      {
        title: 'Week 3 — Branching, Merging & Conflicts',
        topics: [
          'Branches and their use cases in real development teams',
          'Creating, switching, and deleting branches: git branch, git switch, git checkout',
          'Fast-forward merges vs. 3-way merges (git merge)',
          'Understanding and resolving merge conflicts step-by-step',
          'Outcome: Handle real-world development scenarios with confidence'
        ]
      },
      {
        title: 'Week 4 — Pull Requests + Collaboration Workflow',
        topics: [
          'Working with Pull Requests (PRs) on GitHub',
          'Code review basics, inline comments, and approvals',
          'Collaborating in teams: the fork, clone, PR, and merge lifecycle',
          'Using GitHub Issues and Project boards for task tracking',
          'Outcome: Collaborate like a professional software developer'
        ]
      },
      {
        title: 'Week 5 — Advanced Git + Professional Workflow',
        topics: [
          'Stashing uncommitted work: git stash save, pop, list, and drop',
          'Cherry-picking specific commits across branches (git cherry-pick)',
          'Rebasing vs. merging: interactive rebase (git rebase -i) explained',
          'Undoing mistakes: git reset (soft, mixed, hard), git revert, and git tag',
          'Managing .gitignore rules and best practices for production repos',
          'Outcome: Use Git confidently in professional enterprise projects'
        ]
      },
      {
        title: 'Week 6 — Resume + LinkedIn + GitHub Profile',
        topics: [
          'Writing a clean, professional, ATS-friendly technical resume',
          'Framing technical projects with impact metrics and action verbs',
          'Optimizing your LinkedIn headline, summary, skills and experience',
          'Creating a compelling GitHub profile README and showcasing top repositories',
          'Outcome: A strong professional online presence that attracts opportunities'
        ]
      },
      {
        title: 'Week 7 — Portfolio + Project Presentation',
        topics: [
          'Building and structuring a project portfolio website',
          'Writing exceptional README files that document architecture and setup',
          'Creating live demos, recording GIFs and taking clean UI screenshots',
          'Presenting projects clearly in technical interviews and evaluations',
          'Outcome: An impressive portfolio to showcase your skills'
        ]
      },
      {
        title: 'Week 8 — Resume Polishing + Interview/Job Prep',
        topics: [
          'One-on-one resume review, actionable feedback, and final polish',
          'Common technical interview questions on Git, projects, and architecture',
          'How to articulate engineering challenges and tradeoffs you resolved',
          'Job application strategies, tech networking, and outreach best practices',
          'Outcome: Job-ready with confidence and interview preparedness'
        ]
      }
    ]
  }
];
