import { MentorCard } from "@/components/MentorCard";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { MentorClass } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useAxiosWithAuth from "@/utils/axiosInstance";

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [mentorClasses, setMentorClasses] = useState<MentorClass[]>([]);
  const axios = useAxiosWithAuth();

  // Load all mentor classes
  useEffect(() => {

    async function fetchMentorClasses() {
      if (!axios) return;
      try {
        const response = await axios.get("/academic/classroom")

        if (response.status === 200) {
          const data = response.data;
          setMentorClasses(data);
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log(error)
        toast.error("Error fetching classrooms", {
          description:
            error?.response?.data?.message || "Something went wrong.",
        })
      }

    }

    fetchMentorClasses();

  }, [axios]);

  return (
    <div className="py-10">
      <div className="flex flex-col items-center justify-center space-y-8 text-center py-8">
        <div className="space-y-2">
          <h1 className="text-5xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Find your SkillMentor
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
        <h1 className="lg:text-5xl md:text-4xl sm:text-3xl text-3xl">
          Schedule a Call
        </h1>
        {
          isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-xl">
                          <Skeleton className="h-5 w-52"></Skeleton>
                          <Skeleton className="h-5 w-24 mt-2"></Skeleton>
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-6 w-6 rounded-full"></Skeleton>
                          <Skeleton className="h-4 w-20"></Skeleton>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Skeleton className="size-6" />
                          <Skeleton className="h-4 w-36"></Skeleton>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Skeleton className="size-6" />
                          <Skeleton className="h-4 w-28"></Skeleton>
                        </div>
                      </div>
                      <div className="w-36">
                        <div className="size-20 bg-muted flex items-center justify-center">
                          <Skeleton></Skeleton>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 flex flex-col gap-2">
                      <Skeleton className="h-3 w-100"></Skeleton>
                      <Skeleton className="h-3 w-100"></Skeleton>
                      <Skeleton className="h-3 w-100"></Skeleton>
                      <Skeleton className="h-3 w-40"></Skeleton>
                    </div>

                    <div className="mt-auto">
                      <Skeleton className="h-5 w-28"></Skeleton>
                      <div className="flex flex-col gap-3 mt-3">
                        <Skeleton className="h-9 w-100"></Skeleton>
                        <Skeleton className="h-9 w-100"></Skeleton>
                      </div>
                    </div>
                  </div>

                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mentorClasses.map((mentorClass) => (
                <MentorCard
                  key={mentorClass.class_room_id}
                  mentorClass={mentorClass}
                />
              ))}
            </div>
          )
        }

      </div>
    </div >
  );
}
