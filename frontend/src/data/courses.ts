import dataScience from '@/assets/courses/data-science.jpg';
import dataAnalytics from '@/assets/courses/data-analytics.jpg';
import pythonSql from '@/assets/courses/python-sql.jpg';
import fullStack from '@/assets/courses/full-stack.jpg';
import webDev from '@/assets/courses/web-development.jpg';
import pythonBasics from '@/assets/courses/python-basics.jpg';
import msOffice from '@/assets/courses/ms-office.jpg';
import digitalMarketingNew from '@/assets/courses/digital-marketing-new.jpg';
import sqlLanguage from '@/assets/courses/sql-language.jpg';

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
  downloadBrochure?: { url: string; filename: string };
  domains: string[];
}

export const courses: Course[] = [
  {
    id: '1-month-skill',
    title: 'Foundation Tech Program',
    duration: '1 Month',
    price: '1999',
    type: 'Internship Program',
    description: 'Intensive 1-month program designed for rapid skill enhancement and fundamental learning.',
    features: [
      'Structured technical training',
      'Hands-on implementation',
      'One functional project',
      'Mentor support',
      'Completion Certificate'
    ],
    domains: ['SQL Language', 'Core Python', 'Augmented Reality', 'Digital Marketing'],
    category: 'main',
    detailedDescription: 'Get hands-on foundational experience across multiple critical domains to jumpstart your technical journey.',
    image: dataAnalytics
  },
  {
    id: '3-month-industry',
    title: 'Applied Technology Program',
    duration: '3 Months',
    price: '3499',
    type: 'Internship Program',
    description: 'A 3-month comprehensive industry-level training program driving towards an MSME Certification.',
    features: [
      'Industry-level training',
      'One major project',
      'Mentor guidance',
      'MSME Internship Certificate'
    ],
    domains: ['Data Analytics', 'Web Development', 'Generative AI'],
    category: 'main',
    detailedDescription: 'Step up to industry standards with our 3-month intensive training program focusing on major modern developmental roles.',
    image: webDev
  },
  {
    id: '5-month-advanced',
    title: 'Advanced AI & Software Engineering',
    duration: '5 Months',
    price: '4999',
    type: 'Internship Program',
    description: 'Elite 5-month advanced training featuring deep portfolio building and direct internship offer letters.',
    features: [
      'Two industry projects',
      'Resume building support',
      'LinkedIn optimization',
      'Internship Offer Letter',
      'MSME Certificate'
    ],
    domains: ['Data Science', 'Python Full Stack Development', 'Artificial Intelligence & Machine Learning'],
    category: 'main',
    detailedDescription: 'Our flagship 5-month program. Not only learn the most advanced fields in computing today, but graduate with a pre-vetted Internship Offer Letter and complete professional rebranding.',
    image: dataScience
  }
];
