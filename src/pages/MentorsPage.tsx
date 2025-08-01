import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { R2_URL } from "@/config/env";
import { Mentor } from "@/lib/types";
import useAxiosWithAuth from "@/utils/axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const axios = useAxiosWithAuth();
    const { isSignedIn } = useAuth();
    const route = useNavigate();

    useEffect(() => {
        async function fetchMentors() {

            try {
                const res = await axios.get("/academic/mentor");

                if (res.status === 200) {
                    console.log(res.data);
                    setMentors(res.data);
                }
            } catch (error: any) {
                console.log(error);
                toast.error("Error fetching mentors", {
                    description: error?.response?.data?.message || "Something went wrong.",
                })
            }
        }
        fetchMentors();
    }, []);

    return (
        <div className="container py-10">

            <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
                <div className="space-y-2">
                    <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        Mentors
                    </h1>
                    <p className="mx-auto text-gray-500 md:text-xl dark:text-gray-400 max-w-xs sm:max-w-full">
                        Empower your career with personalized mentorship for AWS Developer{" "}
                        <br className="hidden sm:block" />
                        Associate, Interview Prep, and more.
                    </p>
                </div>

                {isSignedIn ? (
                    <Link to="/dashboard">
                        <Button size="lg" className="text-xl">
                            Go to Dashboard
                        </Button>
                    </Link>
                ) : (
                    <Link to="/login">
                        <Button size="lg" className="text-xl">
                            Sign up to Start Learning
                        </Button>
                    </Link>
                )}
            </div>


            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3'>
                {
                    mentors.map(mentor => (
                        <Card className="flex flex-col h-full" role="button" onClick={() => route(`/mentor/${mentor.mentor_id}`)}>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className='flex flex-row align-middle justify-between gap-4'>
                                    <div className="flex flex-col items-start">
                                        <h3 className="font-semibold">{mentor.first_name} {mentor.last_name}</h3>
                                        <p className="text-sm text-muted-foreground">{mentor.profession}</p>
                                        <p className="text-sm text-muted-foreground">{mentor.qualification}</p>
                                    </div>
                                    <div>
                                        <img src={R2_URL + mentor.mentor_image} className='w-20 h-20 rounded-full object-cover mx-6' alt={mentor.first_name + " " + mentor.last_name} />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                }
            </div>
        </div>
    )
}
