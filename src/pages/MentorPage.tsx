
import { SchedulingModal } from '@/components/SchedulingModel';
import { SignupDialog } from '@/components/SignUpDialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { R2_URL } from '@/config/env';
import { Mentor } from '@/lib/types';
import useAxiosWithAuth from '@/utils/axiosInstance';
import { useAuth } from '@clerk/clerk-react';
import { GraduationCap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'sonner';

export default function MentorPage() {
    const { id } = useParams();
    const axios = useAxiosWithAuth();
    const [isLoading, setLoading] = useState(true);
    const [mentor, setMentor] = useState<Mentor>({} as Mentor);
    const { isSignedIn } = useAuth();
    const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
    const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false);


    useEffect(() => {
        async function fetchMentor() {

            try {
                const res = await axios.get("/academic/mentor/" + id);

                if (res.status === 200) {
                    setMentor(res.data);
                    setLoading(false);
                }
            } catch (error: any) {
                console.log(error);
                toast.error("Error fetching mentor details", {
                    description: error?.response?.data?.message || "Something went wrong.",
                })
            }
        }
        fetchMentor();
    }, [id]);

    const handleSchedule = () => {
        if (!isSignedIn) {
            setIsSignupDialogOpen(true);
            return;
        }
        setIsSchedulingModalOpen(true);
    };


    return (

        isLoading ? (
            <div className="container py-10" >
                <div className="grid grid-cols-1 gap-4 bg-white p-10 rounded-lg">

                    <div>
                        <div className='w-40 h-40 mx-auto overflow-hidden rounded-full'>
                            <Skeleton className='w-40 h-40' />
                        </div >
                    </div >

                    <div className='rounded-md'>
                        <Skeleton className='w-full h-16' />
                    </div>

                    <div className='rounded-md'>
                        <Skeleton className='w-full h-16' />
                    </div>

                    <div className='rounded-md'>
                        <Skeleton className='w-full h-16' />
                    </div>

                    <div className='rounded-md'>
                        <Skeleton className='w-full h-16' />
                    </div>

                    <div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3'>

                            <Skeleton className='w-full h-60' />
                            <Skeleton className='w-full h-60' />
                            <Skeleton className='w-full h-60' />
                            <Skeleton className='w-full h-60' />
                            <Skeleton className='w-full h-60' />
                            <Skeleton className='w-full h-60' />

                        </div>
                    </div>

                </div >

            </div>
        ) : (

            <div className="container py-10">
                <div className="grid grid-cols-1 gap-4 bg-white p-10 rounded-lg">

                    <div>
                        <div className='w-40 h-40 mx-auto overflow-hidden rounded-full'>
                            <img className='w-40 h-40 object-cover transition-all duration-700 hover:scale-110' src={R2_URL + mentor.mentor_image} alt={mentor.first_name + " " + mentor.last_name} />
                        </div >
                    </div >

                    <div className='flex flex-col md:flex-row gap-2 md:gap-5 rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-300'>
                        <p className='font-semibold'>Name:</p>
                        <p>{mentor.first_name} {mentor.last_name}</p>
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 md:gap-5 rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-300'>
                        <p className='font-semibold'>Profession:</p>
                        <p>{mentor.profession}</p>
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 md:gap-5 rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-300'>
                        <p className='font-semibold'>Qualifications:</p>
                        <p>{mentor.qualification}</p>
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 md:gap-5 rounded-md border border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-300'>
                        <p className='font-semibold'>Bio:</p>
                        <p>{mentor.bio}</p>
                    </div>

                    <div className='flex flex-col gap-3 rounded-md border border-gray-200 p-4'>
                        <p className='font-semibold'>Classes:</p>
                        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3'>
                            {
                                mentor.classrooms.map((classroom) => {

                                    const mentorclassroom = {
                                        class_room_id: classroom.class_room_id,
                                        title: classroom.title,
                                        enrolled_student_count: classroom.enrolled_student_count,
                                        class_image: classroom.class_image,
                                        mentor: {
                                            mentor_id: mentor.mentor_id,
                                            clerk_mentor_id: mentor.clerk_mentor_id,
                                            first_name: mentor.first_name,
                                            last_name: mentor.last_name,
                                            address: mentor.address,
                                            email: mentor.email,
                                            title: mentor.title,
                                            session_fee: mentor.session_fee,
                                            profession: mentor.profession,
                                            subject: mentor.subject,
                                            phone_number: mentor.phone_number,
                                            qualification: mentor.qualification,
                                            mentor_image: mentor.mentor_image,
                                            bio: mentor.bio,
                                        }
                                    };

                                    return (
                                        <Card className="flex flex-col h-full">
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className='flex flex-row align-middle justify-between gap-4'>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-semibold">{classroom.title}</h3>
                                                    </div>
                                                    <div>
                                                        <img src={R2_URL + classroom.class_image} className='w-20 h-20 object-contain mx-6' alt={classroom.title} />
                                                    </div>
                                                </div>
                                                <div className="mt-5">
                                                    <h4 className="font-medium mb-2">Highlights</h4>
                                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-md flex flex-col gap-4">
                                                        <div className="flex items-center space-x-2">
                                                            <GraduationCap className="w-4 h-4" />
                                                            <span className="text-sm">
                                                                {classroom.enrolled_student_count} Enrollments
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4">
                                                    <Button
                                                        onClick={handleSchedule}
                                                        className="w-full bg-black text-white hover:bg-black/90"
                                                    >
                                                        Schedule a session
                                                    </Button>
                                                </div>
                                            </div>
                                            <SchedulingModal
                                                isOpen={isSchedulingModalOpen}
                                                onClose={() => setIsSchedulingModalOpen(false)}
                                                mentorClass={mentorclassroom}
                                            />
                                        </Card>
                                    );
                                })
                            }
                        </div>
                    </div>

                </div >

                <SignupDialog
                    isOpen={isSignupDialogOpen}
                    onClose={() => setIsSignupDialogOpen(false)}
                />

            </div >
        )
    )
}
