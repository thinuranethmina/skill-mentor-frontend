import { MentorCreateModel } from "@/components/admin/MentorCreateModel";
import { MentorEditModel } from "@/components/admin/MentorEditModel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { R2_URL } from "@/config/env";
import { Mentor } from "@/lib/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import useAxiosWithAuth from "@/utils/axiosInstance";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MentorSessionsViewModel } from "@/components/admin/MentorSessionsViewModel";
import { MentorViewModel } from "@/components/admin/MentorViewModel";
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

export default function MentorsPage() {
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const { user } = useUser();
    const { isLoaded } = useAuth();
    const [isLoading, setLoading] = useState(true);
    const axios = useAxiosWithAuth();
    const [search, setSearch] = useState<string>("");

    // Fetch mentors from API
    useEffect(() => {
        async function fetchMentors() {
            if (!user) return;
            try {
                const res = await axios.get("/academic/mentor", { params: { search } });
                if (res.status === 200) {
                    setMentors(res.data);
                    setLoading(false);
                }
            } catch (error: any) {
                console.log(error);
                toast.error("Error fetching mentors", {
                    description: error?.response?.data?.message || "Something went wrong.",
                });
            }
        }
        if (isLoaded) fetchMentors();
    }, [isLoaded, search]);

    // Define table columns
    const columns = useMemo<ColumnDef<Mentor>[]>(
        () => [
            {
                header: "#",
                cell: (info) => info.row.index + 1,
            },
            {
                header: "Image",
                cell: (info) => (
                    <img
                        src={`${R2_URL + info.row.original.mentor_image}`}
                        alt=""
                        className="w-20 max-h-20 rounded-sm object-contain shadow-md"
                    />
                ),
            },
            {
                header: "Name",
                cell: (info) => `${info.row.original.first_name} ${info.row.original.last_name}`,
            },
            {
                header: "Email",
                accessorKey: "email",
            },
            {
                header: "Phone",
                accessorKey: "phone_number",
            },
            {
                header: "Subject",
                accessorKey: "subject",
            },
            {
                id: "action",
                header: () => <div className="text-center">Action</div>,
                cell: (info) => {
                    const mentor = info.row.original;
                    return (
                        <div className="flex justify-center gap-2">
                            <MentorSessionsViewModel mentor={mentor} />
                            <MentorViewModel mentor={mentor} />
                            <MentorEditModel mentor={mentor} mentors={mentors} setMentors={setMentors} />
                        </div>
                    );
                },
            },
        ],
        [mentors]
    );

    // Initialize TanStack table
    const table = useReactTable({
        data: mentors,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
    });

    return isLoading ? (
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
            <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-xl font-bold">Mentors</h1>
                    <MentorCreateModel mentors={mentors} setMentors={setMentors} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                    <div className="md:col-start-3 xl:col-start-4">
                        <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <div className="mt-6">
                    <Table>
                        <TableCaption>A list of mentors</TableCaption>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                                        No mentors found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                            <Button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="bg-white hover:bg-gray-100 border px-3 py-1 rounded">
                                {"<"}
                            </Button>
                            {Array.from({ length: table.getPageCount() }, (_, i) => (
                                <Button
                                    key={i}
                                    onClick={() => table.setPageIndex(i)}
                                    className={`px-3 py-1 border rounded ${i === table.getState().pagination.pageIndex ? "bg-gray-500 text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            <Button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="bg-white hover:bg-gray-100 border px-3 py-1 rounded">
                                {">"}
                            </Button>
                        </div>
                        <select
                            className="border rounded px-2 py-1"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) => table.setPageSize(Number(e.target.value))}
                        >
                            {[5, 10, 20, 50].map((size) => (
                                <option key={size} value={size}>
                                    Show {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
