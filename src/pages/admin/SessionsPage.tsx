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
import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxiosWithAuth from "@/utils/axiosInstance";
import { toast } from "sonner";
import { FullSession, SessionStatus } from "@/lib/types";
import { format } from "date-fns";
import { SessionEditModel } from "@/components/admin/SessionEditModel";
import { capitalize } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import qs from "qs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import ReactPaginate from 'react-paginate';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<FullSession[]>([]);
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const [isLoading, setLoading] = useState(true);
  const axios = useAxiosWithAuth();
  const statuses = Object.values(SessionStatus);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [search, setSearch] = useState<string>();
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;
  const currentItems = sessions.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sessions.length / itemsPerPage);

  useEffect(() => {
    async function fetchSessions() {
      if (!user) return;

      try {
        const res = await axios.get("/academic/session", {
          params: {
            statuses: selectedStatuses,
            search: search,
          },
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
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

    if (isLoaded) {
      fetchSessions();
    }
  }, [isLoaded, selectedStatuses, search]);

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
              setSessions(sessions.filter((session) => session.session_id !== id));
            }
          } catch (error: any) {
            console.log(error);
            toast.error("Error deleting session", {
              description: error?.response?.data?.message || "Something went wrong.",
            })
          }
        },
      },
    })

  }
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
              </BreadcrumbLink >
            </BreadcrumbItem >
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Sessions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList >
        </Breadcrumb >
        <div className='p-3 bg-white rounded-lg shadow-sm'>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <h1 className='text-xl font-bold'>Sessions</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-6">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full h-auto justify-start text-left text-wrap">
                    {selectedStatuses.length > 0
                      ? selectedStatuses
                        .map(status => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())
                        .join(", ")
                      : "Select Statuses"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full">
                  <div className="flex justify-between gap-5 mb-2 text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setSelectedStatuses([...statuses])}
                      className="hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStatuses([])}
                      className="hover:underline"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="grid gap-2">
                    {statuses.map((status) => (
                      <label key={status} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={selectedStatuses.includes(status)}
                          onCheckedChange={() => {
                            setSelectedStatuses((prev) =>
                              prev.includes(status)
                                ? prev.filter((s) => s !== status)
                                : [...prev, status]
                            );
                          }}
                          id={status}
                        />
                        <span className="capitalize">{status.toLowerCase()}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-start-3 xl:col-start-4">
              <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="mt-6">
            <Table>
              <TableCaption>A list of sessions</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Mentor</TableHead>
                  <TableHead>Mentor Email</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Student Email</TableHead>
                  <TableHead>Scheduled At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {

                  currentItems.map((session, index) => (
                    <TableRow key={index}>
                      <TableCell>{offset + index + 1}.</TableCell>
                      <TableCell>{session.classroom.title}</TableCell>
                      <TableCell>{session.mentor.first_name} {session.mentor.last_name}</TableCell>
                      <TableCell>{session.mentor.email}</TableCell>
                      <TableCell>{session.student.first_name} {session.student.last_name}</TableCell>
                      <TableCell>{session.student.email}</TableCell>
                      <TableCell>{format(new Date(session.start_time), 'MMM dd, yyyy hh:mma')} - {format(new Date(session.end_time), 'hh:mma')}</TableCell>
                      <TableCell>{capitalize(session.session_status)}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-2">
                          <SessionEditModel session={session} sessions={sessions} setSessions={setSessions} />
                          <Button className="bg-red-500 text-white" onClick={() => (handleDelete(session.session_id))}>
                            Delete
                          </Button>
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
      </div >

    ))
}
