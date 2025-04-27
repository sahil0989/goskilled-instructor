import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart, Book, IndianRupee, LogOut, User } from 'lucide-react';
import InstructorCourses from '../components/courses';
import { Button } from '../@/components/ui/button';
import { Tabs, TabsContent } from '../@/components/ui/tabs';
import { useInstructor } from '../context/instructor-context/InstructorContext';
import { fetchInstructorCourseListService } from '../services';
import AdminPayments from '../components/PaymentComponent';
import AdminKYCPanel from '../components/AdminKYCDashboard';
import AdminUsersPage from '../components/instructor-view';

export default function Dashboard() {

    const { user, logout } = useAuth()
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('dashboard')
    const { instructorCoursesList, setInstructorCoursesList } = useInstructor();

    async function fetchAllCourses() {
        console.log("Fetching.....")
        const response = await fetchInstructorCourseListService();
        console.log("Course Response: ", response)
        if (response?.success) setInstructorCoursesList(response?.data);
    }

    useEffect(() => {
        fetchAllCourses();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const handleLogin = () => {
            const storedUser = localStorage.getItem("user");
            if (!storedUser) {
                navigate("/")
            }
        }
        handleLogin()
    }, [user, navigate]);

    const menuItems = [
        {
            icon: BarChart,
            label: "Dashboard",
            value: "dashboard",
            component: <AdminUsersPage />,
        },
        {
            icon: Book,
            label: "Courses",
            value: "courses",
            component: <InstructorCourses listOfCourses={instructorCoursesList} />,
        },
        {
            icon: IndianRupee,
            label: "Payments",
            value: "payments",
            component: <AdminPayments />
        },
        {
            icon: User,
            label: "KYC Approval",
            value: "kycpannel",
            component: <AdminKYCPanel />
        },
        {
            icon: LogOut,
            label: "Logout",
            value: "logout",
            component: null,
        },
    ];

    return (
        <>
            <div className='flex h-full min-h-screen bg-gray-100'>
                <aside className='w-64 bg-white'>
                    <h2 className='text-2xl font-bold mb-4'>Instructor view</h2>
                    <nav>
                        {
                            menuItems.map((menuItems) => {
                                return <Button
                                    key={menuItems.value}
                                    onClick={menuItems.value === 'logout' ? logout : () => setActiveTab(menuItems.value)}
                                    variant={activeTab === menuItems.value ? "secondary" : "ghost"}
                                    className='w-full justify-start mb-2'>
                                    <menuItems.icon className='mr-2 h-4 w-4' />{menuItems.label}
                                </Button>
                            })
                        }
                    </nav>
                </aside>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            {menuItems.map((menuItem) => (
                                <TabsContent key={menuItem.value} value={menuItem.value}>
                                    {menuItem.component !== null ? menuItem.component : null}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>
                </main>
            </div>
        </>
    )
}
