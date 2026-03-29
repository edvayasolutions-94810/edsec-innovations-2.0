// Complete domain data with syllabi for the EDSEC Innovations platform

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
}

export const domainData: DomainData[] = [
  // ── SKILL ENHANCEMENT PROGRAM (1 Month, ₹1999) ──────────────────────────
  {
    id: 'sql-language',
    name: 'SQL Language',
    programId: '1-month-skill',
    programTitle: 'Foundation Tech Program',
    level: 'Beginner',
    duration: '1 Month',
    price: '1999',
    tagline: 'Master database querying from scratch',
    description: 'Learn SQL from the ground up — write powerful queries, manage databases, and extract insights from real-world datasets used in business and analytics.',
    features: ['Structured technical training', 'Hands-on SQL exercises', 'One functional project', 'Mentor support', 'Completion Certificate'],
    syllabus: [
      {
        title: 'Introduction to Databases',
        topics: ['What is a database?', 'Relational vs Non-relational', 'RDBMS overview', 'Installing MySQL / PostgreSQL'],
      },
      {
        title: 'Core SQL Queries',
        topics: ['SELECT, WHERE, ORDER BY', 'DISTINCT, LIMIT, OFFSET', 'Aggregate functions: COUNT, SUM, AVG, MAX, MIN', 'GROUP BY and HAVING'],
      },
      {
        title: 'Table Operations',
        topics: ['CREATE, ALTER, DROP tables', 'INSERT, UPDATE, DELETE', 'Primary keys and Foreign keys', 'Constraints: NOT NULL, UNIQUE, CHECK'],
      },
      {
        title: 'Joins & Subqueries',
        topics: ['INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN', 'Self-joins', 'Subqueries and nested queries', 'EXISTS, IN, ANY, ALL'],
      },
      {
        title: 'Advanced SQL',
        topics: ['Views and stored procedures', 'Indexes and query optimization', 'Transactions and ACID properties', 'Window functions: ROW_NUMBER, RANK, LEAD, LAG'],
      },
      {
        title: 'Hands-on Project',
        topics: ['Design a real-world database schema', 'Build queries for business analytics', 'Generate reports using SQL', 'Project review and evaluation'],
      },
    ],
  },
  {
    id: 'core-python',
    name: 'Core Python',
    programId: '1-month-skill',
    programTitle: 'Foundation Tech Program',
    level: 'Beginner',
    duration: '1 Month',
    price: '1999',
    tagline: 'Python fundamentals for real-world programming',
    description: 'Start coding confidently in Python. Learn variables to object-oriented programming, build working scripts, and complete a real project.',
    features: ['Structured technical training', 'Hands-on Python coding', 'One functional project', 'Mentor support', 'Completion Certificate'],
    syllabus: [
      {
        title: 'Python Basics',
        topics: ['Variables, data types, type casting', 'Input/output, comments', 'Operators (arithmetic, logical, comparison)', 'String formatting and manipulation'],
      },
      {
        title: 'Control Flow',
        topics: ['if/elif/else statements', 'for and while loops', 'break, continue, pass', 'Nested loops and conditions'],
      },
      {
        title: 'Data Structures',
        topics: ['Lists, tuples, sets, dictionaries', 'List comprehensions', 'Dictionary methods and iteration', 'Stacks and queues using Python'],
      },
      {
        title: 'Functions & Modules',
        topics: ['Defining and calling functions', 'Args, kwargs, default parameters', 'Lambda functions', 'Importing standard and third-party modules'],
      },
      {
        title: 'Object-Oriented Programming',
        topics: ['Classes and objects', 'Inheritance and polymorphism', 'Encapsulation and abstraction', 'Magic methods (__init__, __str__)'],
      },
      {
        title: 'File Handling & Project',
        topics: ['Reading and writing files', 'Working with CSV and JSON', 'Exception handling', 'Build a functional Python application'],
      },
    ],
  },
  {
    id: 'augmented-reality',
    name: 'Augmented Reality',
    programId: '1-month-skill',
    programTitle: 'Foundation Tech Program',
    level: 'Intermediate',
    duration: '1 Month',
    price: '1999',
    tagline: 'Build immersive AR experiences',
    description: 'Explore the frontier of Augmented Reality — learn AR fundamentals, use modern frameworks, and deliver an interactive AR experience project.',
    features: ['Structured technical training', 'Hands-on AR development', 'One functional AR project', 'Mentor support', 'Completion Certificate'],
    syllabus: [
      {
        title: 'Introduction to AR',
        topics: ['What is AR? AR vs VR vs MR', 'AR use cases in industry', 'Overview of AR ecosystem', 'Tools: Unity, ARKit, ARCore, Spark AR'],
      },
      {
        title: 'Markers & Tracking',
        topics: ['Image-based marker tracking', 'Markerless AR tracking', 'GPS and location-based AR', 'Plane detection and surface tracking'],
      },
      {
        title: '3D Assets in AR',
        topics: ['Importing 3D models (.obj, .glb)', 'Animating 3D objects', 'Lighting and shaders in AR', 'Optimizing assets for performance'],
      },
      {
        title: 'AR Interactions',
        topics: ['Touch and gesture recognition', 'Raycasting and hit-testing', 'UI overlays in AR', 'Object placement and manipulation'],
      },
      {
        title: 'Hands-on Project',
        topics: ['Design AR experience from brief', 'Build and test AR scene', 'Deploy to mobile device', 'Presentation and evaluation'],
      },
    ],
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    programId: '1-month-skill',
    programTitle: 'Foundation Tech Program',
    level: 'Beginner',
    duration: '1 Month',
    price: '1999',
    tagline: 'Grow brands online with proven strategies',
    description: 'Master digital marketing from SEO to social media ads. Learn tools used by professionals and build a real campaign for a product or brand.',
    features: ['Structured technical training', 'Hands-on campaign building', 'One live project', 'Mentor support', 'Completion Certificate'],
    syllabus: [
      {
        title: 'Digital Marketing Foundations',
        topics: ['What is digital marketing?', 'Traditional vs Digital marketing', 'Digital marketing funnel (AIDA)', 'Building a brand online'],
      },
      {
        title: 'SEO (Search Engine Optimization)',
        topics: ['On-page vs Off-page SEO', 'Keyword research tools', 'Meta tags, headings, and structure', 'Link building strategies'],
      },
      {
        title: 'Social Media Marketing',
        topics: ['Platform strategy (Instagram, LinkedIn, YouTube)', 'Content calendar creation', 'Organic vs Paid growth', 'Engagement and analytics'],
      },
      {
        title: 'Google Ads & Analytics',
        topics: ['Search and display campaigns', 'CPC, CPM, CTR explained', 'Google Analytics setup and goals', 'Conversion tracking'],
      },
      {
        title: 'Email & Content Marketing',
        topics: ['Email campaign design', 'Newsletter strategy', 'Blog writing for SEO', 'Content repurposing'],
      },
      {
        title: 'Live Campaign Project',
        topics: ['Define target audience', 'Build a multi-channel campaign', 'Track and report results', 'Review and optimization'],
      },
    ],
  },

  // ── INDUSTRY INTERNSHIP PROGRAM (3 Months, ₹3499) ───────────────────────
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    programId: '3-month-industry',
    programTitle: 'Applied Technology Program',
    level: 'Intermediate',
    duration: '3 Months',
    price: '3499',
    tagline: 'Turn raw data into actionable business insights',
    description: 'Develop industry-ready analytics skills — use Excel, Python, and Power BI to clean data, build dashboards, and deliver insights that drive decisions.',
    features: ['Industry-level training', 'One major analytics project', 'Mentor guidance', 'MSME Internship Certificate'],
    syllabus: [
      {
        title: 'Data Foundations',
        topics: ['Data types and structures', 'Data collection and sources', 'Introduction to Excel for analysis', 'Pivot tables and VLOOKUP'],
      },
      {
        title: 'Python for Data Analysis',
        topics: ['NumPy arrays and operations', 'Pandas DataFrames', 'Data cleaning: handling nulls, duplicates', 'Merging, grouping, reshaping data'],
      },
      {
        title: 'Data Visualization',
        topics: ['Matplotlib and Seaborn', 'Power BI desktop setup', 'Building interactive dashboards', 'Chart selection best practices'],
      },
      {
        title: 'Statistical Analysis',
        topics: ['Descriptive statistics', 'Correlation and regression', 'Hypothesis testing basics', 'A/B testing concepts'],
      },
      {
        title: 'SQL for Analytics',
        topics: ['Complex queries for business reports', 'Aggregations and window functions', 'Connecting SQL to Python', 'Database-driven dashboards'],
      },
      {
        title: 'Capstone Project',
        topics: ['Real dataset analysis', 'Full pipeline: ingestion to insight', 'Dashboard creation and storytelling', 'Presentation and evaluation'],
      },
    ],
  },
  {
    id: 'web-development',
    name: 'Web Development',
    programId: '3-month-industry',
    programTitle: 'Applied Technology Program',
    level: 'Intermediate',
    duration: '3 Months',
    price: '3499',
    tagline: 'Build and deploy full-stack web applications',
    description: 'Learn HTML to React, backend with Node.js, and deploy production-ready web apps. Build a complete portfolio project during the internship.',
    features: ['Industry-level training', 'One major full-stack project', 'Mentor guidance', 'MSME Internship Certificate'],
    syllabus: [
      {
        title: 'Frontend Fundamentals',
        topics: ['HTML5 semantic elements', 'CSS3: Flexbox, Grid, Animations', 'Responsive design and media queries', 'JavaScript ES6+ essentials'],
      },
      {
        title: 'React.js',
        topics: ['Components, props, state', 'Hooks: useState, useEffect, useContext', 'React Router for SPA navigation', 'API integration with fetch/axios'],
      },
      {
        title: 'Backend with Node.js',
        topics: ['Node.js fundamentals and npm', 'Express.js REST API building', 'Middleware, routing, error handling', 'Authentication with JWT'],
      },
      {
        title: 'Database Integration',
        topics: ['MongoDB and Mongoose', 'CRUD operations in MongoDB', 'Relational DB with PostgreSQL', 'ORM basics with Prisma'],
      },
      {
        title: 'DevOps & Deployment',
        topics: ['Git and GitHub workflow', 'Deployment on Vercel / Render', 'Environment variables and security', 'CI/CD basics'],
      },
      {
        title: 'Capstone Project',
        topics: ['Full-stack app design', 'Frontend + Backend integration', 'Deployment and testing', 'Code review and evaluation'],
      },
    ],
  },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    programId: '3-month-industry',
    programTitle: 'Applied Technology Program',
    level: 'Intermediate',
    duration: '3 Months',
    price: '3499',
    tagline: 'Build AI products with LLMs and prompt engineering',
    description: 'Learn how to work with large language models, craft effective prompts, use AI APIs, and build real AI-powered products and tools.',
    features: ['Industry-level training', 'One major AI project', 'Mentor guidance', 'MSME Internship Certificate'],
    syllabus: [
      {
        title: 'AI & LLM Fundamentals',
        topics: ['What are LLMs?', 'GPT, Gemini, Claude overview', 'Tokenization and embeddings', 'AI use cases in industry'],
      },
      {
        title: 'Prompt Engineering',
        topics: ['Zero-shot vs few-shot prompting', 'Chain-of-thought prompting', 'Role prompting and personas', 'Prompt optimization techniques'],
      },
      {
        title: 'AI APIs & Integration',
        topics: ['OpenAI API setup and usage', 'Gemini API integration', 'Building chatbots with API calls', 'Handling API responses and errors'],
      },
      {
        title: 'RAG & Vector Databases',
        topics: ['What is RAG (Retrieval-Augmented Generation)?', 'Embeddings and similarity search', 'ChromaDB and Pinecone basics', 'Building a document Q&A system'],
      },
      {
        title: 'AI Product Development',
        topics: ['Building AI-powered web apps', 'LangChain for AI pipelines', 'Fine-tuning concepts', 'Ethical AI and responsible use'],
      },
      {
        title: 'Capstone Project',
        topics: ['Define an AI product idea', 'Build end-to-end with LLM backend', 'Deploy and demo the product', 'Evaluation and presentation'],
      },
    ],
  },

  // ── ADVANCED INDUSTRY INTERNSHIP (5 Months, ₹4999) ──────────────────────
  {
    id: 'data-science',
    name: 'Data Science',
    programId: '5-month-advanced',
    programTitle: 'Advanced AI & Software Engineering',
    level: 'Advanced',
    duration: '5 Months',
    price: '4999',
    tagline: 'End-to-end data science for real industry roles',
    description: 'Master the complete data science pipeline — from data wrangling and EDA to machine learning models and production deployment. Graduate with a pre-vetted offer letter.',
    features: ['Two industry projects', 'Resume building support', 'LinkedIn optimization', 'Internship Offer Letter', 'MSME Certificate'],
    syllabus: [
      {
        title: 'Python & Data Engineering',
        topics: ['Advanced Python for DS', 'Pandas and NumPy mastery', 'Data pipelines and automation', 'API data collection'],
      },
      {
        title: 'Exploratory Data Analysis',
        topics: ['EDA techniques and strategies', 'Statistical analysis and inference', 'Feature engineering', 'Outlier detection and handling'],
      },
      {
        title: 'Machine Learning',
        topics: ['Supervised learning: regression, classification', 'Unsupervised learning: clustering, PCA', 'Model evaluation: accuracy, F1, ROC', 'Cross-validation and hyperparameter tuning'],
      },
      {
        title: 'Advanced ML',
        topics: ['Ensemble methods: XGBoost, Random Forest', 'Time series forecasting', 'Natural Language Processing basics', 'Recommendation systems'],
      },
      {
        title: 'MLOps & Deployment',
        topics: ['Model saving and versioning', 'Flask/FastAPI for model serving', 'Docker basics for ML', 'Deploying on cloud (AWS/GCP basics)'],
      },
      {
        title: 'Industry Projects',
        topics: ['Project 1: End-to-end ML pipeline', 'Project 2: Full DataScience analysis report', 'Portfolio and GitHub setup', 'Mock interviews and evaluation'],
      },
    ],
  },
  {
    id: 'python-full-stack',
    name: 'Python Full Stack Development',
    programId: '5-month-advanced',
    programTitle: 'Advanced AI & Software Engineering',
    level: 'Advanced',
    duration: '5 Months',
    price: '4999',
    tagline: 'Build and ship complete Python web applications',
    description: 'Become a full-stack Python developer — master Django/FastAPI for backend, React for frontend, and deploy production-grade applications with CI/CD.',
    features: ['Two industry projects', 'Resume building support', 'LinkedIn optimization', 'Internship Offer Letter', 'MSME Certificate'],
    syllabus: [
      {
        title: 'Python Advanced',
        topics: ['Decorators, generators, context managers', 'Async programming with asyncio', 'Testing with pytest', 'Type hints and mypy'],
      },
      {
        title: 'Django / FastAPI Backend',
        topics: ['Django ORM and models', 'REST APIs with Django REST Framework', 'FastAPI with Pydantic', 'Authentication, permissions, JWT'],
      },
      {
        title: 'Frontend with React',
        topics: ['React components and hooks', 'State management (Redux/Zustand)', 'API integration and error handling', 'UI with Tailwind CSS'],
      },
      {
        title: 'Databases',
        topics: ['PostgreSQL with Django ORM', 'MongoDB with Motor (async)', 'Redis for caching', 'Database migrations and performance'],
      },
      {
        title: 'DevOps & CI/CD',
        topics: ['Docker and Docker Compose', 'GitHub Actions CI/CD pipelines', 'Deployment on AWS EC2 / Railway', 'Monitoring and logging'],
      },
      {
        title: 'Industry Projects',
        topics: ['Project 1: Full-stack SaaS app', 'Project 2: API-first backend service', 'Portfolio and GitHub profile', 'Mock interviews and evaluation'],
      },
    ],
  },
  {
    id: 'ai-ml',
    name: 'Artificial Intelligence & Machine Learning',
    programId: '5-month-advanced',
    programTitle: 'Advanced AI & Software Engineering',
    level: 'Advanced',
    duration: '5 Months',
    price: '4999',
    tagline: 'Build AI systems from research to production',
    description: 'Deep dive into AI & ML — from neural networks and deep learning to computer vision and NLP. Build two industry-grade AI projects with a complete portfolio.',
    features: ['Two industry projects', 'Resume building support', 'LinkedIn optimization', 'Internship Offer Letter', 'MSME Certificate'],
    syllabus: [
      {
        title: 'ML Foundations',
        topics: ['Supervised, unsupervised, reinforcement learning', 'scikit-learn pipeline', 'Feature engineering and selection', 'Model evaluation and metrics'],
      },
      {
        title: 'Deep Learning',
        topics: ['Neural network architecture', 'TensorFlow and Keras basics', 'CNNs for image classification', 'RNNs and LSTMs for sequences'],
      },
      {
        title: 'Computer Vision',
        topics: ['Image preprocessing and augmentation', 'Object detection with YOLO', 'Face recognition systems', 'OpenCV for real-time video'],
      },
      {
        title: 'Natural Language Processing',
        topics: ['Text preprocessing and embeddings', 'Sentiment analysis', 'Named entity recognition', 'Transformers and BERT'],
      },
      {
        title: 'Generative AI & LLMs',
        topics: ['GANs and diffusion models', 'LLM fine-tuning', 'LangChain and RAG systems', 'AI ethics and bias'],
      },
      {
        title: 'Industry Projects',
        topics: ['Project 1: Computer vision system', 'Project 2: NLP product or chatbot', 'Portfolio and GitHub profile', 'Mock interviews and evaluation'],
      },
    ],
  },
];
