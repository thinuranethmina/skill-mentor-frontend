import { Link } from "react-router";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import SkillMentorLogo from "@/assets/logo.webp";
import { useEffect, useState } from "react";
import { ClassRoom, Mentor } from "@/lib/types";
import useAxiosWithAuth from "@/utils/axiosInstance";
import { toast } from "sonner";

export function Footer() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [classrooms, setClassrooms] = useState<ClassRoom[]>([]);
  const axios = useAxiosWithAuth();

  useEffect(() => {
    async function fetchMentors() {

      try {
        const res = await axios.get("/academic/mentor");

        if (res.status === 200) {
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

  useEffect(() => {
    async function fetchClassrooms() {

      try {
        const res = await axios.get("/academic/classroom");

        if (res.status === 200) {
          setClassrooms(res.data);
        }
      } catch (error: any) {
        console.log(error);
        toast.error("Error fetching classrooms", {
          description: error?.response?.data?.message || "Something went wrong.",
        })
      }
    }
    fetchClassrooms();

  }, []);

  return (
    <footer className="bg-black text-white py-16 supports-[backdrop-filter]:bg-black/95">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/mentors"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Mentors
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-and-conditions"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Join Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Top Classes</h3>
            <ul className="space-y-3">
              {
                classrooms.slice(0, 3).map((classroom) => (
                  <li key={classroom.class_room_id}
                    className="text-gray-400 hover:text-primary transition-colors">
                    {classroom.title}
                  </li>
                ))
              }
            </ul>

          </div>

          {/* Other Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Top Mentors</h3>
            <ul className="space-y-3">
              {
                mentors.slice(0, 3).map((mentor) => (
                  <li key={mentor.mentor_id}>
                    <Link
                      to={`/mentor/${mentor.mentor_id}`}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {mentor.first_name} {mentor.last_name}
                    </Link>
                  </li>
                ))
              }
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <Link
                to="/"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Youtube className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
              <Link
                to="/"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/40">
          <div className="mb-4 md:mb-0 flex items-center space-x-2">
            <img
              src={SkillMentorLogo}
              alt="SkillMentor Logo"
              className="size-16 rounded-full"
            />
            <span className="font-semibold text-5xl">SkillMentor</span>
          </div>
          <p className="text-gray-400 text-sm">
            SkillMentor Inc. © Copyright 2025. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
