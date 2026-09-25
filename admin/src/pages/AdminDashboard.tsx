import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';
import { useTheme } from '@/contexts/ThemeContext';
import logo from '@/assets/edsec-logo-new.png';
import {
    Search, Download, Trash2, Eye, LayoutDashboard, Users, CreditCard, CheckCircle,
    LogOut, Edit, Plus, Mail, MessageSquare, Filter, X, ChevronRight, Clock, Award,
    BookOpen, AlertCircle, Calendar, MapPin, User, GraduationCap, DollarSign, UserCheck,
    Settings, RefreshCw, Send, ArrowRight, Menu, FileText, Activity, Sun, Moon,
    Bell, Sparkles, Phone
} from 'lucide-react';

const getApiUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL;
    if (!envUrl || envUrl.includes('your-edsec-backend') || (envUrl.includes('localhost') && window.location.hostname !== 'localhost')) {
        return '/api';
    }
    return envUrl + '/api';
};
const API_URL = getApiUrl();

const PREWRITTEN_TEMPLATES = [
    {
        name: "Admission Offer Letter Notification",
        subject: "🎉 Welcome to EdSec Innovations - Official Admission Offer Letter",
        message: "Dear candidate,\n\nWe are pleased to inform you that your enrollment has been approved! Attached to this email is your official Admission Offer Letter detailing your course information and onboarding schedule.\n\nPlease review it and complete your fee payment at your earliest convenience.\n\nWarm regards,\nEdSec Admissions Committee"
    },
    {
        name: "Document Verification Request",
        subject: "Action Required: Document Verification for EdSec Enrollment",
        message: "Dear candidate,\n\nOur team is currently reviewing your registration. To proceed with your cohort assignment, please reply to this email with copies of your:\n1. Latest college marksheet or degree certificate\n2. Aadhaar / Govt photo ID proof\n\nPlease submit these documents within 48 hours.\n\nBest regards,\nEdSec Admissions Team"
    },
    {
        name: "Fee Installment Reminder",
        subject: "Reminder: Upcoming Program Fee Installment Payment Due",
        message: "Dear candidate,\n\nThis is a friendly reminder that your next program fee installment is due soon. Kindly make the payment of your pending balance to avoid any disruption to your classes or portal access.\n\nIf you have already paid, please ignore this email and send us the payment receipt screenshot.\n\nRegards,\nEdSec Finance Department"
    }
];

