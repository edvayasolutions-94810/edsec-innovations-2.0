// Detailed syllabus structure for each course topic
// Maps course features to their sub-topics

export interface SyllabusTopic {
  name: string;
  subtopics: string[];
}

export interface CourseSyllabus {
  [feature: string]: string[];
}

export const courseSyllabusDetails: Record<string, CourseSyllabus> = {
  'data-science': {
    'Machine Learning': [
      'Supervised Learning',
      'Unsupervised Learning',
      'Neural Networks',
      'Scikit-Learn',
      'TensorFlow Basics',
      'Model Evaluation'
    ],
    'Data Visualization': [
      'Matplotlib',
      'Seaborn',
      'Plotly',
      'Dashboard Design',
      'Chart Types',
      'Data Storytelling'
    ],
    'Statistics': [
      'Descriptive Stats',
      'Probability Theory',
      'Hypothesis Testing',
      'Regression Analysis',
      'Statistical Inference',
      'A/B Testing'
    ],
    'Real-World Data Project': [
      'Data Collection',
      'Data Cleaning',
      'Feature Engineering',
      'Model Training',
      'Model Deployment',
      'Project Presentation'
    ]
  },
  'data-analytics': {
    'Excel Advanced': [
      'Pivot Tables',
      'VLOOKUP/XLOOKUP',
      'Power Query',
      'Macros & VBA',
      'Data Modeling',
      'Advanced Formulas'
    ],
    'Power BI': [
      'Data Import',
      'DAX Formulas',
      'Visualizations',
      'Report Design',
      'Dashboard Publishing',
      'Power BI Service'
    ],
    'SQL': [
      'SELECT Queries',
      'Joins & Subqueries',
      'Aggregations',
      'Window Functions',
      'Stored Procedures',
      'Query Optimization'
    ],
    'Business Dashboarding': [
      'KPI Definition',
      'Dashboard Layout',
      'Interactive Filters',
      'Real-time Data',
      'Mobile Views',
      'User Experience'
    ],
    'Real Data Insights Project': [
      'Business Problem',
      'Data Exploration',
      'Insight Generation',
      'Recommendation',
      'Stakeholder Presentation',
      'Documentation'
    ]
  },
  'python-sql': {
    'Python Basics to Advanced': [
      'Variables & Types',
      'Control Flow',
      'Functions',
      'OOP Concepts',
      'File Handling',
      'Error Handling'
    ],
    'SQL Integration': [
      'SQLite',
      'PostgreSQL',
      'ORM (SQLAlchemy)',
      'CRUD Operations',
      'Transactions',
      'Connection Pooling'
    ],
    'API Handling': [
      'REST APIs',
      'HTTP Methods',
      'JSON Parsing',
      'Authentication',
      'Rate Limiting',
      'Error Handling'
    ],
    'Mini Project': [
      'Requirements Analysis',
      'Database Design',
      'API Development',
      'Testing',
      'Deployment',
      'Documentation'
    ]
  },
  'full-stack': {
    'HTML, CSS, JavaScript': [
      'Semantic HTML',
      'CSS Flexbox/Grid',
      'Responsive Design',
      'DOM Manipulation',
      'ES6+ Features',
      'Async/Await'
    ],
    'React Framework': [
      'Components',
      'Props & State',
      'Hooks',
      'Context API',
      'React Router',
      'State Management'
    ],
    'Django Backend': [
      'Models & ORM',
      'Views & URLs',
      'Templates',
      'Forms',
      'REST Framework',
      'Authentication'
    ],
    'Database Management': [
      'PostgreSQL',
      'Schema Design',
      'Migrations',
      'Indexing',
      'Backup & Restore',
      'Performance Tuning'
    ],
    'Cloud Hosting': [
      'AWS/GCP Basics',
      'Docker Containers',
      'CI/CD Pipelines',
      'Domain Setup',
      'SSL Certificates',
      'Monitoring'
    ],
    'Capstone Full-Stack Project': [
      'Project Planning',
      'UI/UX Design',
      'Backend Architecture',
      'API Integration',
      'Deployment',
      'Presentation'
    ]
  },
  'web-development': {
    'Frontend Design': [
      'UI Principles',
      'Color Theory',
      'Typography',
      'Layout Design',
      'Component Libraries',
      'Accessibility'
    ],
    'Responsive Layouts': [
      'Media Queries',
      'Mobile First',
      'Breakpoints',
      'Flexbox Layouts',
      'CSS Grid',
      'Testing Devices'
    ],
    'Hosting Basics': [
      'Domain Registration',
      'DNS Configuration',
      'Web Hosting',
      'FTP/SFTP',
      'SSL Setup',
      'CDN Basics'
    ],
    'Portfolio Project': [
      'Design Planning',
      'Content Creation',
      'Development',
      'SEO Optimization',
      'Performance',
      'Launch'
    ]
  },
  'python-basics': {
    'Introduction to Python & installation': [
      'What is Python',
      'Installing Python',
      'IDE Setup',
      'First Program',
      'Running Scripts',
      'Python Shell'
    ],
    'Variables & Data Types': [
      'Numbers',
      'Strings',
      'Lists',
      'Tuples',
      'Dictionaries',
      'Sets'
    ],
    'Input/Output operations': [
      'print() Function',
      'input() Function',
      'Formatting Output',
      'File I/O',
      'Reading Files',
      'Writing Files'
    ],
    'Type casting': [
      'int()',
      'float()',
      'str()',
      'list()',
      'Type Checking',
      'Conversions'
    ],
    'Comments & indentation': [
      'Single-line Comments',
      'Multi-line Comments',
      'Docstrings',
      'Indentation Rules',
      'Code Blocks',
      'Best Practices'
    ],
    'Operators (Arithmetic, Comparison, Logical, Assignment, Bitwise)': [
      'Math Operations',
      'Comparisons',
      'Logical AND/OR',
      'Assignment Ops',
      'Bitwise Ops',
      'Operator Precedence'
    ]
  },
  'augmented-reality': {
    'Create 3D object interactions': [
      '3D Modeling Basics',
      'Object Placement',
      'Gestures',
      'Physics',
      'Collision Detection',
      'Animations'
    ],
    'Track surfaces, images, faces': [
      'Plane Detection',
      'Image Tracking',
      'Face Mesh',
      'Body Tracking',
      'Object Tracking',
      'Calibration'
    ],
    'Improve performance of AR apps': [
      'Optimization',
      'Memory Management',
      'Frame Rate',
      'Battery Usage',
      'Asset Compression',
      'Testing'
    ],
    'Integrate animations & UI': [
      'UI Overlays',
      '3D Animations',
      'Particle Effects',
      'Sound Integration',
      'User Feedback',
      'Interactivity'
    ]
  },
  'sql-language': {
    'Database fundamentals': [
      'DBMS Concepts',
      'Tables & Schemas',
      'Primary Keys',
      'Foreign Keys',
      'Normalization',
      'ER Diagrams'
    ],
    'SQL queries and operations': [
      'SELECT Statements',
      'WHERE Clauses',
      'ORDER BY',
      'GROUP BY',
      'HAVING',
      'DISTINCT'
    ],
    'Data manipulation': [
      'INSERT',
      'UPDATE',
      'DELETE',
      'MERGE',
      'Transactions',
      'Rollback'
    ],
    'Database design': [
      'Schema Design',
      'Relationships',
      'Indexes',
      'Views',
      'Constraints',
      'Best Practices'
    ]
  },
  'digital-marketing': {
    'Social Media Marketing': [
      'Platform Strategy',
      'Content Calendar',
      'Engagement',
      'Influencer Marketing',
      'Community Building',
      'Trend Analysis'
    ],
    'SEO Optimization': [
      'Keyword Research',
      'On-Page SEO',
      'Off-Page SEO',
      'Technical SEO',
      'Local SEO',
      'SEO Tools'
    ],
    'Email Marketing Campaigns': [
      'List Building',
      'Email Design',
      'Automation',
      'Segmentation',
      'A/B Testing',
      'Deliverability'
    ],
    'Google Ads & Facebook Ads': [
      'Campaign Setup',
      'Targeting',
      'Bidding Strategies',
      'Ad Creatives',
      'Retargeting',
      'Budget Management'
    ],
    'Analytics & Performance Tracking': [
      'Google Analytics',
      'Conversion Tracking',
      'Attribution',
      'Reporting',
      'KPIs',
      'Data-Driven Decisions'
    ]
  }
};
