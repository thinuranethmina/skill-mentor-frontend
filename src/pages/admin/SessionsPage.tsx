import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import useAxiosWithAuth from "@/utils/axiosInstance";
import { toast } from "sonner";
import { FullSession, SessionStatus } from "@/lib/types";
import { format } from "date-fns";
import { SessionEditModel } from "@/components/admin/SessionEditModel";
import { capitalize } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<FullSession[]>([]);
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const axios = useAxiosWithAuth();

  const statuses = Object.values(SessionStatus);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");

  // Fetch sessions from API
  useEffect(() => {
    async function fetchSessions() {
      if (!user) return;
      try {
        const res = await axios.get("/academic/session", {
          params: {
            statuses: selectedStatuses,
            search: search,
          },
          paramsSerializer: (params) => new URLSearchParams(params as any).toString(),
        });

        if (res.status === 200) {
          setSessions(res.data);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
        toast.error("Error fetching sessions", {
          description: error?.response?.data?.message || "Something went wrong.",
        });
      }
    }

    if (isLoaded) fetchSessions();
  }, [isLoaded, selectedStatuses, search]);

  // Handle Delete
  const handleDelete = async (id: number) => {
    toast.error("Warning", {
      description: "Are you sure you want to delete this session? This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await axios.delete(`/academic/session/${id}`);
            if (res.status === 200) {
              toast.success("Session deleted successfully");
              setSessions((prev) => prev.filter((s) => s.session_id !== id));
            }
          } catch (error: any) {
            console.log(error);
            toast.error("Error deleting session", {
              description: error?.response?.data?.message || "Something went wrong.",
            });
          }
        },
      },
    });
  };

  // Define table columns
  const columns = useMemo<ColumnDef<FullSession>[]>(
    () => [
      {
        header: "#",
        cell: (info) => info.row.index + 1,
      },
      {
        header: "Class",
        accessorKey: "classroom.title",
      },
      {
        header: "Mentor",
        cell: (info) => `${info.row.original.mentor.first_name} ${info.row.original.mentor.last_name}`,
      },
      {
        header: "Mentor Email",
        accessorKey: "mentor.email",
      },
      {
        header: "Student",
        cell: (info) => `${info.row.original.student.first_name} ${info.row.original.student.last_name}`,
      },
      {
        header: "Student Email",
        accessorKey: "student.email",
      },
      {
        header: "Scheduled At",
        cell: (info) =>
          `${format(new Date(info.row.original.start_time), "MMM dd, yyyy hh:mma")} - ${format(
            new Date(info.row.original.end_time),
            "hh:mma"
          )}`,
      },
      {
        header: "Status",
        cell: (info) => capitalize(info.row.original.session_status),
      },
      {
        id: "action",
        header: () => <div className="text-center">Action</div>,
        cell: (info) => {
          const session = info.row.original;
          return (
            <div className="flex justify-center gap-2">
              <SessionEditModel session={session} sessions={sessions} setSessions={setSessions} />
              <Button className="bg-red-500 text-white" onClick={() => handleDelete(session.session_id)}>
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [sessions]
  );

  // Initialize TanStack table
  const table = useReactTable({
    data: sessions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
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
            <BreadcrumbPage>Sessions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='p-3 bg-white rounded-lg shadow-sm'>

        <div className="flex flex-col md:flex-row items-center justify-start">
          <Skeleton className="h-8 w-[150px]" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
          <Skeleton className="h-8 w-full md:w-[230px]" />
          <Skeleton className="h-8 w-full md:w-[230px]" />
        </div>
        <div className="mt-6">
          <Table>
            <TableCaption><Skeleton className="h-6 w-56" /></TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className="h-4 w-5" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead><Skeleton className="h-4 w-20" /></TableHead>
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
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
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
            <BreadcrumbPage>Sessions</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-3 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-xl font-bold">Sessions</h1>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full h-auto justify-start text-left">
                {selectedStatuses.length > 0
                  ? selectedStatuses.map((s) => capitalize(s)).join(", ")
                  : "Select Statuses"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
              <div className="flex justify-between gap-5 mb-2 text-sm text-muted-foreground">
                <button type="button" onClick={() => setSelectedStatuses([...statuses])} className="hover:underline">
                  Select All
                </button>
                <button type="button" onClick={() => setSelectedStatuses([])} className="hover:underline">
                  Clear All
                </button>
              </div>
              <div className="grid gap-2">
                {statuses.map((status) => (
                  <label key={status} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() =>
                        setSelectedStatuses((prev) =>
                          prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
                        )
                      }
                      id={status}
                    />
                    <span className="capitalize">{status.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="md:col-start-3 xl:col-start-4">
            <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="mt-6">
          <Table>
            <TableCaption>A list of sessions</TableCaption>
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
                  <TableCell colSpan={9} className="text-center text-gray-500 py-4">
                    No sessions found
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
    </div >
  );
}
