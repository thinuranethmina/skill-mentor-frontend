import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { useAuth, SignInButton, UserButton } from "@clerk/clerk-react";
import SkillMentorLogo from "@/assets/logo.webp";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  setSidebarOpen: (open: boolean) => void;
  sidebarOpen: boolean;
};

export function AdminNavigation({ setSidebarOpen, sidebarOpen }: Props) {
  const { isSignedIn } = useAuth();

  const AuthButtons = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={cn(
        "flex items-center gap-2",
        mobile && "flex-col items-stretch gap-4 w-full"
      )}
    >
      {isSignedIn ? (
        <>
          <Link
            to="/dashboard"
            className={cn(mobile && "w-full")}
            onClick={() => mobile && setSidebarOpen(false)}
          >
            <Button variant="ghost" className={cn(mobile && "w-full")}>
              Dashboard
            </Button>
          </Link>
          <div
            className={cn(
              "flex items-center",
              mobile && "w-full justify-center"
            )}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                },
              }}
            />
          </div>
        </>
      ) : (
        <>
          <SignInButton
            forceRedirectUrl="/dashboard"
            mode="modal"
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary",
              },
            }}
          >
            <Button variant="ghost" className={cn(mobile && "w-full")}>
              Login
            </Button>
          </SignInButton>
          <Link to="/login">
            <Button
              className={cn(
                "bg-primary text-primary-foreground hover:bg-primary/90",
                mobile && "w-full"
              )}
            >
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 py-2 text-white w-full bg-black backdrop-blur supports-[backdrop-filter]:bg-black/90">
      <div className="container flex flex-wrap h-14 items-center justify-between">
        <div className="flex items-center gap-5">

          <button
            className="md:hidden text-white bg-gray-600 p-2 rounded"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {
              sidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )
            }
          </button>

          <Link to="/" className="flex items-center space-x-2">
            <img
              src={SkillMentorLogo}
              alt="SkillMentor Logo"
              className="size-12 rounded-full"
            />
            <span className="font-semibold text-xl">SkillMentor</span>
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">
          <AuthButtons />
        </div>

      </div>
    </header>
  );
}
