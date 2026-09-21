// Detailed syllabus structure dynamically derived from domainData.ts
// Single source of truth — avoids maintaining duplicate syllabi in multiple places.

import { domainData } from './domainData';

export interface SyllabusTopic {
  name: string;
  subtopics: string[];
}

export interface CourseSyllabus {
  [feature: string]: string[];
}

export const courseSyllabusDetails: Record<string, CourseSyllabus> = domainData.reduce(
  (acc, domain) => {
    const syllabusObj: CourseSyllabus = {};
    domain.syllabus.forEach((module) => {
      syllabusObj[module.title] = module.topics;
    });

    // Keyed by individual level/domain ID
    acc[domain.id] = syllabusObj;

    // Keyed by parent program ID
    if (!acc[domain.programId]) {
      acc[domain.programId] = {};
    }
    Object.assign(acc[domain.programId], syllabusObj);

    return acc;
  },
  {} as Record<string, CourseSyllabus>
);
