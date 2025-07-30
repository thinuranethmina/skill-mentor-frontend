import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "../ui/button"
import useAxiosWithAuth from "@/utils/axiosInstance"
import { Mentor } from "@/lib/types"
import { useEffect, useState } from "react"
import qs from "qs";
import { format } from "date-fns"
import { Presentation } from "lucide-react"
import { capitalize } from "@/lib/utils"
import { R2_URL } from "@/config/env"


interface Props {
    mentor: Mentor;
}

export function MentorSessionsViewModel({ mentor }: Props) {
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [classrooms, setClassrooms] = useState([]);

    useEffect(() => {
        async function fetchSessions() {
            const res = await axios.get("/academic/classroom", {
                params: {
                    mentorId: mentor.mentor_id
                },
                paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
            });
            setClassrooms(res.data);
        }
        fetchSessions();
    }, [mentor]);

    useEffect(() => {
        async function fetchSessions() {
            const res = await axios.get("/academic/session", {
                params: {
                    mentorId: mentor.mentor_id
                },
                paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
            });
            setSessions(res.data);
        }
        fetchSessions();
    }, [mentor]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}><Presentation /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>{mentor.first_name} {mentor.last_name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div>
                        <p className="text-md font-semibold mb-3">Mentor's Classes</p>
                        <div className="overflow-y-auto max-h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Enrolled Student Count</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="overflow-y-auto max-h-[300px]">
                                    {classrooms?.length > 0 ? (
                                        classrooms
                                            .map((classroom: any, index: any) => (
                                                <TableRow key={classroom.class_room_id || index}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>
                                                        <img className="w-12 h-12 object-contain" src={R2_URL + classroom.class_image} alt="" />
                                                    </TableCell>
                                                    <TableCell>
                                                        {classroom.title}
                                                    </TableCell>
                                                    <TableCell>{classroom.enrolled_student_count}</TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <div>
                        <p className="text-md font-semibold mb-3">Mentor's Sessions</p>
                        <div className="overflow-y-auto max-h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="overflow-y-auto max-h-[300px]">
                                    {sessions?.length > 0 ? (
                                        sessions
                                            .map((session: any, index: any) => (
                                                <TableRow key={session.id || index}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>
                                                        {session.student.first_name} {session.student.last_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(session.start_time), 'hh:mma')} - {format(new Date(session.end_time), 'hh:mma')}
                                                    </TableCell>
                                                    <TableCell>{format(new Date(session.start_time), 'MMM dd, yyyy')}</TableCell>
                                                    <TableCell>
                                                        {capitalize(session.session_status)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center text-gray-500 py-4">
                                                No data available
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
