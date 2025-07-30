import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import React from 'react'
import { Link } from 'react-router';

export default function AboutPage() {
    const { isSignedIn } = useAuth();
    return (
        <div className="py-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
                <div className="space-y-2">
                    <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        About Us
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

            <div className="space-y-8 mt-8 container bg-background">
                <p>
                    At <strong>SkillMentor</strong>, we believe that personalized guidance can unlock true learning potential.
                    Our platform connects students with experienced mentors for one-on-one or group sessions in a wide range of
                    subjects and skills.
                </p>

                <p>
                    Whether you're looking to master a programming language, improve your public speaking, or get help with
                    academic topics, SkillMentor makes it easy to find the right mentor for your goals. Our system is built with
                    flexibility and transparency in mind—allowing students to view mentor profiles, session fees, schedules, and
                    even classroom details before booking.
                </p>

                <p>
                    For mentors, SkillMentor offers a streamlined way to manage classrooms, conduct sessions, and engage with
                    students—all while earning from their expertise. Our platform handles scheduling, communication, and session
                    tracking, so mentors can focus on what they do best: teaching.
                </p>

                <p>
                    We are committed to fostering a supportive, knowledge-sharing community where learning never stops.
                </p>
            </div>
        </div>
    )
}
