import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Search, Download, Trash2, Eye, LayoutDashboard, Users, CreditCard, CheckCircle, LogOut } from 'lucide-react';
import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

interface Student {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
    course_name: string;
    course_duration: string;
    domain?: string;
    price_paid: string;
    payment_status: string;
    status: string;
    enrollment_date: string;
}

interface CourseDb {
    _id: string;
    title: string;
    syllabus_download_enabled: boolean;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState<Student[]>([]);
    const [dbCourses, setDbCourses] = useState<CourseDb[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCourse, setFilterCourse] = useState('all');
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const getToken = () => localStorage.getItem('adminToken') || '';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        toast.success('Logged out successfully.');
        navigate('/admin-login');
    };

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/students`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setStudents(res.data);
        } catch (err: any) {
            console.error('Failed to fetch students', err);
            toast.error('Could not load student data.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${API_URL}/courses`);
            setDbCourses(res.data);
        } catch (err: any) {
            console.error('Failed to fetch courses', err);
        }
    };

    const handleToggleSyllabus = async (courseId: string) => {
        try {
            await axios.patch(`${API_URL}/courses/${courseId}/toggle-syllabus`, {}, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setDbCourses(dbCourses.map(c =>
                c._id === courseId ? { ...c, syllabus_download_enabled: !c.syllabus_download_enabled } : c
            ));
            toast.success("Syllabus download setting toggled.");
        } catch (err) {
            toast.error("Failed to toggle syllabus visibility.");
        }
    };

    const handleSelect = async (id: string, currentStatus: string) => {
        if (currentStatus === 'Selected') return;
        try {
            await axios.put(
                `${API_URL}/students/${id}/select`,
                {},
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setStudents(students.map(s => (s._id === id ? { ...s, status: 'Selected' } : s)));
            toast.success('Student status updated to Selected.');
        } catch (err) {
            toast.error('Failed to select student');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`${API_URL}/students/${id}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setStudents(students.filter(s => s._id !== id));
            toast.success('Enrollment deleted successfully.');
        } catch (err) {
            toast.error('Failed to delete enrollment');
        }
    };

    const handleExportCSV = () => {
        const headers = ['Name,Email,Phone,Course,Duration,Price Paid,Date,Status'];
        const csvRows = students.map(s =>
            `"${s.full_name}","${s.email}","${s.phone}","${s.course_name}","${s.course_duration}","${s.price_paid}","${new Date(s.enrollment_date).toLocaleDateString()}","${s.payment_status}"`
        );
        const blob = new Blob([headers.concat(csvRows).join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `enrollments-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredStudents = students.filter(s => {
        const matchCourse = filterCourse === 'all' || s.course_name === filterCourse;
        const searchLower = searchQuery.toLowerCase();
        const matchSearch =
            (s.full_name || '').toLowerCase().includes(searchLower) ||
            (s.email || '').toLowerCase().includes(searchLower);
        return matchCourse && matchSearch;
    });

    const uniqueCourses = Array.from(new Set(students.map(s => s.course_name).filter(Boolean)));
    const paidCount = students.filter(s => s.payment_status === 'Paid').length;
    const pendingCount = students.filter(s => s.payment_status === 'Unpaid').length;

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="section-alt-1 section-padding min-h-[calc(100vh-64px)]">
                <div className="container-sudur max-w-7xl">

                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 card-sudur shadow-[0_4px_30px_rgba(0,0,0,0.1)] border border-[rgba(20,184,166,0.2)]">
                        <div className="flex items-center gap-3">
                            <div className="bg-[#14B8A6]/10 p-3 rounded-lg">
                                <LayoutDashboard className="h-6 w-6 text-[#14B8A6]" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#E6FFFA]">Admin Dashboard</h1>
                                <p className="text-[#99F6E4] text-sm">Manage student enrollments and records securely.</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="gap-2 bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className="card-sudur border-[rgba(20,184,166,0.2)] shadow-none hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-shadow">
                            <CardContent className="p-0 flex items-center justify-between">
                                <div>
                                    <p className="text-[#99F6E4] text-sm font-medium mb-1">Total Enrollments</p>
                                    <h3 className="text-3xl font-bold text-[#E6FFFA]">{students.length}</h3>
                                </div>
                                <div className="w-12 h-12 bg-[#14B8A6]/10 rounded-full flex items-center justify-center">
                                    <Users className="text-[#14B8A6] h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-sudur border-[rgba(20,184,166,0.2)] shadow-none hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-shadow">
                            <CardContent className="p-0 flex items-center justify-between">
                                <div>
                                    <p className="text-[#99F6E4] text-sm font-medium mb-1">Paid Students</p>
                                    <h3 className="text-3xl font-bold text-[#E6FFFA]">{paidCount}</h3>
                                </div>
                                <div className="w-12 h-12 bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center">
                                    <CreditCard className="text-emerald-500 h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="card-sudur border-[rgba(20,184,166,0.2)] shadow-none hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] transition-shadow">
                            <CardContent className="p-0 flex items-center justify-between">
                                <div>
                                    <p className="text-[#99F6E4] text-sm font-medium mb-1">Pending Validation</p>
                                    <h3 className="text-3xl font-bold text-[#E6FFFA]">{pendingCount}</h3>
                                </div>
                                <div className="w-12 h-12 bg-[rgba(245,158,11,0.1)] rounded-full flex items-center justify-center">
                                    <CreditCard className="text-[#F59E0B] h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Course Settings (Syllabus Control) */}
                    <Card className="mb-8 card-sudur border border-[rgba(20,184,166,0.2)] shadow-none bg-[#0D1515]">
                        <CardHeader className="py-0 pb-4">
                            <CardTitle className="text-lg text-[#E6FFFA]">Syllabus Access Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-[rgba(20,184,166,0.2)] bg-[rgba(20,184,166,0.05)] text-xs uppercase text-[#99F6E4] font-semibold">
                                            <th className="px-6 py-3">Course Title</th>
                                            <th className="px-6 py-3 text-right">PDF Download Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                                        {dbCourses.map(course => (
                                            <tr key={course._id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                                <td className="px-6 py-3 text-sm font-medium text-[#D1D5DB]">{course.title}</td>
                                                <td className="px-6 py-3 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant={course.syllabus_download_enabled ? "default" : "secondary"}
                                                        onClick={() => handleToggleSyllabus(course._id)}
                                                        className={course.syllabus_download_enabled ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-slate-200 text-slate-700"}
                                                    >
                                                        {course.syllabus_download_enabled ? "Enabled" : "Disabled"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {dbCourses.length === 0 && (
                                            <tr>
                                                <td colSpan={2} className="px-6 py-4 text-center text-slate-500 text-sm">No courses detected in database yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filters & Actions */}
                    <Card className="mb-6 card-sudur border-[rgba(20,184,166,0.2)] shadow-sm">
                        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between border-none">
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#99F6E4]" />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-9 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB]"
                                    />
                                </div>

                                <Select value={filterCourse} onValueChange={setFilterCourse}>
                                    <SelectTrigger className="w-full md:w-[200px] bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB]">
                                        <SelectValue placeholder="All Courses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Courses</SelectItem>
                                        {uniqueCourses.map(course => (
                                            <SelectItem key={course} value={course}>{course}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button onClick={handleExportCSV} variant="outline" className="w-full md:w-auto gap-2 bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB] hover:bg-[rgba(255,255,255,0.1)] hover:text-white">
                                <Download className="h-4 w-4" /> Export CSV
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card className="card-sudur border-0 shadow-none overflow-hidden">
                        <div className="overflow-x-auto rounded-xl">
                            {loading ? (
                                <div className="p-12 text-center text-[#94A3B8]">Loading records...</div>
                            ) : (
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                                            <th className="px-6 py-4">Candidate Profile</th>
                                            <th className="px-6 py-4">Program & Domain</th>
                                            <th className="px-6 py-4">Financials</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[rgba(255,255,255,0.05)] text-[#D1D5DB]">
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student) => (
                                                <tr key={student._id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors duration-300 group border-b border-[rgba(255,255,255,0.05)] last:border-0 relative">
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-[#F9FAFB]">{student.full_name}</span>
                                                            <span className="text-sm text-[#94A3B8]">{student.email}</span>
                                                            <span className="text-xs text-[#6B7280] mt-0.5">{student.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium inline-block text-[#3B82F6]">{student.course_name || 'N/A'}</span>
                                                            <span className="text-xs font-bold text-[#D1D5DB] mt-0.5">Domain: <span className="text-[#818CF8]">{student.domain || 'N/A'}</span></span>
                                                            <div className="flex items-center gap-2 mt-1.5">
                                                                <span className="text-xs bg-[rgba(255,255,255,0.05)] text-[#94A3B8] px-2 py-0.5 rounded border border-[rgba(255,255,255,0.1)]">
                                                                    {student.course_duration || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-[#F9FAFB]">{student.price_paid || 'TBD'}</span>
                                                            <span className="text-xs text-[#94A3B8] mt-1">
                                                                {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-2 items-start">
                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${student.payment_status === 'Paid' ? 'bg-[rgba(16,185,129,0.1)] text-emerald-400 border-emerald-500/20' : 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B] border-[#F59E0B]/20'} cursor-default`}>
                                                                {student.payment_status.toUpperCase()}
                                                            </span>
                                                            {student.status !== 'Pending' && (
                                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${(student.status || 'Not Selected') === 'Selected' ? 'bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/20' : 'bg-[rgba(255,255,255,0.05)] text-[#D1D5DB] border-[rgba(255,255,255,0.1)]'}`}>
                                                                    {(student.status || 'Not Selected').toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" onClick={() => handleSelect(student._id, student.status || 'Not Selected')} disabled={student.status === 'Selected'} title="Select/Accept Student">
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => setSelectedStudent(student)} title="View Details">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleDelete(student._id)} title="Delete Student">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                                    No students found matching your criteria.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </Card>
                </div>
            </section>

            {/* Details Modal overlay */}
            {selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}>
                    <Card className="w-full max-w-lg shadow-xl" onClick={e => e.stopPropagation()}>
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 rounded-t-xl pb-4">
                            <CardTitle className="text-xl">Student Details</CardTitle>
                            <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 leading-none text-2xl">&times;</button>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Full Name</label><span className="font-medium block mt-1">{selectedStudent.full_name}</span></div>
                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Email</label><span className="font-medium block mt-1">{selectedStudent.email}</span></div>
                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Phone</label><span className="font-medium block mt-1">{selectedStudent.phone}</span></div>
                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Enroll Date</label><span className="font-medium block mt-1">{selectedStudent.enrollment_date ? new Date(selectedStudent.enrollment_date).toLocaleString() : 'N/A'}</span></div>

                                <div className="col-span-2 border-t border-slate-100 my-2"></div>

                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Course Name</label><span className="font-medium text-primary block mt-1">{selectedStudent.course_name || '-'}</span></div>
                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Domain Spec</label><span className="font-bold text-indigo-700 block mt-1">{selectedStudent.domain || '-'}</span></div>
                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Course Duration</label><span className="font-medium block mt-1">{selectedStudent.course_duration || '-'}</span></div>

                                <div className="col-span-2 border-t border-slate-100 my-2"></div>

                                <div><label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Payment Total</label><span className="font-bold text-lg block mt-1">{selectedStudent.price_paid || '-'}</span></div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full border inline-block ${selectedStudent.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                                            PAYMENT: {selectedStudent.payment_status.toUpperCase()}
                                        </span>
                                        {selectedStudent.status !== 'Pending' && (
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full border inline-block ${(selectedStudent.status || 'Not Selected') === 'Selected' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                ENROLLMENT: {(selectedStudent.status || 'Not Selected').toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
