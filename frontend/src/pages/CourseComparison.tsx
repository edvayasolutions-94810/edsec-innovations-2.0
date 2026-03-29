import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Clock, Award } from 'lucide-react';
import { courses, Course } from '@/data/courses';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CourseComparison = () => {
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const addCourse = (courseId: string) => {
    if (selectedCourses.length < 3 && !selectedCourses.includes(courseId)) {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(selectedCourses.filter(id => id !== courseId));
  };

  const selectedCourseData = selectedCourses
    .map(id => courses.find(c => c.id === id))
    .filter(Boolean) as Course[];

  const allSkills = [...new Set(selectedCourseData.flatMap(c => c.domains || []))];

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="py-16 bg-gradient-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Compare Courses</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Compare up to 3 courses side-by-side to find the perfect fit
            </p>
          </div>

          {/* Course Selector */}
          <div className="max-w-md mx-auto mb-12">
            <Select onValueChange={addCourse}>
              <SelectTrigger>
                <SelectValue placeholder="Add a course to compare..." />
              </SelectTrigger>
              <SelectContent>
                {courses
                  .filter(c => !selectedCourses.includes(c.id))
                  .map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {selectedCourses.length}/3 courses selected
            </p>
          </div>

          {selectedCourseData.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                Select courses above to start comparing
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedCourseData.length}, minmax(280px, 1fr))` }}>
                {/* Course Cards */}
                {selectedCourseData.map(course => (
                  <Card key={course.id} className="p-6 bg-gradient-card border-none relative">
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove course"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>

                    <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                    <h3 className="text-xl font-bold mb-2">{course.title}</h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-secondary mb-4">
                      <Award className="h-4 w-4" />
                      <span>{course.type}</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{course.description}</p>

                    <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                    <ul className="space-y-1 mb-4">
                      {course.features.map((f, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-secondary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {course.domains && (
                      <>
                        <h4 className="font-semibold text-sm mb-2">Domains:</h4>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {course.domains.map((domain, i) => (
                            <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              {domain}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    <Link to={`/course/${course.id}`}>
                      <Button className="w-full bg-gradient-primary hover:opacity-90">View Details</Button>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Skills Matrix */}
              {allSkills.length > 0 && selectedCourseData.length > 1 && (
                <Card className="mt-8 p-6 bg-gradient-card border-none">
                  <h3 className="text-xl font-bold mb-4">Domains Comparison</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Domain</th>
                          {selectedCourseData.map(c => (
                            <th key={c.id} className="text-center py-3 px-4 font-semibold">{c.title}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {allSkills.map(skill => (
                          <tr key={skill} className="border-b border-border/50">
                            <td className="py-3 px-4 text-sm">{skill}</td>
                            {selectedCourseData.map(c => (
                              <td key={c.id} className="text-center py-3 px-4">
                                {c.domains?.includes(skill) ? (
                                  <CheckCircle2 className="h-5 w-5 text-secondary mx-auto" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CourseComparison;
