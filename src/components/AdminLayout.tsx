
import { Link, NavLink, Outlet } from "react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner"
import { AdminNavigation } from "./AdminNavigation";

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Sessions", path: "/admin/sessions" },
        { name: "Classes", path: "/admin/classes" },
        { name: "Students", path: "/admin/students" },
        { name: "Mentors", path: "/admin/mentors" },
    ];

    return (
        <div>
            <AdminNavigation setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <div className="flex">
                <aside className={`min-w-[250px] min-h-[calc(100vh-4.5rem)] fixed left-0 z-40 bg-black text-white pe-5 py-8 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent supports-[backdrop-filter]:bg-black/95  transform transition-transform duration-700 ease-in-out
                 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:relative md:flex-shrink-0 md:block
                `}>
                    <div>
                        <ul className="list-none flex flex-col gap-4">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink className={({ isActive }) =>
                                        `block p-3 hover:bg-gray-600 rounded-e-full cursor-pointer transition-all duration-300 ease-in-out ${isActive ? "bg-gray-600 shadow-md shadow-gray-400" : "bg-gray-800"
                                        }`
                                    } to={item.path}
                                        onClick={() => setSidebarOpen(false)}>{item.name}</NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
                <main className="flex-1 p-3 md:p-6 overflow-hidden">
                    <Outlet />
                    <Toaster position="top-right" richColors />
                </main>
            </div>
        </div >
    );
}
