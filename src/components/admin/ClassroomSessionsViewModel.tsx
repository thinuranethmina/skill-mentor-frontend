import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "../ui/button"
import useAxiosWithAuth from "@/utils/axiosInstance"
import { MentorClass, Session, SessionStatus } from "@/lib/types"
import { useEffect, useState } from "react"
import qs from "qs";
import { format } from "date-fns"
import { Presentation } from "lucide-react"


interface Props {
    classroom: MentorClass;
}

export function ClassroomSessionsViewModel({ classroom }: Props) {
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        async function fetchSessions() {
            const res = await axios.get("/academic/session", {
                params: {
                    classId: classroom.class_room_id
                },
                paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
            });
            setSessions(res.data);
            console.log(res.data);
        }
        fetchSessions();
    }, [classroom]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}><Presentation /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <DialogHeader>
                    <DialogTitle>{classroom.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div>
                        <p className="text-md font-semibold mb-3">Accepted Sessions</p>
                        <div className="overflow-y-auto max-h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Date</TableHead>
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
                                                        {session.student.first_name} {session.student.last_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {format(new Date(session.start_time), 'hh:mma')} - {format(new Date(session.end_time), 'hh:mma')}
                                                    </TableCell>
                                                    <TableCell>{format(new Date(session.start_time), 'MMM dd, yyyy')}</TableCell>
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
                        <p className="text-md font-semibold mb-3">Completed Sessions</p>
                        <div className="overflow-y-auto max-h-[500px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Student</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="overflow-y-auto max-h-[300px]">
                                    {sessions?.filter((session: any) => session.session_status === SessionStatus.COMPLETED).length > 0 ? (
                                        sessions
                                            .filter((session: any) => session.session_status === SessionStatus.COMPLETED)
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
