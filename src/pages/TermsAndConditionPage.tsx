import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/clerk-react';
import { Link } from 'react-router';

export default function TermsAndConditionPage() {
    const { isSignedIn } = useAuth();
    return (
        <div className="py-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
                <div className="space-y-2">
                    <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                        Terms & Conditions
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
                <h2 className="text-2xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
                <p className="mb-6 ms-6">By accessing this website and using our services, you accept these terms and conditions in full. Do not continue to use SkillMentor if you do not agree with any part of these terms.</p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">2. User Accounts</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2 ms-6">
                    <li>You must register for an account to access mentor or student features.</li>
                    <li>You are responsible for maintaining the confidentiality of your account information.</li>
                    <li>You agree to provide accurate and complete information when creating your profile.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-2">3. Mentorship Sessions</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2 ms-6">
                    <li>Mentors are responsible for the content and delivery of their sessions.</li>
                    <li>Students must respect the mentor’s time and follow session schedules.</li>
                    <li>Session fees and cancellation policies are determined by each mentor.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-2">4. Payments and Fees</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2 ms-6">
                    <li>All payments must be made through the SkillMentor platform.</li>
                    <li>SkillMentor may charge a platform fee from mentors for each completed session.</li>
                    <li>Refund policies are defined per session or classroom and are subject to platform review.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-2">5. Code of Conduct</h2>
                <ul className="list-disc pl-6 mb-6 space-y-2 ms-6">
                    <li>Harassment, abuse, or discriminatory behavior will not be tolerated.</li>
                    <li>Users must maintain professionalism and integrity during sessions.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-8 mb-2">6. Intellectual Property</h2>
                <p className="mb-6 ms-6">All content on SkillMentor, including logos, branding, and platform features, are the intellectual property of SkillMentor and cannot be copied or reproduced without permission.</p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">7. Account Suspension</h2>
                <p className="mb-6 ms-6">We reserve the right to suspend or terminate any user account that violates these terms or behaves inappropriately on the platform.</p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">8. Limitation of Liability</h2>
                <p className="mb-6 ms-6">SkillMentor is not liable for any direct or indirect damages arising from mentorship sessions or user interactions.</p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">9. Changes to Terms</h2>
                <p className="mb-6 ms-6">We may update these terms from time to time. Continued use of the platform after changes indicates acceptance of the updated terms.</p>

                <h2 className="text-2xl font-semibold mt-8 mb-2">10. Contact Us</h2>
                <p className="ms-6">If you have any questions about these terms, please contact us at <a href="mailto:support@skillmentor.com" className="text-blue-600 underline">support@skillmentor.com</a>.</p>

            </div>
        </div>
    )
}
