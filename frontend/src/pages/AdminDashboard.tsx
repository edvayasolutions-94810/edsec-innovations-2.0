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
import { useTheme } from '@/contexts/ThemeContext';

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
    const { isDark } = useTheme();
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
        if (!window.confirm("Are you sure you want to delete this enrollment?")) return;
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

    // Theme Variables
    const pageBg     = isDark ? 'bg-[#0B0F0F]' : 'bg-[#F8FAFC]';
    const titleClr   = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
    const subClr     = isDark ? 'text-[#99F6E4]' : 'text-[#0F766E]';
    const cardBg     = isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.2)]' : 'bg-white border-gray-200';
    const cardShadow = isDark ? 'shadow-none hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'shadow-sm hover:shadow-md';
    const iconBg     = isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10';
    const textBase   = isDark ? 'text-[#99F6E4]' : 'text-slate-600';
    const textStrong = isDark ? 'text-[#E6FFFA]' : 'text-slate-900';
    const mutedClr   = isDark ? 'text-[#94A3B8]' : 'text-slate-500';
    
    const inputBg    = isDark ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB]' : 'bg-white border-slate-300 text-slate-900';
    const btnSecondary = isDark ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB] hover:bg-[rgba(255,255,255,0.1)]' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50';

    const tableHeader = isDark ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#94A3B8]' : 'border-slate-200 bg-slate-50 text-slate-600';
    const tableRowBase = isDark ? 'border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)]' : 'border-slate-100 hover:bg-slate-50';
    const primaryText = isDark ? 'text-[#F9FAFB]' : 'text-slate-900';
    const secondaryText = isDark ? 'text-[#D1D5DB]' : 'text-slate-700';
    const labelBadgeBg = isDark ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#94A3B8]' : 'bg-slate-100 border border-slate-200 text-slate-600';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
            <Navbar />

            <section className="py-10 min-h-[calc(100vh-64px)]">
                <div className="container max-w-7xl mx-auto px-4">

                    {/* Header */}
                    <div className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-6 rounded-2xl ${cardBg} ${isDark ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'shadow-sm'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${iconBg}`}>
                                <LayoutDashboard className="h-6 w-6 text-[#14B8A6]" />
                            </div>
                            <div>
                                <h1 className={`text-3xl font-bold ${titleClr}`}>Admin Dashboard</h1>
                                <p className={`text-sm mt-1 ${subClr}`}>Manage student enrollments and records securely.</p>
                            </div>
                        </div>
                        <Button
                            onClick={handleLogout}
                            variant="outline"
                            className="gap-2 bg-transparent border-red-500/30 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                        >
                            <LogOut className="h-4 w-4" /> Logout
                        </Button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card className={`${cardBg} ${cardShadow} transition-shadow`}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium mb-1 ${textBase}`}>Total Enrollments</p>
                                    <h3 className={`text-3xl font-bold ${textStrong}`}>{students.length}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconBg}`}>
                                    <Users className="text-[#14B8A6] h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`${cardBg} ${cardShadow} transition-shadow`}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium mb-1 ${textBase}`}>Paid Students</p>
                                    <h3 className={`text-3xl font-bold ${textStrong}`}>{paidCount}</h3>
                                </div>
                                <div className="w-12 h-12 bg-emerald-100 dark:bg-[rgba(16,185,129,0.1)] rounded-full flex items-center justify-center">
                                    <CreditCard className="text-emerald-600 dark:text-emerald-500 h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className={`${cardBg} ${cardShadow} transition-shadow`}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <p className={`text-sm font-medium mb-1 ${textBase}`}>Pending Validation</p>
                                    <h3 className={`text-3xl font-bold ${textStrong}`}>{pendingCount}</h3>
                                </div>
                                <div className="w-12 h-12 bg-amber-100 dark:bg-[rgba(245,158,11,0.1)] rounded-full flex items-center justify-center">
                                    <CreditCard className="text-amber-600 dark:text-[#F59E0B] h-6 w-6" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Course Settings (Syllabus Control) */}
                    <Card className={`mb-8 ${cardBg} shadow-none`}>
                        <CardHeader className="py-5 pb-4 border-b border-[rgba(13,148,136,0.1)]">
                            <CardTitle className={`text-lg ${titleClr}`}>Syllabus Access Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className={`border-b text-xs uppercase font-semibold ${tableHeader}`}>
                                            <th className="px-6 py-4">Course Title</th>
                                            <th className="px-6 py-4 text-right">PDF Download Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[rgba(13,148,136,0.05)]">
                                        {dbCourses.map(course => (
                                            <tr key={course._id} className={`transition-colors ${tableRowBase}`}>
                                                <td className={`px-6 py-4 text-sm font-medium ${secondaryText}`}>{course.title}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        size="sm"
                                                        variant={course.syllabus_download_enabled ? "default" : "secondary"}
                                                        onClick={() => handleToggleSyllabus(course._id)}
                                                        className={course.syllabus_download_enabled ? "bg-emerald-600 hover:bg-emerald-700 text-white border-0" : isDark ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"}
                                                    >
                                                        {course.syllabus_download_enabled ? "Enabled" : "Disabled"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {dbCourses.length === 0 && (
                                            <tr>
                                                <td colSpan={2} className={`px-6 py-6 text-center text-sm ${mutedClr}`}>No courses detected in database yet.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Filters & Actions */}
                    <Card className={`mb-6 ${cardBg} shadow-sm border-0 bg-transparent`}>
                        <CardContent className="p-0 flex flex-col md:flex-row gap-4 items-center justify-between border-none">
                            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                                <div className="relative w-full md:w-72">
                                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${mutedClr}`} />
                                    <Input
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className={`pl-9 w-full ${inputBg}`}
                                    />
                                </div>

                                <Select value={filterCourse} onValueChange={setFilterCourse}>
                                    <SelectTrigger className={`w-full md:w-[200px] ${inputBg}`}>
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

                            <Button onClick={handleExportCSV} variant="outline" className={`w-full md:w-auto gap-2 ${btnSecondary}`}>
                                <Download className="h-4 w-4" /> Export CSV
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Data Table */}
                    <Card className={`card-sudur overflow-hidden rounded-2xl ${cardBg} shadow-sm border`}>
                        <div className="overflow-x-auto rounded-xl">
                            {loading ? (
                                <div className={`p-16 text-center ${mutedClr}`}>Loading records...</div>
                            ) : (
                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                    <thead>
                                        <tr className={`border-b text-xs font-bold uppercase tracking-wider ${tableHeader}`}>
                                            <th className="px-6 py-4">Candidate Profile</th>
                                            <th className="px-6 py-4">Program & Domain</th>
                                            <th className="px-6 py-4">Financials</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDark ? "divide-y divide-[rgba(255,255,255,0.05)] text-[#D1D5DB]" : "divide-y divide-slate-100 text-slate-700"}>
                                        {filteredStudents.length > 0 ? (
                                            filteredStudents.map((student) => (
                                                <tr key={student._id} className={`transition-colors duration-300 group border-b last:border-0 relative ${tableRowBase}`}>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className={`font-semibold ${primaryText}`}>{student.full_name}</span>
                                                            <span className={`text-sm ${mutedClr}`}>{student.email}</span>
                                                            <span className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{student.phone}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className={`font-medium inline-block text-blue-600 dark:text-blue-400`}>{student.course_name || 'N/A'}</span>
                                                            <span className={`text-xs font-bold mt-0.5 ${secondaryText}`}>Domain: <span className="text-indigo-600 dark:text-indigo-400">{student.domain || 'N/A'}</span></span>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${labelBadgeBg}`}>
                                                                    {student.course_duration || 'N/A'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col">
                                                            <span className={`font-semibold ${primaryText}`}>{student.price_paid || 'TBD'}</span>
                                                            <span className={`text-xs mt-1 ${mutedClr}`}>
                                                                {student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : 'N/A'}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-col gap-2 items-start">
                                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${student.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-[rgba(16,185,129,0.1)] dark:text-emerald-400 dark:border-emerald-500/20' : 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-[rgba(245,158,11,0.1)] dark:text-[#F59E0B] dark:border-[#F59E0B]/20'} cursor-default`}>
                                                                {student.payment_status.toUpperCase()}
                                                            </span>
                                                            {student.status !== 'Pending' && (
                                                                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${(student.status || 'Not Selected') === 'Selected' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-[#3B82F6]/10 dark:text-[#60A5FA] dark:border-[#3B82F6]/20' : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-[rgba(255,255,255,0.05)] dark:text-[#D1D5DB] dark:border-[rgba(255,255,255,0.1)]'}`}>
                                                                    {(student.status || 'Not Selected').toUpperCase()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="flex justify-end gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30" onClick={() => handleSelect(student._id, student.status || 'Not Selected')} disabled={student.status === 'Selected'} title="Select/Accept Student">
                                                                <CheckCircle className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30" onClick={() => setSelectedStudent(student)} title="View Details">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30" onClick={() => handleDelete(student._id)} title="Delete Student">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={5} className={`px-6 py-16 text-center ${mutedClr}`}>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Search className="h-8 w-8 mb-3 opacity-20" />
                                                        <p>No students found matching your criteria.</p>
                                                    </div>
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
                    <Card className={`w-full max-w-lg shadow-2xl border ${isDark ? 'bg-[#0F172A] border-slate-700/50' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
                        <CardHeader className={`border-b flex flex-row items-center justify-between space-y-0 rounded-t-xl pb-4 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                            <CardTitle className={`text-xl ${titleClr}`}>Student Details</CardTitle>
                            <button onClick={() => setSelectedStudent(null)} className={`leading-none text-2xl ${mutedClr} hover:opacity-70`}>&times;</button>
                        </CardHeader>
                        <CardContent className="p-6 grid gap-5 text-sm">
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Full Name</label><span className={`font-semibold block mt-1 ${primaryText}`}>{selectedStudent.full_name}</span></div>
                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Email</label><span className={`font-semibold block mt-1 ${primaryText}`}>{selectedStudent.email}</span></div>
                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Phone</label><span className={`font-semibold block mt-1 ${primaryText}`}>{selectedStudent.phone}</span></div>
                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Enroll Date</label><span className={`font-semibold block mt-1 ${primaryText}`}>{selectedStudent.enrollment_date ? new Date(selectedStudent.enrollment_date).toLocaleString() : 'N/A'}</span></div>

                                <div className={`col-span-2 border-t my-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}></div>

                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Course Name</label><span className={`font-semibold block mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{selectedStudent.course_name || '-'}</span></div>
                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Domain Spec</label><span className={`font-bold block mt-1 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{selectedStudent.domain || '-'}</span></div>
                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Course Duration</label><span className={`font-semibold block mt-1 ${primaryText}`}>{selectedStudent.course_duration || '-'}</span></div>

                                <div className={`col-span-2 border-t my-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}></div>

                                <div><label className={`text-[10px] font-bold uppercase tracking-wider block ${mutedClr}`}>Payment Total</label><span className={`font-bold text-lg block mt-1 ${primaryText}`}>{selectedStudent.price_paid || '-'}</span></div>
                                <div>
                                    <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${mutedClr}`}>Status</label>
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded border inline-block ${selectedStudent.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800'}`}>
                                            PAY: {selectedStudent.payment_status.toUpperCase()}
                                        </span>
                                        {selectedStudent.status !== 'Pending' && (
                                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border inline-block ${(selectedStudent.status || 'Not Selected') === 'Selected' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'}`}>
                                                ENROLL: {(selectedStudent.status || 'Not Selected').toUpperCase()}
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
