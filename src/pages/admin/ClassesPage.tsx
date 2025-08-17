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
import { R2_URL } from "@/config/env"
import { MentorClass } from "@/lib/types"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
import { Link } from "react-router"
import useAxiosWithAuth from "@/utils/axiosInstance"
import { toast } from "sonner"
import { ClassroomCreateModel } from "@/components/admin/ClassroomCreateModel"
import { ClassroomEditModel } from "@/components/admin/ClassroomEditModel"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ClassroomSessionsViewModel } from "@/components/admin/ClassroomSessionsViewModel"
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    ColumnDef,
    flexRender,
} from "@tanstack/react-table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const getColumns = (
    classrooms: MentorClass[],
    setClassrooms: React.Dispatch<React.SetStateAction<MentorClass[]>>,
    handleDelete: (id: number) => void
): ColumnDef<MentorClass>[] => [
        {
            header: "#",
            cell: (info) => info.row.index + 1,
        },
        {
            header: "Image",
            accessorKey: "class_image",
            cell: (info) => (
                <img
                    src={R2_URL + info.getValue<string>()}
                    alt=""
                    className="w-20 max-h-20 rounded-sm object-contain shadow-md"
                />
            ),
        },
        {
            header: "Title",
            accessorKey: "title",
        },
        {
            header: "Mentor",
            cell: (info) =>
                `${info.row.original.mentor.first_name} ${info.row.original.mentor.last_name}`,
        },
        {
            header: "Mentor Phone",
            cell: (info) => info.row.original.mentor.phone_number,
        },
        {
            header: "Enrolled Students",
            accessorKey: "enrolled_student_count",
        },
        {
            id: "action",
            header: () => <div className="text-center">Action</div>,
            cell: (info) => {
                const classroom = info.row.original
                return (
                    <div className="flex justify-center gap-2">
                        <ClassroomSessionsViewModel classroom={classroom} />
                        <ClassroomEditModel
                            classroom={classroom}
                            classrooms={classrooms}
                            setClassrooms={setClassrooms}
                        />
                        <Button
                            className="bg-red-500 text-white"
                            onClick={() => handleDelete(classroom.class_room_id)}
                        >
                            Delete
                        </Button>
                    </div>
                )
            },
        },
    ]

export default function ClassesPage() {
    const [classrooms, setClassrooms] = useState<MentorClass[]>([])
    const { user } = useUser()
    const { isLoaded } = useAuth()
    const [isLoading, setLoading] = useState(true)
    const axios = useAxiosWithAuth()
    const [search, setSearch] = useState<string>()

    useEffect(() => {
        async function fetchClassrooms() {
            if (!user) return

            try {
                const res = await axios.get("/academic/classroom", {
                    params: {
                        search: search,
                    },
                })

                if (res.status === 200) {
                    setClassrooms(res.data)
                    setLoading(false)
                }
            } catch (error: any) {
                console.log(error)
                toast.error("Error fetching classrooms", {
                    description:
                        error?.response?.data?.message || "Something went wrong.",
                })
            }
        }
        if (isLoaded) {
            fetchClassrooms()
        }
    }, [isLoaded, search])

    const handleDelete = async (id: number) => {
        toast.error("Warning", {
            description:
                "Are you sure you want to delete this classroom? This action cannot be undone.",
            action: {
                label: "Delete",
                onClick: async () => {
                    try {
                        const res = await axios.delete(`/academic/classroom/${id}`)
                        if (res.status === 200) {
                            toast.success("Classroom deleted successfully")
                            setClassrooms(
                                classrooms.filter(
                                    (classroom) => classroom.class_room_id !== id
                                )
                            )
                        }
                    } catch (error: any) {
                        console.log(error)
                        toast.error("Error deleting classroom", {
                            description:
                                error?.response?.data?.message || "Something went wrong.",
                        })
                    }
                },
            },
        })
    }

    const table = useReactTable({
        data: classrooms,
        columns: getColumns(classrooms, setClassrooms, handleDelete),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    })

    return isLoading ? (
        // 🔹 Loading skeleton
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
            <div className="p-3 bg-white rounded-lg shadow-sm">
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
                        <TableCaption>
                            <Skeleton className="h-6 w-56" />
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                {[...Array(7)].map((_, i) => (
                                    <TableHead key={i}>
                                        <Skeleton className="h-4 w-20" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-6 w-20" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    ) : (
        // 🔹 Main table
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
            <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between">
                    <h1 className="text-xl font-bold">Classrooms</h1>
                    <ClassroomCreateModel
                        classrooms={classrooms}
                        setClassrooms={setClassrooms}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
                    <div className="md:col-start-3 xl:col-start-4">
                        <Input
                            placeholder="Search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mt-6">
                    <Table>
                        <TableCaption>A list of classes</TableCaption>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={table.getAllColumns().length}
                                        className="text-center text-gray-500 py-4"
                                    >
                                        No classes found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
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
                                    // disabled={i === table.getState().pagination.pageIndex}
                                    className={`px-3 py-1 rounded ${i === table.getState().pagination.pageIndex
                                        ? "bg-gray-500 text-white"
                                        : "bg-gray-200 text-gray-800"
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

                        <Select
                            defaultValue={table.getState().pagination.pageSize.toString()}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select page size" />
                            </SelectTrigger>
                            <SelectContent>
                                {[5, 10, 20, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={pageSize.toString()}>
                                        Show {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    )
}
