import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';
import {
    Search, Download, Trash2, Eye, LayoutDashboard, Users, CreditCard, CheckCircle,
    LogOut, Edit, Plus, Mail, MessageSquare, Filter, X, ChevronRight, Clock, Award,
    BookOpen, AlertCircle, Calendar, MapPin, User, GraduationCap, DollarSign, UserCheck,
    Settings, RefreshCw, Send, ArrowRight, Menu, FileText, Activity
} from 'lucide-react';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl || envUrl.includes('your-edsec-backend') || (envUrl.includes('localhost') && window.location.hostname !== 'localhost')) {
        return '/api';
    }
    return envUrl + '/api';
};
const API_URL = getApiUrl();


interface Student {
    _id: string;
    full_name: string;
    email: string;
    phone: string;
    whatsapp_number?: string;
    dob?: string;
    gender?: string;
    course_name: string;
    course_duration?: string;
    domain?: string;
    price_paid?: string; // fallback
    program_fee?: number;
    amount_paid?: number;
    remaining_balance?: number;
    payment_status: 'Unpaid' | 'Partially Paid' | 'Paid';
    status: 'New Application' | 'Under Review' | 'Interview Scheduled' | 'Approved' | 'Rejected' | 'On Hold' | 'Completed';
    enrollment_date: string;
    enrollment_id?: string;
    college_name?: string;
    university?: string;
    degree?: string;
    branch?: string;
    semester?: string;
    year_of_study?: string;
    graduation_year?: string;
    city?: string;
    state?: string;
    qualification?: string;
    message?: string;
    batch_id?: string;
    batch_selected?: string;
    email_status?: string;
    whatsapp_status?: string;
    last_contacted_date?: string;
    communication_history?: {
        _id?: string;
        type: 'email' | 'whatsapp';
        subject: string;
        message: string;
        status: string;
        timestamp: string;
        sender: string;
    }[];
    admin_notes?: {
        _id?: string;
        content: string;
        timestamp: string;
        author: string;
    }[];
    status_history?: {
        _id?: string;
        status: string;
        timestamp: string;
        updatedBy: string;
    }[];
}

interface Batch {
    _id: string;
    name: string;
    courseName: string;
    facultyAssigned?: string;
    capacity: number;
    studentsAssigned?: Student[];
    startDate: string;
    endDate: string;
    status: 'Upcoming' | 'Ongoing' | 'Completed';
    notes?: string;
    isActive?: boolean;
}

