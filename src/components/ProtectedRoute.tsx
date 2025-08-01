// src/components/ProtectedRoute.tsx
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function ProtectedRoute({
    children,
    requiredRole,
}: {
    children: React.ReactNode;
    requiredRole: "ADMIN" | "STUDENT";
}) {
    const { user, isLoaded, isSignedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            navigate("/login");
            return;
        }

        const role = user?.publicMetadata?.role;

        if (role !== requiredRole) {
            // Redirect to their dashboard
            if (role === "ADMIN") navigate("/admin");
            else if (role === "MENTOR") navigate("/mentor");
            else navigate("/dashboard");
        }

    }, [isLoaded, isSignedIn, user, requiredRole, navigate]);

    return <>{children}</>;
}
