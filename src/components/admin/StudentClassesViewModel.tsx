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
import { SessionStatus, Student } from "@/lib/types"
import { useEffect, useState } from "react"
import qs from "qs";
import { format } from "date-fns"
import { capitalize } from "@/lib/utils"
import { Presentation } from "lucide-react"


interface Props {
    student: Student;
}

export function StudentClassesViewModel({ student }: Props) {
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        async function fetchSessions() {
            const res = await axios.get("/academic/session", {
                params: {
                    studentId: student.student_id
                },
                paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
            });
            setSessions(res.data);
            console.log(res.data);
        }
        fetchSessions();
    }, [student]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}><Presentation /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>{student.first_name} {student.last_name}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <p className="text-md font-semibold mb-3">Enrolled Sessions</p>
                    <div className="overflow-y-auto max-h-[500px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Classroom</TableHead>
                                    <TableHead>Mentor</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="overflow-y-auto max-h-[300px]">
                                {sessions?.filter((session: any) => session.session_status === SessionStatus.ACCEPTED).length > 0 ? (
                                    sessions
                                        .filter((session: any) => session.session_status === SessionStatus.ACCEPTED)
                                        .map((session: any, index: any) => (
                                            <TableRow key={session.id || index}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>
                                                    {session.classroom.title}
                                                </TableCell>
                                                <TableCell>
                                                    {session.mentor.first_name} {session.mentor.last_name}
                                                </TableCell>
                                                <TableCell>
                                                    {format(new Date(session.start_time), 'hh:mma')} - {format(new Date(session.end_time), 'hh:mma')}
                                                </TableCell>
                                                <TableCell>{format(new Date(session.start_time), 'MMM dd, yyyy')}</TableCell>
                                                <TableCell>{capitalize(session.session_status)}</TableCell>
                                            </TableRow>
                                        ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