interface CourseDb {
    _id: string;
    title: string;
    syllabus_download_enabled: boolean;
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isDark } = useTheme();
    
    // Tab Navigation State
    const [activeTab, setActiveTab] = useState<'analytics' | 'crm' | 'batches' | 'syllabus'>('analytics');

    // Data States
    const [students, setStudents] = useState<Student[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [dbCourses, setDbCourses] = useState<CourseDb[]>([]);
    const [loading, setLoading] = useState(true);

    // Advanced Search & Multi-Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCourse, setFilterCourse] = useState('all');
    const [filterDomain, setFilterDomain] = useState('all');
    const [filterBatch, setFilterBatch] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPayment, setFilterPayment] = useState('all');
    const [filterCollege, setFilterCollege] = useState('all');
    const [filterState, setFilterState] = useState('all');

    // Modals & Panels State
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Student>>({});

    const [batchAssignModalOpen, setBatchAssignModalOpen] = useState(false);
    const [batchAssignStudent, setBatchAssignStudent] = useState<Student | null>(null);
    const [selectedBatchId, setSelectedBatchId] = useState('');

    // Batch creation form state
    const [newBatchName, setNewBatchName] = useState('');
    const [newBatchCourse, setNewBatchCourse] = useState('');
    const [newBatchFaculty, setNewBatchFaculty] = useState('');
    const [newBatchCapacity, setNewBatchCapacity] = useState(50);
    const [newBatchStart, setNewBatchStart] = useState('');
    const [newBatchEnd, setNewBatchEnd] = useState('');
    const [newBatchStatus, setNewBatchStatus] = useState<'Upcoming' | 'Ongoing' | 'Completed'>('Upcoming');
    const [newBatchNotes, setNewBatchNotes] = useState('');

    // Drawer helper states (Note thread submission / Custom Email submission)
    const [newNoteContent, setNewNoteContent] = useState('');
    const [customEmailSubject, setCustomEmailSubject] = useState('');
    const [customEmailMessage, setCustomEmailMessage] = useState('');
    const [emailSending, setEmailSending] = useState(false);

    // Batch expanded list helper
    const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

    const getToken = () => localStorage.getItem('adminToken') || '';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        toast.success('Logged out successfully.');
        navigate('/admin-login');
    };

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStudents(),
                fetchBatches(),
                fetchCourses()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async () => {
        try {
            const res = await axios.get(`${API_URL}/students`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setStudents(res.data);
            
            // Sync selected student in drawer if open
            if (selectedStudent) {
                const refreshed = res.data.find((s: Student) => s._id === selectedStudent._id);
                if (refreshed) {
                    setSelectedStudent(refreshed);
                }
            }
        } catch (err: any) {
            console.error('Failed to fetch students', err);
            toast.error('Could not load student data.');
        }
    };

    const fetchBatches = async () => {
        try {
            const res = await axios.get(`${API_URL}/batches`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setBatches(res.data);
        } catch (err: any) {
            console.error('Failed to fetch batches', err);
            toast.error('Could not load batch data.');
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

    // Update Status & trigger communications log
    const handleStatusChange = async (studentId: string, status: string) => {
        try {
            const res = await axios.put(
                `${API_URL}/students/${studentId}/status`,
                { status, adminName: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success(`Status successfully updated to ${status}`);
            
            // Reload student dataset & update details panel if open
            fetchStudents();
        } catch (err: any) {
            console.error(err);
            toast.error('Failed to update student status');
        }
    };

    // Edit Candidate Details submission
    const handleEditFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm._id) return;
        try {
            await axios.put(
                `${API_URL}/students/${editForm._id}`,
                editForm,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Candidate profile updated successfully.');
            setEditModalOpen(false);
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update student details');
        }
    };

    // Batch assignment submission
    const handleAssignBatchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!batchAssignStudent) return;
        try {
            await axios.put(
                `${API_URL}/students/${batchAssignStudent._id}/assign-batch`,
                { batchId: selectedBatchId || null },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Batch assignment modified successfully.');
            setBatchAssignModalOpen(false);
            fetchStudents();
            fetchBatches();
        } catch (err) {
            console.error(err);
            toast.error('Failed to assign batch');
        }
    };

    // Add internal note thread
    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !newNoteContent.trim()) return;
        try {
            const res = await axios.post(
                `${API_URL}/students/${selectedStudent._id}/notes`,
                { content: newNoteContent, author: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Internal note added.');
            setNewNoteContent('');
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error('Failed to append note');
        }
    };

    // Compose Custom Email
    const handleSendCustomEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent || !customEmailSubject.trim() || !customEmailMessage.trim()) return;
        setEmailSending(true);
        try {
            await axios.post(
                `${API_URL}/students/${selectedStudent._id}/send-email`,
                { subject: customEmailSubject, message: customEmailMessage, adminName: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Custom email sent successfully and logged.');
            setCustomEmailSubject('');
            setCustomEmailMessage('');
            fetchStudents();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to dispatch email');
        } finally {
            setEmailSending(false);
        }
    };

    // Admission letter API integration
    const triggerAdmissionLetterDownload = (studentId: string) => {
        window.open(`${API_URL}/students/${studentId}/admission-letter?download=true`, '_blank');
    };

    const triggerAdmissionLetterPreview = (studentId: string) => {
        window.open(`${API_URL}/students/${studentId}/admission-letter?download=false`, '_blank');
    };

    const triggerAdmissionLetterEmail = async (studentId: string) => {
        const loadingToast = toast.loading('Generating PDF and sending email...');
        try {
            await axios.post(
                `${API_URL}/students/${studentId}/admission-letter/email`,
                { adminName: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.dismiss(loadingToast);
            toast.success('Admission letter emailed and logged successfully.');
            fetchStudents();
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to email admission letter');
        }
    };

    // Create a new batch
    const handleCreateBatch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newBatchName || !newBatchCourse || !newBatchStart || !newBatchEnd) {
            toast.error('Please fill in all required batch fields.');
            return;
        }
        try {
            await axios.post(
                `${API_URL}/batches`,
                {
                    name: newBatchName,
                    courseName: newBatchCourse,
                    facultyAssigned: newBatchFaculty,
                    capacity: newBatchCapacity,
                    startDate: newBatchStart,
                    endDate: newBatchEnd,
                    status: newBatchStatus,
                    notes: newBatchNotes
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('New academic batch initialized.');
            // Clear inputs
            setNewBatchName('');
            setNewBatchCourse('');
            setNewBatchFaculty('');
            setNewBatchCapacity(50);
            setNewBatchStart('');
            setNewBatchEnd('');
            setNewBatchNotes('');
            fetchBatches();
        } catch (err) {
            console.error(err);
            toast.error('Failed to create new batch');
        }
    };

    const handleDeleteBatch = async (batchId: string) => {
        if (!window.confirm('Are you sure you want to delete this batch? All assigned students will become unassigned.')) return;
        try {
            await axios.delete(`${API_URL}/batches/${batchId}`, {
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            toast.success('Batch removed.');
            fetchBatches();
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete batch');
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
        const headers = ['EnrollmentID,Name,Email,Phone,WhatsApp,DOB,Gender,College,University,Degree,Branch,Semester,YearOfStudy,GradYear,Course,Domain,EnrollDate,Batch,Fee,Paid,Balance,PayStatus,Status'];
        const csvRows = students.map(s =>
            `"${s.enrollment_id || ''}","${s.full_name}","${s.email}","${s.phone}","${s.whatsapp_number || ''}","${s.dob || ''}","${s.gender || ''}","${s.college_name || ''}","${s.university || ''}","${s.degree || ''}","${s.branch || ''}","${s.semester || ''}","${s.year_of_study || ''}","${s.graduation_year || ''}","${s.course_name}","${s.domain || ''}","${s.enrollment_date ? new Date(s.enrollment_date).toLocaleDateString() : ''}","${s.batch_selected || ''}",${s.program_fee || 0},${s.amount_paid || 0},${s.remaining_balance || 0},"${s.payment_status}","${s.status}"`
        );
        const blob = new Blob([headers.concat(csvRows).join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `edsec-crm-students-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleOpenEdit = (student: Student) => {
        setEditForm({ ...student });
        setEditModalOpen(true);
    };

    const handleOpenBatchAssign = (student: Student) => {
        setBatchAssignStudent(student);
        setSelectedBatchId(student.batch_id || '');
        setBatchAssignModalOpen(true);
    };

    const handleOpenProfileDrawer = (student: Student) => {
        setSelectedStudent(student);
        setDrawerOpen(true);
    };

    // Filter calculations
    const filteredStudents = students.filter(s => {
        const matchSearch = searchQuery.trim() === '' ||
            (s.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.enrollment_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.college_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.state || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchCourse = filterCourse === 'all' || s.course_name === filterCourse;
        const matchDomain = filterDomain === 'all' || s.domain === filterDomain;
        const matchBatch = filterBatch === 'all' || 
            (filterBatch === 'unassigned' ? !s.batch_id : s.batch_id === filterBatch);
        const matchStatus = filterStatus === 'all' || s.status === filterStatus;
        const matchPayment = filterPayment === 'all' || s.payment_status === filterPayment;
        const matchCollege = filterCollege === 'all' || s.college_name === filterCollege;
        const matchState = filterState === 'all' || s.state === filterState;

        return matchSearch && matchCourse && matchDomain && matchBatch && matchStatus && matchPayment && matchCollege && matchState;
    });

    const resetFilters = () => {
        setSearchQuery('');
        setFilterCourse('all');
        setFilterDomain('all');
        setFilterBatch('all');
        setFilterStatus('all');
        setFilterPayment('all');
        setFilterCollege('all');
        setFilterState('all');
    };

    // Gather select dropdown filter lists from student dataset
    const uniqueCoursesList = Array.from(new Set(students.map(s => s.course_name).filter(Boolean)));
    const uniqueDomainsList = Array.from(new Set(students.map(s => s.domain).filter(Boolean)));
    const uniqueCollegesList = Array.from(new Set(students.map(s => s.college_name).filter(Boolean)));
    const uniqueStatesList = Array.from(new Set(students.map(s => s.state).filter(Boolean)));

    // Analytics calculations
    const statsTotal = students.length;
    const statsNew = students.filter(s => s.status === 'New Application').length;
    const statsReview = students.filter(s => s.status === 'Under Review').length;
    const statsInterview = students.filter(s => s.status === 'Interview Scheduled').length;
    const statsApproved = students.filter(s => s.status === 'Approved').length;
    const statsRejected = students.filter(s => s.status === 'Rejected').length;
    const statsHold = students.filter(s => s.status === 'On Hold').length;
    const statsCompleted = students.filter(s => s.status === 'Completed').length;

    const totalRevenue = students.reduce((sum, s) => sum + (s.program_fee || 0), 0);
    const totalCollected = students.reduce((sum, s) => sum + (s.amount_paid || 0), 0);
    const totalPending = students.reduce((sum, s) => sum + (s.remaining_balance || 0), 0);
    const collectionPercentage = totalRevenue > 0 ? Math.round((totalCollected / totalRevenue) * 100) : 0;

    // Theme Variables
    const pageBg     = isDark ? 'bg-[#0B0F0F] text-[#E6FFFA]' : 'bg-[#F8FAFC] text-slate-900';
    const titleClr   = isDark ? 'text-[#E6FFFA]' : 'text-[#0F172A]';
    const subClr     = isDark ? 'text-[#99F6E4]' : 'text-[#0F766E]';
    const cardBg     = isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.2)]' : 'bg-white border-gray-200';
    const cardShadow = isDark ? 'shadow-none hover:shadow-[0_0_15px_rgba(20,184,166,0.15)]' : 'shadow-sm hover:shadow-md';
    const iconBg     = isDark ? 'bg-[#14B8A6]/10' : 'bg-[#0D9488]/10';
    const textBase   = isDark ? 'text-[#99F6E4]' : 'text-slate-600';
    const textStrong = isDark ? 'text-[#E6FFFA]' : 'text-slate-900';
    const mutedClr   = isDark ? 'text-[#94A3B8]' : 'text-slate-500';
    
    const inputBg    = isDark ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB] focus:border-[#14B8A6]/60' : 'bg-white border-slate-300 text-slate-900 focus:border-[#0D9488]/60';
    const btnSecondary = isDark ? 'bg-[rgba(255,255,255,0.05)] border-[rgba(255,255,255,0.1)] text-[#F9FAFB] hover:bg-[rgba(255,255,255,0.1)]' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50';

    const tableHeader = isDark ? 'border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] text-[#94A3B8]' : 'border-slate-200 bg-slate-50 text-slate-600';
    const tableRowBase = isDark ? 'border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)]' : 'border-slate-100 hover:bg-slate-50';
    const primaryText = isDark ? 'text-[#F9FAFB]' : 'text-slate-900';
    const secondaryText = isDark ? 'text-[#D1D5DB]' : 'text-slate-700';
    const labelBadgeBg = isDark ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#94A3B8]' : 'bg-slate-100 border border-slate-200 text-slate-600';

    return (
        <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
            <Navbar />

            <section className="py-8 min-h-[calc(100vh-64px)]">
                <div className="container max-w-7xl mx-auto px-4">

                    {/* Header Panel */}
                    <div className={`flex flex-col md:flex-row justify-between items-center mb-6 gap-4 p-5 rounded-2xl ${cardBg} ${isDark ? 'shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'shadow-sm'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${iconBg}`}>
                                <LayoutDashboard className="h-6 w-6 text-[#14B8A6]" />
                            </div>
                            <div>
                                <h1 className={`text-2xl font-bold tracking-tight ${titleClr}`}>EdSec Admissions CRM</h1>
                                <p className={`text-xs mt-0.5 ${subClr}`}>Student admissions pipeline, automated triggers, batch scheduler, and PDF offer letters.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                className="gap-2 bg-transparent border-red-500/30 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300"
                            >
                                <LogOut className="h-4 w-4" /> Logout
                            </Button>
                        </div>
                    </div>

                    {/* Tabs Selection Bar */}
                    <div className="flex gap-2 mb-6 border-b border-[rgba(20,184,166,0.15)] pb-px overflow-x-auto whitespace-nowrap">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
                                activeTab === 'analytics'
                                    ? 'border-[#14B8A6] text-[#14B8A6]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-[#99F6E4]'
                            }`}
                        >
                            <LayoutDashboard className="h-4 w-4" /> Analytics Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('crm')}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
                                activeTab === 'crm'
                                    ? 'border-[#14B8A6] text-[#14B8A6]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-[#99F6E4]'
                            }`}
                        >
                            <Users className="h-4 w-4" /> Student CRM Pipeline
                        </button>
                        <button
                            onClick={() => setActiveTab('batches')}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
                                activeTab === 'batches'
                                    ? 'border-[#14B8A6] text-[#14B8A6]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-[#99F6E4]'
                            }`}
                        >
                            <Calendar className="h-4 w-4" /> Batch Management
                        </button>
                        <button
                            onClick={() => setActiveTab('syllabus')}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
                                activeTab === 'syllabus'
                                    ? 'border-[#14B8A6] text-[#14B8A6]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-[#99F6E4]'
                            }`}
                        >
                            <Settings className="h-4 w-4" /> Syllabus Settings
                        </button>
                    </div>

                    {/* Loader */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <RefreshCw className="h-10 w-10 text-[#14B8A6] animate-spin" />
                            <p className="text-sm font-medium text-slate-500">Retrieving secure CRM logs...</p>
                        </div>
                    ) : (
                        <>
                            {/* Tab 1: Analytics Overview */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-6">
                                    {/* 12 Metrics cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Applicants</p>
                                                    <h4 className="text-xl font-bold mt-1 textStrong">{statsTotal}</h4>
                                                </div>
                                                <Users className="h-5 w-5 text-[#14B8A6]" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">New Apps</p>
                                                    <h4 className="text-xl font-bold mt-1 text-blue-500">{statsNew}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Under Review</p>
                                                    <h4 className="text-xl font-bold mt-1 text-indigo-400">{statsReview}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Interviewed</p>
                                                    <h4 className="text-xl font-bold mt-1 text-amber-500">{statsInterview}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Approved</p>
                                                    <h4 className="text-xl font-bold mt-1 text-emerald-500">{statsApproved}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Rejected</p>
                                                    <h4 className="text-xl font-bold mt-1 text-red-500">{statsRejected}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">On Hold</p>
                                                    <h4 className="text-xl font-bold mt-1 text-purple-400">{statsHold}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Completed</p>
                                                    <h4 className="text-xl font-bold mt-1 text-slate-400">{statsCompleted}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Gross Fees</p>
                                                    <h4 className="text-xl font-bold mt-1 textStrong">₹{totalRevenue}</h4>
                                                </div>
                                                <DollarSign className="h-5 w-5 text-indigo-400" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Revenue Collected</p>
                                                    <h4 className="text-xl font-bold mt-1 text-emerald-500">₹{totalCollected}</h4>
                                                </div>
                                                <CreditCard className="h-5 w-5 text-emerald-500" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Balance Pending</p>
                                                    <h4 className="text-xl font-bold mt-1 text-orange-500">₹{totalPending}</h4>
                                                </div>
                                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Batches</p>
                                                    <h4 className="text-xl font-bold mt-1 textStrong">{batches.length}</h4>
                                                </div>
                                                <Calendar className="h-5 w-5 text-blue-400" />
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Progress arc gauges row */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className={`md:col-span-2 ${cardBg} p-6 flex flex-col md:flex-row gap-6 items-center justify-between`}>
                                            <div className="space-y-4 w-full md:w-2/3">
                                                <h3 className="text-lg font-bold textStrong">Financial Realization Summary</h3>
                                                <p className="text-xs text-slate-400">Review real-time payment collection progress. The gauge represents realization rate over generated tuition invoices.</p>
                                                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                                                    <div className="p-2.5 rounded-lg bg-slate-900/40">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Invoiced</span>
                                                        <span className="font-bold text-sm block mt-0.5 textStrong">₹{totalRevenue}</span>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-emerald-950/20">
                                                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">Collected</span>
                                                        <span className="font-bold text-sm block mt-0.5 text-emerald-400">₹{totalCollected}</span>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-orange-950/20">
                                                        <span className="text-[10px] text-orange-400 uppercase font-bold block">Outstanding</span>
                                                        <span className="font-bold text-sm block mt-0.5 text-orange-400">₹{totalPending}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative flex items-center justify-center p-2">
                                                <svg className="w-36 h-36 transform -rotate-90">
                                                    <circle
                                                        cx="72"
                                                        cy="72"
                                                        r="58"
                                                        className="stroke-slate-200 dark:stroke-slate-800"
                                                        strokeWidth="8"
                                                        fill="transparent"
                                                    />
                                                    <circle
                                                        cx="72"
                                                        cy="72"
                                                        r="58"
                                                        className="stroke-[#14B8A6] transition-all duration-1000 ease-out"
                                                        strokeWidth="10"
                                                        fill="transparent"
                                                        strokeDasharray={2 * Math.PI * 58}
                                                        strokeDashoffset={2 * Math.PI * 58 * (1 - collectionPercentage / 100)}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute flex flex-col items-center">
                                                    <span className="text-2xl font-black textStrong">{collectionPercentage}%</span>
                                                    <span className="text-[9px] uppercase tracking-widest text-slate-400">Collected</span>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className={`${cardBg} p-6`}>
                                            <h3 className="text-md font-bold mb-4 textStrong">Quick Pipeline Diagnostics</h3>
                                            <div className="space-y-3 text-xs">
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span>Select Rate (Applications Approved)</span>
                                                        <span className="font-bold">{statsTotal > 0 ? Math.round((statsApproved / statsTotal) * 100) : 0}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-emerald-500 h-2" style={{ width: `${statsTotal > 0 ? (statsApproved / statsTotal) * 100 : 0}%` }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span>Process Velocity (Under Review)</span>
                                                        <span className="font-bold">{statsTotal > 0 ? Math.round((statsReview / statsTotal) * 100) : 0}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-indigo-400 h-2" style={{ width: `${statsTotal > 0 ? (statsReview / statsTotal) * 100 : 0}%` }}></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span>Holding Queue Ratio</span>
                                                        <span className="font-bold">{statsTotal > 0 ? Math.round((statsHold / statsTotal) * 100) : 0}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                        <div className="bg-purple-400 h-2" style={{ width: `${statsTotal > 0 ? (statsHold / statsTotal) * 100 : 0}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Student CRM Pipeline */}
                            {activeTab === 'crm' && (
                                <div className="space-y-4">
                                    {/* Advanced Search & Multi-Filters Panel */}
                                    <Card className={`${cardBg} p-5 rounded-2xl shadow-none border`}>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between border-b border-[rgba(20,184,166,0.1)] pb-3">
                                                <h3 className="text-sm font-semibold flex items-center gap-2"><Filter className="h-4 w-4 text-[#14B8A6]" /> Filter Admissions Records</h3>
                                                <button onClick={resetFilters} className="text-xs text-[#14B8A6] hover:underline flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Reset Filters</button>
                                            </div>
                                            
                                            {/* Search input */}
                                            <div className="relative w-full">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                <Input
                                                    placeholder="Search Candidate Name, Email, Phone, Enrollment ID, College, City..."
                                                    value={searchQuery}
                                                    onChange={e => setSearchQuery(e.target.value)}
                                                    className={`pl-9 ${inputBg}`}
                                                />
                                            </div>

                                            {/* Filters grid */}
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                                                {/* Course */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Course</label>
                                                    <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`}>
                                                        <option value="all">All Courses</option>
                                                        {uniqueCoursesList.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                {/* Domain */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Domain</label>
                                                    <select value={filterDomain} onChange={e => setFilterDomain(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`}>
                                                        <option value="all">All Domains</option>
                                                        {uniqueDomainsList.map(d => <option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                </div>
                                                {/* Batch */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Batch</label>
                                                    <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`}>
                                                        <option value="all">All Batches</option>
                                                        {batches.map(b => <option key={b._id} value={b._id}>{b.name} ({b.courseName})</option>)}
                                                        <option value="unassigned">Unassigned</option>
                                                    </select>
                                                </div>
                                                {/* Status */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Status</label>
                                                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`}>
                                                        <option value="all">All Statuses</option>
                                                        <option value="New Application">New Application</option>
                                                        <option value="Under Review">Under Review</option>
                                                        <option value="Interview Scheduled">Interview Scheduled</option>
                                                        <option value="Approved">Approved</option>
                                                        <option value="Rejected">Rejected</option>
                                                        <option value="On Hold">On Hold</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                                {/* Payment */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Payment</label>
                                                    <select value={filterPayment} onChange={e => setFilterPayment(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`}>
                                                        <option value="all">All Payment States</option>
                                                        <option value="Unpaid">Unpaid</option>
                                                        <option value="Partially Paid">Partially Paid</option>
                                                        <option value="Paid">Paid</option>
                                                    </select>
                                                </div>
                                                {/* College */}
                                                <div>
                                                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">College</label>
                                                    <select value={filterCollege} onChange={e => setFilterCollege(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`}>
                                                        <option value="all">All Colleges</option>
                                                        {uniqueCollegesList.map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Action Header Table controls */}
                                    <div className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                                        <span className="text-xs font-semibold text-slate-400">Displaying <strong className="text-white">{filteredStudents.length}</strong> records</span>
                                        <Button onClick={handleExportCSV} variant="outline" size="sm" className={`gap-2 ${btnSecondary}`}>
                                            <Download className="h-4.5 w-4.5" /> Export CRM CSV
                                        </Button>
                                    </div>

                                    {/* Student CRM Table */}
                                    <Card className={`overflow-hidden border ${cardBg}`}>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                                <thead>
                                                    <tr className={`border-b text-xs font-bold uppercase tracking-wider ${tableHeader}`}>
                                                        <th className="px-5 py-4">Student Profile</th>
                                                        <th className="px-5 py-4">Program & Batch</th>
                                                        <th className="px-5 py-4">Financial Log</th>
                                                        <th className="px-5 py-4">Status Pipe</th>
                                                        <th className="px-5 py-4 text-right">CRM Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`divide-y divide-slate-100 text-xs ${isDark ? 'divide-[rgba(255,255,255,0.05)] text-[#D1D5DB]' : 'text-slate-700'}`}>
                                                    {filteredStudents.length > 0 ? (
                                                        filteredStudents.map(student => (
                                                            <tr key={student._id} className={`transition-colors duration-200 ${tableRowBase}`}>
                                                                <td className="px-5 py-4">
                                                                    <div className="flex flex-col gap-0.5">
                                                                        <span className={`font-bold text-sm leading-tight ${primaryText}`}>{student.full_name}</span>
                                                                        <span className="text-slate-400 text-xs">{student.email}</span>
                                                                        <span className="text-[10px] text-slate-500 font-mono mt-1 px-1.5 py-0.5 bg-slate-950/30 rounded inline-block w-fit">{student.enrollment_id || 'ID Pending'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="font-semibold text-blue-500 dark:text-[#14B8A6]">{student.course_name}</span>
                                                                        {student.domain && <span className="text-[10px] text-slate-400">Domain: {student.domain}</span>}
                                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded w-fit ${student.batch_id ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/10'}`}>
                                                                            {student.batch_selected || 'Unassigned'}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className={`font-bold ${primaryText}`}>Paid: ₹{student.amount_paid || 0}</span>
                                                                        <span className="text-[10px] text-slate-400">Bal: ₹{student.remaining_balance || 0} (Fee: ₹{student.program_fee || 0})</span>
                                                                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded w-fit ${
                                                                            student.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                                                            student.payment_status === 'Partially Paid' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                                                        }`}>
                                                                            {student.payment_status}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-4">
                                                                    <div className="flex flex-col gap-2">
                                                                        {/* Dynamic Status Dropdown */}
                                                                        <select
                                                                            value={student.status}
                                                                            onChange={e => handleStatusChange(student._id, e.target.value)}
                                                                            className={`p-1.5 rounded-lg border text-xs font-bold ${
                                                                                student.status === 'Approved' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/30' :
                                                                                student.status === 'Rejected' ? 'bg-red-950/30 text-red-400 border-red-500/30' :
                                                                                student.status === 'On Hold' ? 'bg-purple-950/30 text-purple-400 border-purple-500/30' :
                                                                                'bg-slate-900/80 text-slate-300 border-slate-700'
                                                                            }`}
                                                                        >
                                                                            <option value="New Application">New Application</option>
                                                                            <option value="Under Review">Under Review</option>
                                                                            <option value="Interview Scheduled">Interview Scheduled</option>
                                                                            <option value="Approved">Approved</option>
                                                                            <option value="Rejected">Rejected</option>
                                                                            <option value="On Hold">On Hold</option>
                                                                            <option value="Completed">Completed</option>
                                                                        </select>
                                                                        
                                                                        {/* Notification status badges */}
                                                                        <div className="flex gap-2 text-[9px] text-slate-500">
                                                                            <span className="flex items-center gap-0.5">
                                                                                <Mail className="h-2.5 w-2.5" /> Email: 
                                                                                <strong className={student.email_status === 'Sent' ? 'text-emerald-500' : 'text-slate-400'}>{student.email_status || 'Not Sent'}</strong>
                                                                            </span>
                                                                            <span className="flex items-center gap-0.5">
                                                                                <MessageSquare className="h-2.5 w-2.5" /> WA: 
                                                                                <strong className={student.whatsapp_status === 'Sent' ? 'text-emerald-500' : 'text-slate-400'}>{student.whatsapp_status || 'Not Sent'}</strong>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-5 py-4 text-right">
                                                                    <div className="flex justify-end gap-1.5">
                                                                        {/* Slide panel drawer trigger */}
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-500/10" onClick={() => handleOpenProfileDrawer(student)} title="Open Profile Drawer">
                                                                            <Eye className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                        {/* Edit student details form */}
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-indigo-400 hover:bg-indigo-500/10" onClick={() => handleOpenEdit(student)} title="Edit Student Profile">
                                                                            <Edit className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                        {/* Assign Batch Modal trigger */}
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10" onClick={() => handleOpenBatchAssign(student)} title="Assign Academic Batch">
                                                                            <UserCheck className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                        {/* Admission Letter downloads */}
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-500/10" onClick={() => triggerAdmissionLetterPreview(student._id)} title="Preview Admission Letter PDF">
                                                                            <FileText className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500 hover:bg-amber-500/10" onClick={() => triggerAdmissionLetterEmail(student._id)} title="Email Admission Letter (PDF Attachment)">
                                                                            <Mail className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(student._id)} title="Delete Candidate Record">
                                                                            <Trash2 className="h-4.5 w-4.5" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={5} className="px-5 py-12 text-center text-slate-500">No applicants found matching filter query.</td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* Tab 3: Batch Management */}
                            {activeTab === 'batches' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Create New Batch Column */}
                                    <div className="lg:col-span-1 space-y-4">
                                        <Card className={`${cardBg} p-5 rounded-2xl border`}>
                                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 textStrong"><Plus className="h-5 w-5 text-[#14B8A6]" /> Create New Batch</h3>
                                            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-semibold">Batch Identifier Name *</label>
                                                    <Input placeholder="e.g. Batch Alpha, Batch B" value={newBatchName} onChange={e => setNewBatchName(e.target.value)} required className={inputBg} />
                                                </div>
                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-semibold">Associated Program *</label>
                                                    <select value={newBatchCourse} onChange={e => setNewBatchCourse(e.target.value)} required className={`w-full p-2 rounded-lg ${inputBg}`}>
                                                        <option value="">Select program...</option>
                                                        <option value="SQL Language">SQL Language</option>
                                                        <option value="Core Python">Core Python</option>
                                                        <option value="Augmented Reality">Augmented Reality</option>
                                                        <option value="Digital Marketing">Digital Marketing</option>
                                                        <option value="Foundation Tech Program">Foundation Tech Program</option>
                                                        <option value="Advanced AI & Data Science">Advanced AI & Data Science</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-semibold">Assigned Faculty</label>
                                                    <Input placeholder="e.g. Dr. Sen" value={newBatchFaculty} onChange={e => setNewBatchFaculty(e.target.value)} className={inputBg} />
                                                </div>
                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-semibold">Seat Capacity *</label>
                                                    <Input type="number" min="1" max="500" value={newBatchCapacity} onChange={e => setNewBatchCapacity(parseInt(e.target.value))} required className={inputBg} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-semibold">Start Date *</label>
                                                        <Input type="date" value={newBatchStart} onChange={e => setNewBatchStart(e.target.value)} required className={inputBg} />
                                                    </div>
                                                    <div>
                                                        <label className="text-slate-400 block mb-1 font-semibold">End Date *</label>
                                                        <Input type="date" value={newBatchEnd} onChange={e => setNewBatchEnd(e.target.value)} required className={inputBg} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-semibold">Initial Status</label>
                                                    <select value={newBatchStatus} onChange={e => setNewBatchStatus(e.target.value as any)} className={`w-full p-2 rounded-lg ${inputBg}`}>
                                                        <option value="Upcoming">Upcoming</option>
                                                        <option value="Ongoing">Ongoing</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-slate-400 block mb-1 font-semibold">Custom Notes</label>
                                                    <textarea placeholder="Schedule links or remarks..." rows={3} value={newBatchNotes} onChange={e => setNewBatchNotes(e.target.value)} className={`w-full p-2 text-xs rounded-lg ${inputBg}`} />
                                                </div>
                                                <Button type="submit" className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white">Initialize Batch</Button>
                                            </form>
                                        </Card>
                                    </div>

                                    {/* Active/Inactive Batches Grid Column */}
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-bold textStrong">Active Academic Batches</h3>
                                            <span className="text-xs text-slate-400">{batches.length} batches recorded</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {batches.map(batch => {
                                                const enrolledCount = batch.studentsAssigned?.length || 0;
                                                const capacityPercent = Math.min(100, Math.round((enrolledCount / batch.capacity) * 100));
                                                const isExpanded = expandedBatchId === batch._id;

                                                return (
                                                    <Card key={batch._id} className={`${cardBg} ${cardShadow} flex flex-col justify-between`}>
                                                        <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start space-y-0">
                                                            <div>
                                                                <CardTitle className="text-md font-bold textStrong">{batch.name}</CardTitle>
                                                                <p className="text-xs text-blue-500 mt-0.5">{batch.courseName}</p>
                                                            </div>
                                                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                                                                batch.status === 'Ongoing' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' :
                                                                batch.status === 'Completed' ? 'bg-slate-950 text-slate-400 border border-slate-800' :
                                                                'bg-amber-950 text-amber-400 border border-amber-500/20'
                                                            }`}>
                                                                {batch.status}
                                                            </span>
                                                        </CardHeader>
                                                        
                                                        <CardContent className="p-4 pt-1 space-y-3 text-xs flex-grow">
                                                            <div className="space-y-1 text-slate-400">
                                                                {batch.facultyAssigned && <p><strong>Faculty:</strong> {batch.facultyAssigned}</p>}
                                                                <p><strong>Timeline:</strong> {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}</p>
                                                                {batch.notes && <p className="italic text-slate-500 mt-1">"{batch.notes}"</p>}
                                                            </div>

                                                            {/* Capacity meter */}
                                                            <div>
                                                                <div className="flex justify-between text-[10px] mb-1 font-semibold">
                                                                    <span>Enrolled Strength</span>
                                                                    <span>{enrolledCount} / {batch.capacity} Students ({capacityPercent}%)</span>
                                                                </div>
                                                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                                                    <div className={`h-full ${capacityPercent >= 90 ? 'bg-red-500' : capacityPercent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${capacityPercent}%` }}></div>
                                                                </div>
                                                            </div>

                                                            {/* Expand Assigned Students details */}
                                                            <div>
                                                                <button
                                                                    onClick={() => setExpandedBatchId(isExpanded ? null : batch._id)}
                                                                    className="w-full text-left p-1 text-[10px] text-[#14B8A6] hover:underline font-bold flex items-center justify-between"
                                                                >
                                                                    <span>{isExpanded ? 'Hide' : 'View'} Enrolled Student List ({enrolledCount})</span>
                                                                    <ChevronRight className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                                                </button>
                                                                
                                                                {isExpanded && (
                                                                    <div className="mt-2 p-2 bg-slate-950/40 rounded-lg border border-slate-900 max-h-40 overflow-y-auto space-y-1">
                                                                        {batch.studentsAssigned && batch.studentsAssigned.length > 0 ? (
                                                                            batch.studentsAssigned.map(s => (
                                                                                <div 
                                                                                    key={s._id} 
                                                                                    onClick={() => handleOpenProfileDrawer(s)}
                                                                                    className="flex justify-between items-center text-[10px] p-1 rounded hover:bg-[#14B8A6]/10 cursor-pointer text-slate-300 hover:text-white"
                                                                                >
                                                                                    <span>{s.full_name}</span>
                                                                                    <span className="font-mono text-slate-500">{s.enrollment_id}</span>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <p className="text-[10px] text-slate-600 text-center py-2">No students assigned to this batch yet.</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>

                                                        {/* Delete batch footer */}
                                                        <div className="p-4 pt-0 border-t border-slate-800/20 mt-auto flex justify-end">
                                                            <Button onClick={() => handleDeleteBatch(batch._id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-500/10 hover:text-red-400 gap-1 text-[10px] px-2 h-7 mt-2">
                                                                <Trash2 className="h-3 w-3" /> Remove Batch
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                );
                                            })}
                                            {batches.length === 0 && (
                                                <div className="col-span-2 text-center text-slate-500 py-12">No batches currently set up. Fill in the form to initialize one.</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 4: Syllabus Settings */}
                            {activeTab === 'syllabus' && (
                                <Card className={`border ${cardBg}`}>
                                    <CardHeader className="py-5 border-b border-[rgba(13,148,136,0.1)]">
                                        <CardTitle className={`text-lg ${titleClr}`}>Syllabus Public Download Access Control</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse whitespace-nowrap">
                                                <thead>
                                                    <tr className={`border-b text-xs uppercase font-semibold ${tableHeader}`}>
                                                        <th className="px-6 py-4">Course Title</th>
                                                        <th className="px-6 py-4 text-right">PDF Download Control Toggle</th>
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
                                                                    {course.syllabus_download_enabled ? "Enabled (Public)" : "Disabled (Restricted)"}
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
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* View Profile Sliding Side Drawer */}
            {drawerOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}>
                    <div 
                        className={`w-full max-w-2xl h-screen overflow-y-auto shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300 ${isDark ? 'bg-[#0D1515] border-l border-[rgba(20,184,166,0.15)] text-[#E6FFFA]' : 'bg-white border-l border-slate-200 text-slate-900'}`}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="flex justify-between items-start pb-4 border-b border-[rgba(20,184,166,0.1)]">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedStudent.full_name}</h2>
                                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{selectedStudent.enrollment_id || 'Generating ID...'}</p>
                            </div>
                            <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="py-6 space-y-6 text-xs flex-grow">
                            
                            {/* Personal Details */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><User className="h-4 w-4" /> Personal Information</h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-800/40">
                                    <div><span className="text-slate-500 block">Full Name</span><strong className="text-sm">{selectedStudent.full_name}</strong></div>
                                    <div><span className="text-slate-500 block">Email Address</span><strong className="text-sm">{selectedStudent.email}</strong></div>
                                    <div><span className="text-slate-500 block">Mobile Phone</span><strong className="text-sm">{selectedStudent.phone}</strong></div>
                                    <div><span className="text-slate-500 block">WhatsApp Number</span><strong className="text-sm">{selectedStudent.whatsapp_number || selectedStudent.phone}</strong></div>
                                    <div><span className="text-slate-500 block">Date of Birth</span><strong className="text-sm">{selectedStudent.dob || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Gender</span><strong className="text-sm">{selectedStudent.gender || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">City</span><strong className="text-sm">{selectedStudent.city || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">State</span><strong className="text-sm">{selectedStudent.state || 'N/A'}</strong></div>
                                </div>
                            </div>

                            {/* Academic Details */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> Academic Profile</h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-800/40">
                                    <div className="col-span-2"><span className="text-slate-500 block">College Name</span><strong className="text-sm">{selectedStudent.college_name || 'N/A'}</strong></div>
                                    <div className="col-span-2"><span className="text-slate-500 block">University</span><strong className="text-sm">{selectedStudent.university || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Degree</span><strong className="text-sm">{selectedStudent.degree || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Branch</span><strong className="text-sm">{selectedStudent.branch || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Semester / Year</span><strong className="text-sm">{selectedStudent.semester ? `Sem ${selectedStudent.semester}` : 'N/A'} ({selectedStudent.year_of_study || 'N/A'})</strong></div>
                                    <div><span className="text-slate-500 block">Graduation Year</span><strong className="text-sm">{selectedStudent.graduation_year || 'N/A'}</strong></div>
                                    <div className="col-span-2"><span className="text-slate-500 block">Highest Qualification</span><strong className="text-sm">{selectedStudent.qualification || 'N/A'}</strong></div>
                                </div>
                            </div>

                            {/* Program & Financials */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> Program & Financials</h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-800/40">
                                    <div><span className="text-slate-500 block">Selected Course</span><strong className="text-sm text-blue-500">{selectedStudent.course_name}</strong></div>
                                    <div><span className="text-slate-500 block">Domain Selected</span><strong className="text-sm text-indigo-400">{selectedStudent.domain || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Assigned Batch</span><strong className="text-sm">{selectedStudent.batch_selected || 'Unassigned'}</strong></div>
                                    <div><span className="text-slate-500 block">Enrollment Date</span><strong className="text-sm">{selectedStudent.enrollment_date ? new Date(selectedStudent.enrollment_date).toLocaleString() : 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Program Fee Invoice</span><strong className="text-sm">₹{selectedStudent.program_fee || 0}</strong></div>
                                    <div><span className="text-slate-500 block">Total Amount Paid</span><strong className="text-sm text-emerald-400">₹{selectedStudent.amount_paid || 0}</strong></div>
                                    <div><span className="text-slate-500 block">Remaining Balance</span><strong className="text-sm text-orange-400">₹{selectedStudent.remaining_balance || 0}</strong></div>
                                    <div>
                                        <span className="text-slate-500 block mb-1">Payment Status</span>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                            selectedStudent.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                            selectedStudent.payment_status === 'Partially Paid' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                                            'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                            {selectedStudent.payment_status}
                                        </span>
                                    </div>
                                    {selectedStudent.message && (
                                        <div className="col-span-2 border-t border-slate-800/40 pt-2">
                                            <span className="text-slate-500 block">Student Message</span>
                                            <p className="italic text-slate-300 mt-1">"{selectedStudent.message}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Admission Offer Letter Generator */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><FileText className="h-4 w-4" /> Admission Letter controls</h4>
                                <div className="flex flex-wrap gap-2 bg-slate-950/20 p-4 rounded-xl border border-slate-800/40 justify-start">
                                    <Button onClick={() => triggerAdmissionLetterPreview(selectedStudent._id)} variant="outline" size="sm" className={btnSecondary}>
                                        <Eye className="h-3.5 w-3.5 mr-1.5" /> Preview PDF Letter
                                    </Button>
                                    <Button onClick={() => triggerAdmissionLetterDownload(selectedStudent._id)} variant="outline" size="sm" className={btnSecondary}>
                                        <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF File
                                    </Button>
                                    <Button onClick={() => triggerAdmissionLetterEmail(selectedStudent._id)} variant="outline" size="sm" className="bg-[#14B8A6]/20 border border-[#14B8A6]/30 text-[#99F6E4] hover:bg-[#14B8A6]/30">
                                        <Mail className="h-3.5 w-3.5 mr-1.5" /> Send PDF via Email
                                    </Button>
                                </div>
                            </div>

                            {/* Communication logs */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Communication Logs</h4>
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {selectedStudent.communication_history && selectedStudent.communication_history.length > 0 ? (
                                        selectedStudent.communication_history.slice().reverse().map((comm, idx) => (
                                            <div key={comm._id || idx} className="p-3 bg-slate-950/30 rounded-lg border border-slate-900/60 space-y-1">
                                                <div className="flex justify-between font-bold">
                                                    <span className="uppercase text-[9px] text-[#14B8A6]">{comm.type} Log</span>
                                                    <span className="text-[9px] text-slate-500">{new Date(comm.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="font-semibold text-slate-200">{comm.subject}</p>
                                                <p className="text-slate-400 whitespace-pre-wrap">{comm.message}</p>
                                                <div className="text-[9px] text-slate-500 pt-1 flex justify-between">
                                                    <span>By: {comm.sender}</span>
                                                    <span className="text-emerald-500">{comm.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-600 text-center py-4 bg-slate-950/20 rounded-lg">No communication logs recorded yet.</p>
                                    )}
                                </div>

                                {/* Custom Email Dispatch form */}
                                <form onSubmit={handleSendCustomEmail} className="space-y-2 mt-4 pt-3 border-t border-slate-800/40">
                                    <h5 className="font-bold text-xs">Compose & Send Custom Email</h5>
                                    <Input placeholder="Email Subject Title" value={customEmailSubject} onChange={e => setCustomEmailSubject(e.target.value)} required className={inputBg} />
                                    <textarea placeholder="Write email body text..." rows={3} value={customEmailMessage} onChange={e => setCustomEmailMessage(e.target.value)} required className={`w-full p-2 text-xs rounded-lg ${inputBg}`} />
                                    <Button type="submit" size="sm" disabled={emailSending} className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white flex gap-1 items-center justify-center">
                                        <Send className="h-3.5 w-3.5" /> {emailSending ? 'Sending Custom Email...' : 'Dispatch Email'}
                                    </Button>
                                </form>
                            </div>

                            {/* Internal Admin notes */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><Clock className="h-4 w-4" /> Internal Admin Notes Thread</h4>
                                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                    {selectedStudent.admin_notes && selectedStudent.admin_notes.length > 0 ? (
                                        selectedStudent.admin_notes.slice().reverse().map((note, idx) => (
                                            <div key={note._id || idx} className="p-3 bg-slate-950/30 rounded-lg border border-slate-900/60">
                                                <div className="flex justify-between items-center mb-1 text-[9px] text-slate-500">
                                                    <span className="font-bold">{note.author}</span>
                                                    <span>{new Date(note.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-slate-300 font-medium whitespace-pre-wrap">{note.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-600 text-center py-4 bg-slate-950/20 rounded-lg">No admin notes logged for this student yet.</p>
                                    )}
                                </div>
                                <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
                                    <Input placeholder="Type internal remark note..." value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} required className={inputBg} />
                                    <Button type="submit" size="sm" className="bg-[#14B8A6] hover:bg-[#0D9488] text-white">Save Note</Button>
                                </form>
                            </div>

                            {/* Status history log */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><Activity className="h-4 w-4" /> Admission Status Timeline Log</h4>
                                <div className="relative pl-4 border-l border-slate-800 space-y-4">
                                    {selectedStudent.status_history && selectedStudent.status_history.length > 0 ? (
                                        selectedStudent.status_history.map((hist, idx) => (
                                            <div key={hist._id || idx} className="relative">
                                                <div className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-[#14B8A6]"></div>
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-white text-xs">{hist.status}</span>
                                                    <span className="text-[9px] text-slate-500">{new Date(hist.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-0.5">Updated by: {hist.updatedBy}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-slate-600 text-center py-2">No historical logs recorded. First initial state set upon enrollment.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Profile Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)}>
                    <Card className={`w-full max-w-2xl h-[90vh] overflow-y-auto shadow-2xl border ${isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.3)]' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
                        <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg textStrong">Edit Student Admissions Record</CardTitle>
                            <button onClick={() => setEditModalOpen(false)} className="text-slate-500 hover:text-slate-300 text-xl font-bold">&times;</button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleEditFormSubmit} className="space-y-6 text-xs">
                                
                                {/* Personal Group */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#14B8A6] border-b border-slate-800 pb-1">1. Personal Information</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-slate-400 block mb-1">Full Name</label>
                                            <Input value={editForm.full_name || ''} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} required className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Email Address</label>
                                            <Input type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Mobile Phone</label>
                                            <Input value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} required className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">WhatsApp Number</label>
                                            <Input value={editForm.whatsapp_number || ''} onChange={e => setEditForm({ ...editForm, whatsapp_number: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Date of Birth</label>
                                            <Input value={editForm.dob || ''} onChange={e => setEditForm({ ...editForm, dob: e.target.value })} placeholder="e.g. YYYY-MM-DD" className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Gender</label>
                                            <Input value={editForm.gender || ''} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} placeholder="Male, Female, Other" className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">City</label>
                                            <Input value={editForm.city || ''} onChange={e => setEditForm({ ...editForm, city: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">State</label>
                                            <Input value={editForm.state || ''} onChange={e => setEditForm({ ...editForm, state: e.target.value })} className={inputBg} />
                                        </div>
                                    </div>
                                </div>

                                {/* Academic Group */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#14B8A6] border-b border-slate-800 pb-1">2. Academic Credentials</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="text-slate-400 block mb-1">College Name</label>
                                            <Input value={editForm.college_name || ''} onChange={e => setEditForm({ ...editForm, college_name: e.target.value })} className={inputBg} />
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="text-slate-400 block mb-1">University</label>
                                            <Input value={editForm.university || ''} onChange={e => setEditForm({ ...editForm, university: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Degree Title</label>
                                            <Input value={editForm.degree || ''} onChange={e => setEditForm({ ...editForm, degree: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Branch / Major</label>
                                            <Input value={editForm.branch || ''} onChange={e => setEditForm({ ...editForm, branch: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Academic Semester</label>
                                            <Input value={editForm.semester || ''} onChange={e => setEditForm({ ...editForm, semester: e.target.value })} placeholder="e.g. 6" className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Year of Study</label>
                                            <Input value={editForm.year_of_study || ''} onChange={e => setEditForm({ ...editForm, year_of_study: e.target.value })} placeholder="e.g. 3rd Year" className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Graduation Year</label>
                                            <Input value={editForm.graduation_year || ''} onChange={e => setEditForm({ ...editForm, graduation_year: e.target.value })} placeholder="e.g. 2027" className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Highest Qualification</label>
                                            <Input value={editForm.qualification || ''} onChange={e => setEditForm({ ...editForm, qualification: e.target.value })} className={inputBg} />
                                        </div>
                                    </div>
                                </div>

                                {/* Financials & Program Group */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#14B8A6] border-b border-slate-800 pb-1">3. Course Registration & Payments</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-slate-400 block mb-1">Selected Program Course</label>
                                            <Input value={editForm.course_name || ''} onChange={e => setEditForm({ ...editForm, course_name: e.target.value })} required className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Selected Domain Spec</label>
                                            <Input value={editForm.domain || ''} onChange={e => setEditForm({ ...editForm, domain: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Course Duration (e.g. 3 Months)</label>
                                            <Input value={editForm.course_duration || ''} onChange={e => setEditForm({ ...editForm, course_duration: e.target.value })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Total Program Fee (₹)</label>
                                            <Input type="number" value={editForm.program_fee || 0} onChange={e => setEditForm({ ...editForm, program_fee: parseInt(e.target.value) || 0 })} className={inputBg} />
                                        </div>
                                        <div>
                                            <label className="text-slate-400 block mb-1">Tuition Amount Paid (₹)</label>
                                            <Input type="number" value={editForm.amount_paid || 0} onChange={e => setEditForm({ ...editForm, amount_paid: parseInt(e.target.value) || 0 })} className={inputBg} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                                    <Button type="button" onClick={() => setEditModalOpen(false)} variant="outline" className={btnSecondary}>Cancel</Button>
                                    <Button type="submit" className="bg-[#14B8A6] text-white hover:bg-[#0D9488]">Save Admissions Changes</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Assign Batch Modal */}
            {batchAssignModalOpen && batchAssignStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm" onClick={() => setBatchAssignModalOpen(false)}>
                    <Card className={`w-full max-w-md shadow-2xl border ${isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.3)]' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
                        <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-md textStrong">Modify Batch Assignment</CardTitle>
                            <button onClick={() => setBatchAssignModalOpen(false)} className="text-slate-500 hover:text-slate-300 text-xl font-bold">&times;</button>
                        </CardHeader>
                        <CardContent className="p-5">
                            <form onSubmit={handleAssignBatchSubmit} className="space-y-4 text-xs">
                                <p className="text-slate-400">Re-assign academic cohort/batch for student <strong className="text-white">{batchAssignStudent.full_name}</strong>.</p>
                                
                                <div>
                                    <label className="text-slate-400 block mb-1 font-semibold">Select Cohort Batch</label>
                                    <select
                                        value={selectedBatchId}
                                        onChange={e => setSelectedBatchId(e.target.value)}
                                        className={`w-full p-2.5 rounded-lg text-xs ${inputBg}`}
                                    >
                                        <option value="">-- No Cohort Assigned (Unassigned) --</option>
                                        {batches
                                            .filter(b => b.courseName === batchAssignStudent.course_name || b.isActive)
                                            .map(b => (
                                                <option key={b._id} value={b._id}>{b.name} ({b.courseName}) - Enrolled: {b.studentsAssigned?.length || 0} / {b.capacity}</option>
                                            ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800/40">
                                    <Button type="button" onClick={() => setBatchAssignModalOpen(false)} variant="outline" className={btnSecondary}>Cancel</Button>
                                    <Button type="submit" className="bg-[#14B8A6] text-white hover:bg-[#0D9488]">Save Cohort Assignment</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default AdminDashboard;
