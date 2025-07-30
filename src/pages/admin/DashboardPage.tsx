import { Skeleton } from '@/components/ui/skeleton';
import useAxiosWithAuth from '@/utils/axiosInstance';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react'
import { toast } from 'sonner';

export default function DashboardPage() {
    const { user } = useUser();
    const { isLoaded } = useAuth();
    const axios = useAxiosWithAuth();
    const [isLoading, setLoading] = useState(true);
    const [classrooms, setClassrooms] = useState<number>(0);
    const [students, setStudents] = useState<number>(0);
    const [mentors, setMentors] = useState<number>(0);
    const [pendingSessions, setPendingSessions] = useState<number>(0);
    const [acceptedSessions, setAcceptedSessions] = useState<number>(0);
    const [completedSessions, setCompletedSessions] = useState<number>(0);

    useEffect(() => {
        async function fetchDashboard() {
            if (!user) return;

            try {
                const res = await axios.get("/academic/dashboard");

                if (res.status === 200) {
                    const data = res.data;
                    setClassrooms(data['classrooms']);
                    setStudents(data['students']);
                    setMentors(data['mentors']);
                    setPendingSessions(data['pending_sessions']);
                    setAcceptedSessions(data['accepted_sessions']);
                    setCompletedSessions(data['completed_sessions']);
                    setLoading(false);
                }
            } catch (error: any) {
                console.log(error);
                toast.error("Error fetching classrooms", {
                    description: error?.response?.data?.message || "Something went wrong.",
                })
            }
        }
        if (isLoaded) {
            fetchDashboard();
        }
    }, [isLoaded]);

    return (

        isLoading ?
            (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    <div className='h-[60px] bg-gray-300 text-white px-3 rounded-md flex justify-between items-center'>
                        <Skeleton className='h-[18px] w-44' />
                        <Skeleton className='h-[18px] w-6' />
                    </div>

                    <div className='h-[60px] bg-gray-300 text-white px-3 rounded-md flex justify-between items-center'>
                        <Skeleton className='h-[18px] w-44' />
                        <Skeleton className='h-[18px] w-6' />
                    </div>

                    <div className='h-[60px] bg-gray-300 text-white px-3 rounded-md flex justify-between items-center'>
                        <Skeleton className='h-[18px] w-44' />
                        <Skeleton className='h-[18px] w-6' />
                    </div>

                    <div className='h-[60px] bg-gray-300 text-white px-3 rounded-md flex justify-between items-center'>
                        <Skeleton className='h-[18px] w-44' />
                        <Skeleton className='h-[18px] w-6' />
                    </div>

                    <div className='h-[60px] bg-gray-300 text-white px-3 rounded-md flex justify-between items-center'>
                        <Skeleton className='h-[18px] w-44' />
                        <Skeleton className='h-[18px] w-6' />
                    </div>

                    <div className='h-[60px] bg-gray-300 text-white px-3 rounded-md flex justify-between items-center'>
                        <Skeleton className='h-[18px] w-44' />
                        <Skeleton className='h-[18px] w-6' />
                    </div>

                </div>
            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

                    <div className='h-[60px] bg-red-700 text-white px-3 rounded-md flex justify-between items-center'>
                        <p>Accepted Sessions</p>
                        <p>{acceptedSessions}</p>
                    </div>

                    <div className='h-[60px] bg-orange-600 text-white px-3 rounded-md flex justify-between items-center'>
                        <p>All Classes</p>
                        <p>{classrooms}</p>
                    </div>

                    <div className='h-[60px] bg-pink-600 text-white px-3 rounded-md flex justify-between items-center'>
                        <p>All Students</p>
                        <p>{students}</p>
                    </div>

                    <div className='h-[60px] bg-purple-700 text-white px-3 rounded-md flex justify-between items-center'>
                        <p>All Mentors</p>
                        <p>{mentors}</p>
                    </div>

                    <div className='h-[60px] bg-blue-600 text-white px-3 rounded-md flex justify-between items-center'>
                        <p>Pending Sessions</p>
                        <p>{pendingSessions}</p>
                    </div>

                    <div className='h-[60px] bg-slate-600 text-white px-3 rounded-md flex justify-between items-center'>
                        <p>Completed Sessions</p>
                        <p>{completedSessions}</p>
                    </div>

                </div>

            )

    )
}