const WHATSAPP_TEMPLATES = [
    {
        name: "🔔 Fee Payment Reminder",
        text: "Hi! This is a friendly reminder from EdSec Innovations that your next installment is due. Please complete the payment to proceed with your classes. Thank you!"
    },
    {
        name: "📄 Onboarding Documents",
        text: "Hi! To complete your enrollment, please share your college ID card, graduation year proof, and marksheet. Let us know if you need any help!"
    },
    {
        name: "🚀 Batch Commencement",
        text: "Hi! Exciting news — your assigned cohort is scheduled to start classes next week. Get ready to kickstart your tech journey!"
    }
];

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
    follow_up_date?: string;
    installments?: {
        _id?: string;
        amount: number;
        dueDate: string;
        status: 'Pending' | 'Paid';
    }[];
    attendance?: {
        _id?: string;
        date: string;
        present: boolean;
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

interface BrochureLead {
    _id: string;
    name: string;
    email: string;
    phone: string;
    programId: string;
    verified: boolean;
    downloadTokenUsed: boolean;
    createdAt: string;
    twoFactorSessionId?: string;
}

interface DemoBookingItem {
    _id: string;
    name: string;
    phone: string;
    email: string;
    preferredDate: string;
    preferredTime: string;
    programInterest?: string;
    status: 'New' | 'Contacted' | 'Scheduled' | 'Completed';
    createdAt: string;
}

const PROGRAM_TITLES_MAP: Record<string, string> = {
    'full-stack-web-dev': 'Full Stack Web Development',
    'generative-ai': 'Generative AI',
    'python-ai-ml': 'Python with AI/ML',
    'git-resume': 'Git & Resume'
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    
    // Tab Navigation State
    const [activeTab, setActiveTab] = useState<'analytics' | 'crm' | 'batches' | 'syllabus' | 'brochures' | 'demos'>('crm');

    // Data States
    const [students, setStudents] = useState<Student[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [dbCourses, setDbCourses] = useState<CourseDb[]>([]);
    const [brochureLeads, setBrochureLeads] = useState<BrochureLead[]>([]);
    const [demoBookings, setDemoBookings] = useState<DemoBookingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingLeads, setLoadingLeads] = useState(false);
    const [loadingDemos, setLoadingDemos] = useState(false);

    // Notifications bell state
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
        const stored = localStorage.getItem('admin_last_read_notifications');
        return stored ? parseInt(stored, 10) : 0;
    });

    // Demo Requests Filters
    const [demoSearchQuery, setDemoSearchQuery] = useState('');
    const [demoFilterStatus, setDemoFilterStatus] = useState('all');
    const [demoFilterProgram, setDemoFilterProgram] = useState('all');

    // Brochure Leads Filters
    const [leadSearchQuery, setLeadSearchQuery] = useState('');
    const [leadFilterProgram, setLeadFilterProgram] = useState('all');
    const [leadFilterVerified, setLeadFilterVerified] = useState('all');
    const [leadFilterDownloaded, setLeadFilterDownloaded] = useState('all');

    // Advanced Search & Multi-Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCourse, setFilterCourse] = useState('all');
    const [filterDomain, setFilterDomain] = useState('all');
    const [filterBatch, setFilterBatch] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
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

    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(['profile', 'program', 'financial', 'status', 'actions']);
    const [editingCell, setEditingCell] = useState<{ id: string, field: string } | null>(null);
    const [editingValue, setEditingValue] = useState<string>('');
    const [attachOfferLetter, setAttachOfferLetter] = useState(false);
    const [manualAttachment, setManualAttachment] = useState<{ filename: string; content: string; contentType: string } | null>(null);
    const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
    
    // Installments editing state
    const [tempInstallments, setTempInstallments] = useState<{ amount: number; dueDate: string; status: 'Pending' | 'Paid' }[]>([]);
    
    // Attendance states
    const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const getToken = () => localStorage.getItem('adminToken') || '';

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        toast.success('Logged out successfully.');
        navigate('/admin-login');
    };

    useEffect(() => {
        fetchInitialData();
        // 45-second polling interval for real-time notifications & fresh leads/demo requests
        const interval = setInterval(() => {
            fetchStudents(false);
            fetchDemoBookings(false);
            fetchBrochureLeads(false);
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchStudents(),
                fetchBatches(),
                fetchCourses(),
                fetchBrochureLeads(),
                fetchDemoBookings()
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDemoBookings = async (showLoading = true) => {
        if (showLoading) setLoadingDemos(true);
        try {
            const res = await axios.get(`${API_URL}/demo-bookings`, {
                headers: { 
                    Authorization: `Bearer ${getToken()}`,
                    'x-auth-token': getToken()
                }
            });
            if (res.data && res.data.bookings) {
                setDemoBookings(res.data.bookings);
            }
        } catch (err: any) {
            console.error('Failed to fetch demo bookings', err);
        } finally {
            if (showLoading) setLoadingDemos(false);
        }
    };

    const handleDemoStatusChange = async (id: string, status: string) => {
        try {
            await axios.patch(
                `${API_URL}/demo-bookings/${id}`,
                { status },
                {
                    headers: { 
                        Authorization: `Bearer ${getToken()}`,
                        'x-auth-token': getToken()
                    }
                }
            );
            setDemoBookings(prev => prev.map(b => b._id === id ? { ...b, status: status as any } : b));
            toast.success(`Demo booking marked as ${status}`);
        } catch (err: any) {
            console.error('Failed to update demo booking status', err);
            toast.error(err.response?.data?.message || 'Could not update status.');
        }
    };

    const handleDeleteDemoBooking = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete the demo request for "${name}"?`)) return;
        try {
            await axios.delete(`${API_URL}/demo-bookings/${id}`, {
                headers: { 
                    Authorization: `Bearer ${getToken()}`,
                    'x-auth-token': getToken()
                }
            });
            setDemoBookings(prev => prev.filter(b => b._id !== id));
            toast.success('Demo booking deleted.');
        } catch (err: any) {
            console.error('Failed to delete demo booking', err);
            toast.error('Could not delete demo booking.');
        }
    };

    const handleOpenNotifications = () => {
        setNotificationOpen(prev => !prev);
        const now = Date.now();
        setLastReadTimestamp(now);
        localStorage.setItem('admin_last_read_notifications', String(now));
    };

    const fetchBrochureLeads = async () => {
        setLoadingLeads(true);
        try {
            const res = await axios.get(`${API_URL}/brochures/leads`, {
                headers: { 
                    Authorization: `Bearer ${getToken()}`,
                    'x-auth-token': getToken()
                }
            });
            if (res.data && res.data.leads) {
                setBrochureLeads(res.data.leads);
            }
        } catch (err: any) {
            console.error('Failed to fetch brochure leads', err);
            toast.error('Could not load brochure download leads.');
        } finally {
            setLoadingLeads(false);
        }
    };

    const handleDeleteLead = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete the brochure download record for "${name}"?`)) return;
        try {
            await axios.delete(`${API_URL}/brochures/leads/${id}`, {
                headers: { 
                    Authorization: `Bearer ${getToken()}`,
                    'x-auth-token': getToken()
                }
            });
            setBrochureLeads(prev => prev.filter(l => l._id !== id));
            toast.success('Brochure lead deleted successfully');
        } catch (err: any) {
            console.error('Failed to delete lead', err);
            toast.error('Could not delete lead');
        }
    };

    const exportLeadsToCSV = () => {
        if (!brochureLeads.length) {
            toast.error('No leads available to export.');
            return;
        }
        const headers = ['Name', 'Email', 'Phone', 'Program Requested', 'SMS OTP Verified', 'Brochure Downloaded', 'Requested At'];
        const rows = brochureLeads.map(l => [
            `"${(l.name || '').replace(/"/g, '""')}"`,
            `"${(l.email || '').replace(/"/g, '""')}"`,
            `"${l.phone || ''}"`,
            `"${(PROGRAM_TITLES_MAP[l.programId] || l.programId || '').replace(/"/g, '""')}"`,
            l.verified ? 'Yes' : 'No',
            l.downloadTokenUsed ? 'Yes' : 'No',
            `"${new Date(l.createdAt).toLocaleString()}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `EdSec_Brochure_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Brochure leads exported to CSV!');
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
                { 
                    subject: customEmailSubject, 
                    message: customEmailMessage, 
                    adminName: 'Admin Partner', 
                    attachOfferLetter,
                    manualAttachment
                },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Custom email sent successfully and logged.');
            setCustomEmailSubject('');
            setCustomEmailMessage('');
            setAttachOfferLetter(false);
            setManualAttachment(null);
            const fileInput = document.getElementById('manual-attachment-input') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            fetchStudents();
        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to dispatch email');
        } finally {
            setEmailSending(false);
        }
    };

    // Admission letter API integration
    const triggerAdmissionLetterDownload = async (studentId: string) => {
        const loadingToast = toast.loading('Downloading admission letter PDF...');
        try {
            const res = await axios.get(`${API_URL}/students/${studentId}/admission-letter?download=true`, {
                headers: { Authorization: `Bearer ${getToken()}` },
                responseType: 'blob'
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Admission_Letter_${studentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.dismiss(loadingToast);
            toast.success('Download started.');
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to download admission letter.');
        }
    };

    const triggerAdmissionLetterPreview = async (studentId: string) => {
        const loadingToast = toast.loading('Preparing preview...');
        try {
            const res = await axios.get(`${API_URL}/students/${studentId}/admission-letter?download=false`, {
                headers: { Authorization: `Bearer ${getToken()}` },
                responseType: 'blob'
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
            toast.dismiss(loadingToast);
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to load preview.');
        }
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

    const triggerCertificateDownload = async (studentId: string) => {
        const loadingToast = toast.loading('Downloading completion certificate PDF...');
        try {
            const res = await axios.get(`${API_URL}/students/${studentId}/certificate?download=true`, {
                headers: { Authorization: `Bearer ${getToken()}` },
                responseType: 'blob'
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Completion_Certificate_${studentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.dismiss(loadingToast);
            toast.success('Download started.');
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to download completion certificate.');
        }
    };

    const triggerCertificateEmail = async (studentId: string) => {
        const loadingToast = toast.loading('Sending Completion Certificate via email...');
        try {
            await axios.post(
                `${API_URL}/students/${studentId}/certificate/email`,
                { adminName: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.dismiss(loadingToast);
            toast.success('Completion Certificate emailed successfully!');
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to email completion certificate.');
        }
    };

    const handleInlineSave = async (studentId: string, field: string, value: any) => {
        try {
            const numVal = (field === 'program_fee' || field === 'amount_paid') ? parseFloat(value) || 0 : value;
            await axios.put(
                `${API_URL}/students/${studentId}`,
                { [field]: numVal },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Field updated successfully.');
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error('Failed to update field.');
        } finally {
            setEditingCell(null);
        }
    };

    const handleBulkStatusChange = async (status: string) => {
        if (selectedStudentIds.length === 0) return;
        const loadingToast = toast.loading(`Updating ${selectedStudentIds.length} students...`);
        try {
            await axios.put(
                `${API_URL}/students/bulk-update`,
                { ids: selectedStudentIds, updates: { status }, adminName: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.dismiss(loadingToast);
            toast.success(`Successfully updated ${selectedStudentIds.length} records.`);
            setSelectedStudentIds([]);
            fetchStudents();
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to update records in bulk.');
        }
    };

    const handleBulkBatchAssign = async (batchId: string) => {
        if (selectedStudentIds.length === 0) return;
        const loadingToast = toast.loading('Assigning cohort to selected students...');
        try {
            await axios.put(
                `${API_URL}/students/bulk-update`,
                { ids: selectedStudentIds, updates: { batch_id: batchId || null }, adminName: 'Admin Partner' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.dismiss(loadingToast);
            toast.success(`Assigned batch to ${selectedStudentIds.length} students.`);
            setSelectedStudentIds([]);
            fetchStudents();
            fetchBatches();
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to assign batch.');
        }
    };

    const handleBulkDelete = async () => {
        if (selectedStudentIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete the ${selectedStudentIds.length} selected candidate records?`)) return;
        const loadingToast = toast.loading('Deleting selected records...');
        try {
            await axios.delete(
                `${API_URL}/students/bulk-delete`,
                {
                    data: { ids: selectedStudentIds },
                    headers: { Authorization: `Bearer ${getToken()}` }
                }
            );
            toast.dismiss(loadingToast);
            toast.success(`Deleted ${selectedStudentIds.length} records.`);
            setSelectedStudentIds([]);
            fetchStudents();
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            toast.error('Failed to delete records.');
        }
    };

    const handleSaveInstallments = async () => {
        if (!selectedStudent) return;
        try {
            await axios.put(
                `${API_URL}/students/${selectedStudent._id}`,
                { installments: tempInstallments },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Installment payment schedule saved.');
            setSelectedStudent({ ...selectedStudent, installments: tempInstallments } as Student);
            fetchStudents();
        } catch (err) {
            console.error(err);
            toast.error('Failed to save installment schedule.');
        }
    };

    const handleToggleAttendance = async (studentId: string, isPresent: boolean) => {
        try {
            const student = students.find(s => s._id === studentId);
            if (!student) return;
            
            let newAttendance = (student.attendance || []).filter(a => 
                new Date(a.date).toDateString() !== new Date(attendanceDate).toDateString()
            );
            newAttendance.push({ date: new Date(attendanceDate).toISOString(), present: isPresent });
            
            await axios.put(
                `${API_URL}/students/${studentId}`,
                { attendance: newAttendance },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            fetchStudents();
            toast.success('Attendance status logged.');
        } catch (err) {
            console.error(err);
            toast.error('Failed to save attendance.');
        }
    };

    const handleTemplateSelect = (index: number) => {
        const template = PREWRITTEN_TEMPLATES[index];
        if (template && selectedStudent) {
            let msg = template.message
                .replace(/candidate/g, selectedStudent.full_name)
                .replace(/\[Name\]/g, selectedStudent.full_name)
                .replace(/\[Course\]/g, selectedStudent.course_name || selectedStudent.domain || 'your enrolled program');
            setCustomEmailSubject(template.subject);
            setCustomEmailMessage(msg);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            setManualAttachment(null);
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error('File is too large. Maximum size is 10MB.');
            e.target.value = '';
            setManualAttachment(null);
            return;
        }

        setIsUploadingAttachment(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(',')[1];
            setManualAttachment({
                filename: file.name,
                content: base64String,
                contentType: file.type
            });
            setIsUploadingAttachment(false);
            toast.success(`Attached file: ${file.name}`);
        };
        reader.onerror = () => {
            toast.error('Failed to read file.');
            setIsUploadingAttachment(false);
            setManualAttachment(null);
        };
        reader.readAsDataURL(file);
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
        setTempInstallments(student.installments || []);
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
        const matchCollege = filterCollege === 'all' || s.college_name === filterCollege;
        const matchState = filterState === 'all' || s.state === filterState;

        return matchSearch && matchCourse && matchDomain && matchBatch && matchStatus && matchCollege && matchState;
    });

    const resetFilters = () => {
        setSearchQuery('');
        setFilterCourse('all');
        setFilterDomain('all');
        setFilterBatch('all');
        setFilterStatus('all');
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

    // Demo Bookings Analytics & Filtered List
    const totalDemos = demoBookings.length;
    const statsDemoNew = demoBookings.filter(b => b.status === 'New').length;
    const statsDemoContacted = demoBookings.filter(b => b.status === 'Contacted').length;
    const statsDemoScheduled = demoBookings.filter(b => b.status === 'Scheduled').length;
    const statsDemoCompleted = demoBookings.filter(b => b.status === 'Completed').length;
    const demoConversionRate = totalDemos > 0 ? Math.round(((statsDemoScheduled + statsDemoCompleted) / totalDemos) * 100) : 0;

    const uniqueDemoProgramsList = Array.from(new Set(demoBookings.map(d => d.programInterest).filter(Boolean) as string[]));

    const filteredDemoBookings = demoBookings.filter(b => {
        const query = demoSearchQuery.toLowerCase().trim();
        const matchesSearch = !query ||
            (b.name && b.name.toLowerCase().includes(query)) ||
            (b.email && b.email.toLowerCase().includes(query)) ||
            (b.phone && b.phone.includes(query)) ||
            (b.programInterest && b.programInterest.toLowerCase().includes(query));
        const matchesStatus = demoFilterStatus === 'all' || b.status === demoFilterStatus;
        const matchesProgram = demoFilterProgram === 'all' || b.programInterest === demoFilterProgram;
        return matchesSearch && matchesStatus && matchesProgram;
    });

    const exportDemosToCSV = () => {
        if (!demoBookings.length) {
            toast.error('No demo requests to export.');
            return;
        }
        const headers = ['Name', 'Phone', 'Email', 'Program Interest', 'Preferred Date', 'Preferred Time', 'Status', 'Requested At'];
        const rows = demoBookings.map(d => [
            `"${(d.name || '').replace(/"/g, '""')}"`,
            `"${d.phone || ''}"`,
            `"${(d.email || '').replace(/"/g, '""')}"`,
            `"${(d.programInterest || 'General').replace(/"/g, '""')}"`,
            `"${d.preferredDate || ''}"`,
            `"${d.preferredTime || ''}"`,
            `"${d.status}"`,
            `"${new Date(d.createdAt).toLocaleString()}"`
        ]);
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `EdSec_Demo_Requests_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Demo class requests exported to CSV!');
    };

    // Notifications List (New Registrations + New Demo Bookings)
    const notificationsList = [
        ...students.filter(s => s.status === 'New Application').map(s => ({
            id: `reg-${s._id}`,
            type: 'registration' as const,
            title: `New registration — ${s.course_name}`,
            subtitle: `${s.full_name} (${s.email})`,
            time: s.enrollment_date || new Date().toISOString(),
            timestamp: new Date(s.enrollment_date || Date.now()).getTime(),
            targetTab: 'crm' as const,
            item: s
        })),
        ...demoBookings.map(b => ({
            id: `demo-${b._id}`,
            type: 'demo' as const,
            title: `Demo requested — ${b.preferredDate} (${b.preferredTime})`,
            subtitle: `${b.name} • ${b.programInterest || 'General'}`,
            time: b.createdAt,
            timestamp: new Date(b.createdAt).getTime(),
            targetTab: 'demos' as const,
            item: b
        }))
    ].sort((a, b) => b.timestamp - a.timestamp);

    const unreadNotificationsCount = notificationsList.filter(n => n.timestamp > lastReadTimestamp).length;

    const formatRelativeTime = (timestamp: string | number | Date) => {
        const date = new Date(timestamp);
        const now = Date.now();
        const diffMs = now - date.getTime();
        if (isNaN(diffMs)) return 'Recently';
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        if (diffSec < 60) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHr < 24) return `${diffHr}h ago`;
        if (diffDay === 1) return 'Yesterday';
        if (diffDay < 7) return `${diffDay}d ago`;
        return date.toLocaleDateString();
    };

    // Brochure Leads Analytics & Filtered List
    const totalBrochureLeads = brochureLeads.length;
    const verifiedLeadsCount = brochureLeads.filter(l => l.verified).length;
    const downloadedLeadsCount = brochureLeads.filter(l => l.downloadTokenUsed).length;
    const verifiedPercentage = totalBrochureLeads > 0 ? Math.round((verifiedLeadsCount / totalBrochureLeads) * 100) : 0;
    const downloadedPercentage = totalBrochureLeads > 0 ? Math.round((downloadedLeadsCount / totalBrochureLeads) * 100) : 0;

    // Most popular brochure requested
    const programFrequencyMap: Record<string, number> = {};
    brochureLeads.forEach(l => {
        if (l.programId) {
            programFrequencyMap[l.programId] = (programFrequencyMap[l.programId] || 0) + 1;
        }
    });
    const topProgramPair = Object.entries(programFrequencyMap).sort((a, b) => b[1] - a[1])[0];
    const topProgramTitle = topProgramPair ? (PROGRAM_TITLES_MAP[topProgramPair[0]] || topProgramPair[0]) : 'None yet';

    const filteredBrochureLeads = brochureLeads.filter(lead => {
        const query = leadSearchQuery.toLowerCase().trim();
        const matchesSearch = !query ||
            (lead.name && lead.name.toLowerCase().includes(query)) ||
            (lead.email && lead.email.toLowerCase().includes(query)) ||
            (lead.phone && lead.phone.includes(query));
        const matchesProgram = leadFilterProgram === 'all' || lead.programId === leadFilterProgram;
        const matchesVerified = leadFilterVerified === 'all' || 
            (leadFilterVerified === 'verified' && lead.verified) ||
            (leadFilterVerified === 'pending' && !lead.verified);
        const matchesDownloaded = leadFilterDownloaded === 'all' ||
            (leadFilterDownloaded === 'downloaded' && lead.downloadTokenUsed) ||
            (leadFilterDownloaded === 'not_downloaded' && !lead.downloadTokenUsed);
        return matchesSearch && matchesProgram && matchesVerified && matchesDownloaded;
    });

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
            {/* Minimal Admin Top Navbar */}
            <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${isDark ? 'bg-[rgba(11,15,15,0.88)] border-[rgba(20,184,166,0.15)] text-[#E6FFFA]' : 'bg-[rgba(255,255,255,0.92)] border-[rgba(13,148,136,0.15)] text-[#0F172A]'}`}>
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="EDSEC Innovations Logo" className="h-10 w-auto object-contain" />
                        <span className="font-bold text-lg tracking-wider bg-gradient-to-r from-[#14B8A6] to-[#0D9488] bg-clip-text text-transparent">EDSEC CRM</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">Admin portal</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Notifications Bell Dropdown */}
                        <div className="relative">
                            <button
                                onClick={handleOpenNotifications}
                                className={`relative p-2 rounded-xl transition-all border ${
                                    isDark ? 'text-[#14B8A6] border-[rgba(20,184,166,0.22)] hover:bg-[#14B8A6]/15' : 'text-[#0D9488] border-[rgba(13,148,136,0.22)] hover:bg-[#0D9488]/10'
                                }`}
                                title="Notifications"
                            >
                                <Bell className="h-4 w-4" />
                                {unreadNotificationsCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm ring-2 ring-slate-900 animate-pulse">
                                        {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden ${
                                    isDark ? 'bg-[#0D1515] border-[rgba(20,184,166,0.25)] text-[#E6FFFA]' : 'bg-white border-slate-200 text-slate-900'
                                }`}>
                                    <div className="p-3.5 border-b border-[rgba(20,184,166,0.15)] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4 text-[#14B8A6]" />
                                            <span className="font-bold text-xs uppercase tracking-wider">Admissions Activity</span>
                                            {unreadNotificationsCount > 0 && (
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
                                                    {unreadNotificationsCount} unread
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => {
                                                const now = Date.now();
                                                setLastReadTimestamp(now);
                                                localStorage.setItem('admin_last_read_notifications', String(now));
                                            }}
                                            className="text-[10px] text-teal-500 hover:underline font-semibold"
                                        >
                                            Mark read
                                        </button>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto divide-y divide-[rgba(20,184,166,0.08)]">
                                        {notificationsList.length > 0 ? (
                                            notificationsList.slice(0, 15).map(n => {
                                                const isUnread = n.timestamp > lastReadTimestamp;
                                                return (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => {
                                                            setNotificationOpen(false);
                                                            if (n.targetTab === 'crm') {
                                                                setActiveTab('crm');
                                                                setFilterStatus('New Application');
                                                                if (n.item && '_id' in n.item) {
                                                                    handleOpenProfileDrawer(n.item as Student);
                                                                }
                                                            } else {
                                                                setActiveTab('demos');
                                                            }
                                                        }}
                                                        className={`p-3 text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                                                            isUnread
                                                                ? (isDark ? 'bg-[#14B8A6]/10 hover:bg-[#14B8A6]/15' : 'bg-teal-50/80 hover:bg-teal-100/60')
                                                                : (isDark ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50')
                                                        }`}
                                                    >
                                                        <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                                                            n.type === 'demo' ? 'bg-amber-500/15 text-amber-400' : 'bg-[#14B8A6]/15 text-[#14B8A6]'
                                                        }`}>
                                                            {n.type === 'demo' ? <Sparkles className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <p className="font-bold text-xs truncate">{n.title}</p>
                                                                <span className="text-[10px] text-slate-400 shrink-0">{formatRelativeTime(n.time)}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{n.subtitle}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-6 text-center text-xs text-slate-400">
                                                <Bell className="h-6 w-6 mx-auto mb-2 opacity-30" />
                                                No recent admissions activity
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-2 border-t border-[rgba(20,184,166,0.1)] text-center bg-black/10">
                                        <button
                                            onClick={() => setNotificationOpen(false)}
                                            className="text-[11px] font-semibold text-slate-400 hover:text-[#14B8A6] transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={toggleTheme}
                            className={`p-2 rounded-xl transition-all border ${isDark ? 'text-[#14B8A6] border-[rgba(20,184,166,0.22)] hover:bg-[#14B8A6]/15' : 'text-[#0D9488] border-[rgba(13,148,136,0.22)] hover:bg-[#0D9488]/10'}`}
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
            </header>

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
                        <button
                            onClick={() => {
                                setActiveTab('brochures');
                                if (!brochureLeads.length) fetchBrochureLeads();
                            }}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all ${
                                activeTab === 'brochures'
                                    ? 'border-[#14B8A6] text-[#14B8A6]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-[#99F6E4]'
                            }`}
                        >
                            <FileText className="h-4 w-4" /> Brochure Downloads
                            {totalBrochureLeads > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-[#14B8A6]/20 text-[#14B8A6] font-bold">
                                    {totalBrochureLeads}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('demos');
                                if (!demoBookings.length) fetchDemoBookings();
                            }}
                            className={`px-4 py-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all shrink-0 ${
                                activeTab === 'demos'
                                    ? 'border-[#14B8A6] text-[#14B8A6]'
                                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-[#99F6E4]'
                            }`}
                        >
                            <Sparkles className="h-4 w-4" /> Demo Requests
                            {statsDemoNew > 0 && (
                                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400 font-bold animate-pulse">
                                    {statsDemoNew} new
                                </span>
                            )}
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
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Demo Requests</p>
                                                    <h4 className="text-xl font-bold mt-1 text-amber-400">{totalDemos}</h4>
                                                </div>
                                                <Sparkles className="h-5 w-5 text-amber-400" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Demos Scheduled</p>
                                                    <h4 className="text-xl font-bold mt-1 text-indigo-400">{statsDemoScheduled}</h4>
                                                </div>
                                                <Calendar className="h-5 w-5 text-indigo-400" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Demos Completed</p>
                                                    <h4 className="text-xl font-bold mt-1 text-emerald-400">{statsDemoCompleted}</h4>
                                                </div>
                                                <CheckCircle className="h-5 w-5 text-emerald-400" />
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
                                                <h3 className="text-lg font-bold textStrong">Demo Class Engagement & Funnel</h3>
                                                <p className="text-xs text-slate-400">Review real-time conversion for prospective students who requested free demo classes. The gauge represents scheduling and completion progress.</p>
                                                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                                                    <div className="p-2.5 rounded-lg bg-slate-900/40">
                                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Requested</span>
                                                        <span className="font-bold text-sm block mt-0.5 textStrong">{totalDemos}</span>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-indigo-950/20">
                                                        <span className="text-[10px] text-indigo-400 uppercase font-bold block">Scheduled</span>
                                                        <span className="font-bold text-sm block mt-0.5 text-indigo-400">{statsDemoScheduled}</span>
                                                    </div>
                                                    <div className="p-2.5 rounded-lg bg-emerald-950/20">
                                                        <span className="text-[10px] text-emerald-400 uppercase font-bold block">Completed</span>
                                                        <span className="font-bold text-sm block mt-0.5 text-emerald-400">{statsDemoCompleted}</span>
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
                                                        strokeDashoffset={2 * Math.PI * 58 * (1 - (totalDemos > 0 ? (statsDemoScheduled + statsDemoCompleted) / totalDemos : 0))}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute flex flex-col items-center">
                                                    <span className="text-2xl font-black textStrong">{demoConversionRate}%</span>
                                                    <span className="text-[9px] uppercase tracking-widest text-slate-400">Scheduled / Done</span>
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

                            {/* Tab 5: Brochure Downloads */}
                            {activeTab === 'brochures' && (
                                <div className="space-y-6">
                                    {/* Header and Actions Bar */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h2 className={`text-xl font-bold flex items-center gap-2 ${titleClr}`}>
                                                <FileText className="h-5 w-5 text-[#14B8A6]" /> Brochure Download Leads
                                            </h2>
                                            <p className={`text-xs mt-1 ${mutedClr}`}>
                                                Prospective students who verified via 2Factor SMS OTP and accessed program brochures.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <Button
                                                onClick={fetchBrochureLeads}
                                                variant="outline"
                                                size="sm"
                                                disabled={loadingLeads}
                                                className={`gap-1.5 ${btnSecondary}`}
                                            >
                                                <RefreshCw className={`h-3.5 w-3.5 ${loadingLeads ? 'animate-spin' : ''}`} />
                                                Refresh
                                            </Button>
                                            <Button
                                                onClick={exportLeadsToCSV}
                                                size="sm"
                                                className="gap-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-slate-950 font-bold border-0 shadow-sm"
                                            >
                                                <Download className="h-3.5 w-3.5" /> Export CSV
                                            </Button>
                                        </div>
                                    </div>

                                    {/* 4 Stat Overview Cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className={`text-xs font-semibold uppercase tracking-wider ${mutedClr}`}>Total Inquiries</p>
                                                    <h3 className={`text-2xl font-extrabold mt-1 ${titleClr}`}>{totalBrochureLeads}</h3>
                                                    <span className="text-[10px] text-teal-400 font-semibold">All-time brochure leads</span>
                                                </div>
                                                <div className={`p-3 rounded-xl ${iconBg}`}>
                                                    <Users className="h-5 w-5 text-[#14B8A6]" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className={`text-xs font-semibold uppercase tracking-wider ${mutedClr}`}>SMS OTP Verified</p>
                                                    <h3 className={`text-2xl font-extrabold mt-1 ${titleClr}`}>{verifiedLeadsCount}</h3>
                                                    <span className="text-[10px] text-emerald-400 font-semibold">{verifiedPercentage}% verified mobile numbers</span>
                                                </div>
                                                <div className={`p-3 rounded-xl ${iconBg}`}>
                                                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className={`text-xs font-semibold uppercase tracking-wider ${mutedClr}`}>Downloaded PDFs</p>
                                                    <h3 className={`text-2xl font-extrabold mt-1 ${titleClr}`}>{downloadedLeadsCount}</h3>
                                                    <span className="text-[10px] text-teal-400 font-semibold">{downloadedPercentage}% brochure completion</span>
                                                </div>
                                                <div className={`p-3 rounded-xl ${iconBg}`}>
                                                    <Download className="h-5 w-5 text-[#14B8A6]" />
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="truncate mr-2">
                                                    <p className={`text-xs font-semibold uppercase tracking-wider ${mutedClr}`}>Top Program</p>
                                                    <h3 className={`text-base font-extrabold mt-1 truncate ${titleClr}`}>{topProgramTitle}</h3>
                                                    <span className="text-[10px] text-amber-400 font-semibold">Highest interest</span>
                                                </div>
                                                <div className={`p-3 rounded-xl ${iconBg} flex-shrink-0`}>
                                                    <Award className="h-5 w-5 text-amber-500" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Search & Multi-Filters Card */}
                                    <Card className={`${cardBg}`}>
                                        <CardContent className="p-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                                {/* Search Input */}
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-2.5 h-4 w-4 opacity-50" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Search name, email, phone..."
                                                        value={leadSearchQuery}
                                                        onChange={(e) => setLeadSearchQuery(e.target.value)}
                                                        className={`pl-9 h-9 text-xs rounded-xl ${inputBg}`}
                                                    />
                                                    {leadSearchQuery && (
                                                        <button
                                                            onClick={() => setLeadSearchQuery('')}
                                                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-200"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Program Filter */}
                                                <Select value={leadFilterProgram} onValueChange={setLeadFilterProgram}>
                                                    <SelectTrigger className={`h-9 text-xs rounded-xl ${inputBg}`}>
                                                        <SelectValue placeholder="All Programs" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Programs</SelectItem>
                                                        <SelectItem value="full-stack-web-dev">Full Stack Web Development</SelectItem>
                                                        <SelectItem value="generative-ai">Generative AI</SelectItem>
                                                        <SelectItem value="python-ai-ml">Python with AI/ML</SelectItem>
                                                        <SelectItem value="git-resume">Git & Resume</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {/* SMS Verified Filter */}
                                                <Select value={leadFilterVerified} onValueChange={setLeadFilterVerified}>
                                                    <SelectTrigger className={`h-9 text-xs rounded-xl ${inputBg}`}>
                                                        <SelectValue placeholder="SMS Verification" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Verifications</SelectItem>
                                                        <SelectItem value="verified">SMS Verified Only</SelectItem>
                                                        <SelectItem value="pending">Pending Only</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                {/* Download Status Filter */}
                                                <Select value={leadFilterDownloaded} onValueChange={setLeadFilterDownloaded}>
                                                    <SelectTrigger className={`h-9 text-xs rounded-xl ${inputBg}`}>
                                                        <SelectValue placeholder="Download Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Download Statuses</SelectItem>
                                                        <SelectItem value="downloaded">Downloaded Only</SelectItem>
                                                        <SelectItem value="not_downloaded">Not Downloaded</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-[rgba(20,184,166,0.1)] text-xs">
                                                <span className={mutedClr}>
                                                    Showing <strong className={titleClr}>{filteredBrochureLeads.length}</strong> of {totalBrochureLeads} total leads
                                                </span>
                                                {(leadSearchQuery || leadFilterProgram !== 'all' || leadFilterVerified !== 'all' || leadFilterDownloaded !== 'all') && (
                                                    <button
                                                        onClick={() => {
                                                            setLeadSearchQuery('');
                                                            setLeadFilterProgram('all');
                                                            setLeadFilterVerified('all');
                                                            setLeadFilterDownloaded('all');
                                                        }}
                                                        className="text-teal-500 hover:underline font-semibold"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Leads Table */}
                                    <Card className={`border ${cardBg}`}>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                                    <thead>
                                                        <tr className={`border-b text-xs uppercase font-semibold ${tableHeader}`}>
                                                            <th className="px-6 py-4">Student Details</th>
                                                            <th className="px-6 py-4">Contact Info</th>
                                                            <th className="px-6 py-4">Program Requested</th>
                                                            <th className="px-6 py-4">SMS 2Factor Status</th>
                                                            <th className="px-6 py-4">Brochure PDF</th>
                                                            <th className="px-6 py-4">Requested Date</th>
                                                            <th className="px-6 py-4 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[rgba(13,148,136,0.05)]">
                                                        {filteredBrochureLeads.map((lead) => {
                                                            const initials = lead.name
                                                                ? lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                                                : 'ST';
                                                            return (
                                                                <tr key={lead._id} className={`transition-colors ${tableRowBase}`}>
                                                                    {/* Student Details */}
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                                                                                {initials}
                                                                            </div>
                                                                            <div>
                                                                                <p className={`font-semibold text-sm ${primaryText}`}>{lead.name}</p>
                                                                                <span className={`text-[11px] ${mutedClr}`}>ID: {lead._id.slice(-6)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    {/* Contact Info */}
                                                                    <td className="px-6 py-4">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                                                <a href={`mailto:${lead.email}`} className="hover:underline text-slate-300">
                                                                                    {lead.email}
                                                                                </a>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                                <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                                                                                <a
                                                                                    href={`https://wa.me/91${lead.phone}`}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="hover:underline font-mono text-emerald-400"
                                                                                >
                                                                                    +91 {lead.phone}
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    {/* Program Requested */}
                                                                    <td className="px-6 py-4">
                                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                                                            <BookOpen className="h-3 w-3" />
                                                                            {PROGRAM_TITLES_MAP[lead.programId] || lead.programId}
                                                                        </span>
                                                                    </td>

                                                                    {/* SMS 2Factor Status */}
                                                                    <td className="px-6 py-4">
                                                                        {lead.verified ? (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                                                <CheckCircle className="h-3 w-3" /> SMS Verified
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                                                <Clock className="h-3 w-3" /> Pending OTP
                                                                            </span>
                                                                        )}
                                                                    </td>

                                                                    {/* PDF Download Status */}
                                                                    <td className="px-6 py-4">
                                                                        {lead.downloadTokenUsed ? (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-400 border border-teal-500/30">
                                                                                <Download className="h-3 w-3" /> Downloaded
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
                                                                                <Clock className="h-3 w-3" /> Link Generated
                                                                            </span>
                                                                        )}
                                                                    </td>

                                                                    {/* Requested Date */}
                                                                    <td className="px-6 py-4 text-xs text-slate-400">
                                                                        <div>{new Date(lead.createdAt).toLocaleDateString()}</div>
                                                                        <div className="text-[10px] opacity-70">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                                                    </td>

                                                                    {/* Actions */}
                                                                    <td className="px-6 py-4 text-right">
                                                                        <div className="flex items-center justify-end gap-1.5">
                                                                            <a
                                                                                href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(`Hi ${lead.name}, thank you for your interest in the ${PROGRAM_TITLES_MAP[lead.programId] || lead.programId} program at EdSec Innovations!`)}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                title="Send WhatsApp Message"
                                                                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                                            >
                                                                                <MessageSquare className="h-4 w-4" />
                                                                            </a>
                                                                            <a
                                                                                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Information about ${PROGRAM_TITLES_MAP[lead.programId] || lead.programId} - EdSec Innovations`)}`}
                                                                                title="Send Email"
                                                                                className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                                                                            >
                                                                                <Mail className="h-4 w-4" />
                                                                            </a>
                                                                            <button
                                                                                onClick={() => handleDeleteLead(lead._id, lead.name)}
                                                                                title="Delete Lead Record"
                                                                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {filteredBrochureLeads.length === 0 && (
                                                            <tr>
                                                                <td colSpan={7} className={`px-6 py-12 text-center text-sm ${mutedClr}`}>
                                                                    {loadingLeads ? (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <RefreshCw className="h-4 w-4 animate-spin text-[#14B8A6]" />
                                                                            Loading brochure download records...
                                                                        </div>
                                                                    ) : totalBrochureLeads === 0 ? (
                                                                        'No brochure download inquiries recorded yet.'
                                                                    ) : (
                                                                        'No brochure leads match your current search/filter criteria.'
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* Tab: Demo Class Requests */}
                            {activeTab === 'demos' && (
                                <div className="space-y-6">
                                    {/* Header & Quick Actions */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <h2 className={`text-xl font-bold flex items-center gap-2 ${titleClr}`}>
                                                <Sparkles className="h-5 w-5 text-amber-400" /> Free Demo Class Requests
                                            </h2>
                                            <p className={`text-xs mt-1 ${mutedClr}`}>
                                                Prospective students who scheduled a free live demo session through website CTAs.
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 w-full sm:w-auto">
                                            <Button
                                                onClick={() => fetchDemoBookings(true)}
                                                variant="outline"
                                                size="sm"
                                                disabled={loadingDemos}
                                                className={`gap-1.5 ${btnSecondary}`}
                                            >
                                                <RefreshCw className={`h-3.5 w-3.5 ${loadingDemos ? 'animate-spin' : ''}`} /> Refresh
                                            </Button>
                                            <Button
                                                onClick={exportDemosToCSV}
                                                variant="outline"
                                                size="sm"
                                                className="gap-1.5 bg-[#14B8A6] hover:bg-[#0D9488] text-white border-transparent"
                                            >
                                                <Download className="h-3.5 w-3.5" /> Export CSV
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Metrics Cards */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Bookings</p>
                                                    <h4 className="text-xl font-bold mt-1 textStrong">{totalDemos}</h4>
                                                </div>
                                                <Sparkles className="h-5 w-5 text-amber-400" />
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">New Requests</p>
                                                    <h4 className="text-xl font-bold mt-1 text-amber-400">{statsDemoNew}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Scheduled</p>
                                                    <h4 className="text-xl font-bold mt-1 text-indigo-400">{statsDemoScheduled}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                            </CardContent>
                                        </Card>
                                        <Card className={`${cardBg} ${cardShadow}`}>
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Completed</p>
                                                    <h4 className="text-xl font-bold mt-1 text-emerald-400">{statsDemoCompleted}</h4>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Search & Filters */}
                                    <Card className={`border ${cardBg}`}>
                                        <CardContent className="p-4 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        placeholder="Search by name, phone, email, program..."
                                                        value={demoSearchQuery}
                                                        onChange={e => setDemoSearchQuery(e.target.value)}
                                                        className={`pl-9 h-9 text-xs rounded-xl ${inputBg}`}
                                                    />
                                                </div>
                                                <Select value={demoFilterStatus} onValueChange={setDemoFilterStatus}>
                                                    <SelectTrigger className={`h-9 text-xs rounded-xl ${inputBg}`}>
                                                        <SelectValue placeholder="Filter by Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Statuses</SelectItem>
                                                        <SelectItem value="New">New</SelectItem>
                                                        <SelectItem value="Contacted">Contacted</SelectItem>
                                                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                                                        <SelectItem value="Completed">Completed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Select value={demoFilterProgram} onValueChange={setDemoFilterProgram}>
                                                    <SelectTrigger className={`h-9 text-xs rounded-xl ${inputBg}`}>
                                                        <SelectValue placeholder="Filter by Program" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Programs</SelectItem>
                                                        {uniqueDemoProgramsList.map(prog => (
                                                            <SelectItem key={prog} value={prog}>{prog}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t border-[rgba(20,184,166,0.1)] text-xs">
                                                <span className={mutedClr}>
                                                    Showing <strong className={titleClr}>{filteredDemoBookings.length}</strong> of {totalDemos} total demo requests
                                                </span>
                                                {(demoSearchQuery || demoFilterStatus !== 'all' || demoFilterProgram !== 'all') && (
                                                    <button
                                                        onClick={() => {
                                                            setDemoSearchQuery('');
                                                            setDemoFilterStatus('all');
                                                            setDemoFilterProgram('all');
                                                        }}
                                                        className="text-teal-500 hover:underline font-semibold"
                                                    >
                                                        Clear all filters
                                                    </button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Demos Table */}
                                    <Card className={`border ${cardBg}`}>
                                        <CardContent className="p-0">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse whitespace-nowrap">
                                                    <thead>
                                                        <tr className={`border-b text-xs uppercase font-semibold ${tableHeader}`}>
                                                            <th className="px-6 py-4">Applicant</th>
                                                            <th className="px-6 py-4">Contact Info</th>
                                                            <th className="px-6 py-4">Program Interest</th>
                                                            <th className="px-6 py-4">Preferred Slot</th>
                                                            <th className="px-6 py-4">Status</th>
                                                            <th className="px-6 py-4">Requested Date</th>
                                                            <th className="px-6 py-4 text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-[rgba(13,148,136,0.05)]">
                                                        {filteredDemoBookings.map((booking) => {
                                                            const initials = booking.name
                                                                ? booking.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                                                : 'DM';
                                                            return (
                                                                <tr key={booking._id} className={`transition-colors ${tableRowBase}`}>
                                                                    {/* Applicant */}
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                                                                                {initials}
                                                                            </div>
                                                                            <div>
                                                                                <p className={`font-semibold text-sm ${primaryText}`}>{booking.name}</p>
                                                                                <span className={`text-[11px] ${mutedClr}`}>ID: {booking._id.slice(-6)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    {/* Contact Info */}
                                                                    <td className="px-6 py-4">
                                                                        <div className="space-y-1">
                                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                                <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                                                <a href={`mailto:${booking.email}`} className="hover:underline text-slate-300">
                                                                                    {booking.email}
                                                                                </a>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5 text-xs">
                                                                                <Phone className="h-3.5 w-3.5 text-[#14B8A6]" />
                                                                                <a href={`tel:${booking.phone}`} className="hover:underline text-slate-300">
                                                                                    {booking.phone}
                                                                                </a>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    {/* Program Interest */}
                                                                    <td className="px-6 py-4">
                                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20">
                                                                            <BookOpen className="h-3 w-3" />
                                                                            {booking.programInterest || 'General Inquiry'}
                                                                        </span>
                                                                    </td>

                                                                    {/* Preferred Slot */}
                                                                    <td className="px-6 py-4">
                                                                        <div className="flex flex-col gap-0.5 text-xs">
                                                                            <span className="font-semibold textStrong flex items-center gap-1">
                                                                                <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                                                                                {booking.preferredDate}
                                                                            </span>
                                                                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                                                                <Clock className="h-3 w-3 text-slate-500" />
                                                                                {booking.preferredTime}
                                                                            </span>
                                                                        </div>
                                                                    </td>

                                                                    {/* Status selector */}
                                                                    <td className="px-6 py-4">
                                                                        <select
                                                                            value={booking.status}
                                                                            onChange={e => handleDemoStatusChange(booking._id, e.target.value)}
                                                                            className={`p-1.5 rounded-lg border text-xs font-bold ${
                                                                                booking.status === 'New' ? 'bg-amber-950/30 text-amber-400 border-amber-500/30' :
                                                                                booking.status === 'Contacted' ? 'bg-blue-950/30 text-blue-400 border-blue-500/30' :
                                                                                booking.status === 'Scheduled' ? 'bg-indigo-950/30 text-indigo-400 border-indigo-500/30' :
                                                                                'bg-emerald-950/30 text-emerald-400 border-emerald-500/30'
                                                                            }`}
                                                                        >
                                                                            <option value="New">New</option>
                                                                            <option value="Contacted">Contacted</option>
                                                                            <option value="Scheduled">Scheduled</option>
                                                                            <option value="Completed">Completed</option>
                                                                        </select>
                                                                    </td>

                                                                    {/* Requested Date */}
                                                                    <td className="px-6 py-4 text-xs text-slate-400">
                                                                        <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                                                                        <div className="text-[10px] opacity-70">{formatRelativeTime(booking.createdAt)}</div>
                                                                    </td>

                                                                    {/* Actions */}
                                                                    <td className="px-6 py-4 text-right">
                                                                        <div className="flex items-center justify-end gap-1.5">
                                                                            <a
                                                                                href={`https://wa.me/91${booking.phone}?text=${encodeURIComponent(`Hi ${booking.name}, thank you for booking a free demo class for ${booking.programInterest || 'EdSec Innovations Programs'} scheduled for ${booking.preferredDate} at ${booking.preferredTime}. We look forward to connecting with you!`)}`}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                title="Send WhatsApp Message"
                                                                                className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                                                            >
                                                                                <MessageSquare className="h-4 w-4" />
                                                                            </a>
                                                                            <a
                                                                                href={`tel:${booking.phone}`}
                                                                                title="Call Phone Number"
                                                                                className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 hover:bg-teal-500/20 transition-colors"
                                                                            >
                                                                                <Phone className="h-4 w-4" />
                                                                            </a>
                                                                            <a
                                                                                href={`mailto:${booking.email}?subject=${encodeURIComponent(`Confirmation: Your Free Demo Class at EdSec Innovations`)}`}
                                                                                title="Send Email"
                                                                                className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                                                            >
                                                                                <Mail className="h-4 w-4" />
                                                                            </a>
                                                                            <button
                                                                                onClick={() => handleDeleteDemoBooking(booking._id, booking.name)}
                                                                                title="Delete Demo Booking"
                                                                                className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                        {filteredDemoBookings.length === 0 && (
                                                            <tr>
                                                                <td colSpan={7} className={`px-6 py-12 text-center text-sm ${mutedClr}`}>
                                                                    {loadingDemos ? (
                                                                        <div className="flex items-center justify-center gap-2">
                                                                            <RefreshCw className="h-4 w-4 animate-spin text-[#14B8A6]" />
                                                                            Loading demo class requests...
                                                                        </div>
                                                                    ) : totalDemos === 0 ? (
                                                                        'No free demo class requests received yet.'
                                                                    ) : (
                                                                        'No demo requests match your current search/filter criteria.'
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
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

                            {/* Program & Enrollment Details */}
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-[#14B8A6] flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> Program & Enrollment Details</h4>
                                <div className="grid grid-cols-2 gap-4 bg-slate-950/20 p-4 rounded-xl border border-slate-800/40">
                                    <div><span className="text-slate-500 block">Selected Course</span><strong className="text-sm text-blue-500">{selectedStudent.course_name}</strong></div>
                                    <div><span className="text-slate-500 block">Domain Selected</span><strong className="text-sm text-indigo-400">{selectedStudent.domain || 'N/A'}</strong></div>
                                    <div><span className="text-slate-500 block">Assigned Batch</span><strong className="text-sm">{selectedStudent.batch_selected || 'Unassigned'}</strong></div>
                                    <div><span className="text-slate-500 block">Enrollment Date</span><strong className="text-sm">{selectedStudent.enrollment_date ? new Date(selectedStudent.enrollment_date).toLocaleString() : 'N/A'}</strong></div>
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
                                <form onSubmit={handleSendCustomEmail} className="space-y-3 mt-4 pt-3 border-t border-slate-800/40">
                                    <h5 className="font-bold text-xs">Compose & Send Custom Email</h5>
                                    
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Email Template</label>
                                        <select 
                                            onChange={e => {
                                                const val = e.target.value;
                                                if (val === '') {
                                                    setCustomEmailSubject('');
                                                    setCustomEmailMessage('');
                                                } else {
                                                    handleTemplateSelect(parseInt(val));
                                                }
                                            }} 
                                            className={`w-full p-2 text-xs rounded-lg ${inputBg}`}
                                            defaultValue=""
                                        >
                                            <option value="">-- Select Prewritten Email Template --</option>
                                            {PREWRITTEN_TEMPLATES.map((tpl, idx) => (
                                                <option key={idx} value={idx}>{tpl.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Subject</label>
                                        <Input placeholder="Email Subject Title" value={customEmailSubject} onChange={e => setCustomEmailSubject(e.target.value)} required className={inputBg} />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-slate-400">Message Body</label>
                                        <textarea placeholder="Write email body text..." rows={4} value={customEmailMessage} onChange={e => setCustomEmailMessage(e.target.value)} required className={`w-full p-2 text-xs rounded-lg ${inputBg}`} />
                                    </div>

                                    <div className="flex flex-col gap-2 pt-1">
                                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={attachOfferLetter} 
                                                onChange={e => {
                                                    setAttachOfferLetter(e.target.checked);
                                                    if (e.target.checked) {
                                                        setManualAttachment(null);
                                                        const fileInput = document.getElementById('manual-attachment-input') as HTMLInputElement;
                                                        if (fileInput) fileInput.value = '';
                                                    }
                                                }} 
                                                className="rounded border-slate-700 text-[#14B8A6] focus:ring-[#14B8A6] bg-slate-900" 
                                            />
                                            <span>Auto-generate & attach PDF Offer Letter</span>
                                        </label>

                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-slate-400">Or Attach Custom Offer Letter / File Manually</label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    id="manual-attachment-input"
                                                    type="file" 
                                                    onChange={handleFileChange}
                                                    disabled={attachOfferLetter || isUploadingAttachment}
                                                    className="w-full text-xs text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 disabled:opacity-50"
                                                />
                                                {manualAttachment && (
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setManualAttachment(null);
                                                            const fileInput = document.getElementById('manual-attachment-input') as HTMLInputElement;
                                                            if (fileInput) fileInput.value = '';
                                                        }} 
                                                        className="text-red-400 hover:text-red-300"
                                                        title="Remove attachment"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                            {isUploadingAttachment && <p className="text-[10px] text-teal-400 animate-pulse">Converting file...</p>}
                                            {manualAttachment && (
                                                <p className="text-[10px] text-emerald-400 truncate">
                                                    Attached: {manualAttachment.filename} ({(manualAttachment.content.length * 0.75 / 1024).toFixed(1)} KB)
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <Button type="submit" size="sm" disabled={emailSending || isUploadingAttachment} className="w-full bg-[#14B8A6] hover:bg-[#0D9488] text-white flex gap-1 items-center justify-center">
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

                                {/* Course Registration Group */}
                                <div className="space-y-3">
                                    <h4 className="font-bold text-[#14B8A6] border-b border-slate-800 pb-1">3. Course Registration</h4>
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

            {/* Simple Footer */}
            <footer className="py-6 border-t border-[rgba(20,184,166,0.1)] text-center text-xs text-slate-500 dark:text-slate-400">
                <p>© {new Date().getFullYear()} EDSEC Innovations. All rights reserved. Admin Control Centre.</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
