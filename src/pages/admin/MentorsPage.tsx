import { MentorCreateModel } from "@/components/admin/MentorCreateModel";
import { MentorEditModel } from "@/components/admin/MentorEditModel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BACKEND_URL, R2_URL } from "@/config/env";
import { Mentor } from "@/lib/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosWithAuth from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MentorSessionsViewModel } from "@/components/admin/MentorSessionsViewModel";
import { MentorViewModel } from "@/components/admin/MentorViewModel";
import ReactPaginate from "react-paginate";

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const { user } = useUser();
    const { isLoaded } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const axios = useAxiosWithAuth();
    const [search, setSearch] = useState<string>();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const offset = (page - 1) * itemsPerPage;
    const currentItems = mentors.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(mentors.length / itemsPerPage);


    useEffect(() => {
        async function fetchMentors() {
            if (!user) return;

            try {
                const res = await axios.get("/academic/mentor", {
                    params: {
                        search: search,
                    },
                });

                if (res.status === 200) {
                    setMentors(res.data);
                    setLoading(false);
                }
            } catch (error: any) {
                console.log(error);
                toast.error("Error fetching mentors", {
                    description: error?.response?.data?.message || "Something went wrong.",
                })
            }
        }
        if (isLoaded) {
            fetchMentors();
        }

    }, [isLoaded, search]);

    return (

        isLoading ? (
            <div>
                <Breadcrumb className="my-3 flex justify-end">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/admin">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Classroom</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='p-3 bg-white rounded-lg shadow-sm'>

                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <Skeleton className="h-8 w-[200px]" />
                        <Skeleton className="h-8 w-[100px]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                        <div className="md:col-start-3 xl:col-start-4">
                            <Skeleton className="h-8" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Table>
                            <TableCaption><Skeleton className="h-6 w-56" /></TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Skeleton className="h-4 w-5" /></TableHead>
                                    <TableHead className="w-[100px]"><Skeleton className="h-4 w-20" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                                    <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                                    <TableHead className="text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                    <TableCell>
                                        <Skeleton className="h-12 w-20" />
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Skeleton className="h-10 w-10" />
                                            <Skeleton className="h-10 w-20" />
                                            <Skeleton className="h-10 w-20" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                    <TableCell>
                                        <Skeleton className="h-12 w-20" />
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Skeleton className="h-10 w-10" />
                                            <Skeleton className="h-10 w-20" />
                                            <Skeleton className="h-10 w-20" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                    <TableCell>
                                        <Skeleton className="h-12 w-20" />
                                    </TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Skeleton className="h-10 w-10" />
                                            <Skeleton className="h-10 w-20" />
                                            <Skeleton className="h-10 w-20" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        ) : (

            <div>
                <Breadcrumb className="my-3 flex justify-end">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/admin">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Mentors</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='p-3 bg-white rounded-lg shadow-sm'>

                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <h1 className='text-xl font-bold'>Mentors</h1>
                        <MentorCreateModel mentors={mentors} setMentors={setMentors} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                        <div className="md:col-start-3 xl:col-start-4">
                            <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Table>
                            <TableCaption>A list of classes</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead className="w-[100px]">Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead className="text-center">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    currentItems.map((mentor, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}.</TableCell>
                                            <TableCell>
                                                <img src={`${R2_URL + mentor.mentor_image}`} alt="" className="w-20 max-h-20 rounded-sm object-contain shadow-md" />
                                            </TableCell>
                                            <TableCell>{mentor.first_name} {mentor.last_name}</TableCell>
                                            <TableCell>{mentor.email}</TableCell>
                                            <TableCell>{mentor.phone_number}</TableCell>
                                            <TableCell>{mentor.subject}</TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-2">
                                                    <MentorSessionsViewModel mentor={mentor} />
                                                    <MentorViewModel mentor={mentor} />
                                                    <MentorEditModel mentor={mentor} mentors={mentors} setMentors={setMentors} />
                                                    {/* <Button className="bg-red-500 text-white">
                                                        Delete
                                                    </Button> */}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <ReactPaginate
                            pageCount={pageCount}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            onPageChange={(selectedItem) => setPage(selectedItem.selected + 1)}
                            containerClassName="flex justify-center items-center gap-2 mt-4"
                            pageClassName="px-3 py-1 border rounded text-sm"
                            activeClassName="bg-primary text-white"
                            previousLabel="<"
                            nextLabel=">"
                            previousClassName="px-3 py-1 border rounded text-sm"
                            nextClassName="px-3 py-1 border rounded text-sm"
                        />
                    </div>
                </div>
            </div>

        ))
}
