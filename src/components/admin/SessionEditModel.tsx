import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "../ui/button"
import { Controller, FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosWithAuth from "@/utils/axiosInstance"
import { toast } from "sonner"
import { FullSession, SessionStatus } from "@/lib/types"
import { useEffect, useState } from "react"
import { Calendar } from "../ui/calendar"
import { isAfter, parseISO, format } from "date-fns";
import { Fancybox } from "@fancyapps/ui"
import { R2_URL } from "@/config/env"


const timeStringToDate = (dateStr: string, timeStr: string) => {
    return new Date(`${dateStr}T${timeStr}`);
};

const schema = z.object({
    schedule_date: z.string().min(1, { message: "Schedule date is required" }),
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
    status: z.string().min(1, { message: "Status is required" }),
}).refine((data) => {
    const now = new Date();
    const selectedDate = parseISO(data.schedule_date + " " + data.start_time);
    return !(isAfter(now, selectedDate) && data.status === SessionStatus.ACCEPTED); // schedule_date must be today or future
}, {
    message: "Schedule date cannot be in the past",
    path: ["schedule_date"],
}).refine((data) => {
    const now = new Date();
    const startDateTime = timeStringToDate(data.schedule_date, data.start_time);
    const isDateToday = format(new Date(), "yyyy-MM-dd") === data.schedule_date;

    if (isDateToday) {
        return !(isAfter(now, startDateTime) && data.status === SessionStatus.ACCEPTED); // start time must be in future
    }

    return true; // valid if not today
}, {
    message: "Start time must be in the future if schedule is today",
    path: ["start_time"],
}).refine((data) => {
    const startDateTime = timeStringToDate(data.schedule_date, data.start_time);
    const endDateTime = timeStringToDate(data.schedule_date, data.end_time);
    return isAfter(endDateTime, startDateTime); // end must be after start
}, {
    message: "End time must be after Start time",
    path: ["end_time"],
}).refine((data) => {
    const now = new Date();
    const startDateTime = timeStringToDate(data.schedule_date, data.start_time);

    return !(!isAfter(now, startDateTime) && data.status === SessionStatus.COMPLETED);

}, {
    message: "Still not started",
    path: ["schedule_date"],
});

type FormData = z.infer<typeof schema>;

interface Props {
    session: FullSession;
    sessions: FullSession[];
    setSessions: React.Dispatch<React.SetStateAction<FullSession[]>>;
}

export function SessionEditModel({ session, sessions, setSessions }: Props) {
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            schedule_date: session.start_time ? format(new Date(session.start_time), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
            start_time: session.start_time ? format(new Date(session.start_time), "HH:mm") : "",
            end_time: session.end_time ? format(new Date(session.end_time), "HH:mm") : "",
            status: session.session_status,
        }
    });
    console.log("start_time raw:", session.start_time);
    console.log("parsed:", new Date(session.start_time));

    const onSubmit = async (data: FieldValues) => {

        let payload = {
            session_id: session.session_id,
            start_time: new Date(`${data.schedule_date}T${data.start_time}`).toISOString(),
            end_time: new Date(`${data.schedule_date}T${data.end_time}`).toISOString(),
            student: session.student,
            classroom: session.classroom,
            mentor: session.mentor,
            topic: session.topic,
            session_status: data.status,
            payment_reciept: session.payment_reciept
        };

        console.log(payload);

        try {
            const res = await axios.put("/academic/session", payload);

            if (res.status === 200) {
                const newSession = res.data;
                toast.success("Session updated successfully");

                setSessions(sessions.map((s) => {
                    if (s.session_id === newSession.session_id) {
                        return {
                            ...s,
                            start_time: newSession.start_time,
                            end_time: newSession.end_time,
                            session_status: newSession.session_status,
                        };
                    } else {
                        return s;
                    }
                }));

                setOpen(false);
                reset();
            } else {
                toast.warning("Unexpected response from server.");
            }

        } catch (error: any) {
            console.log(error);
            toast.error("Error updating session", {
                description: error?.response?.data?.message || "Something went wrong.",
            })
        }

    };

    useEffect(() => {
        Fancybox.bind('[data-fancybox="gallery"]', {
            groupAll: true,
        });

        return () => {
            Fancybox.unbind('[data-fancybox="gallery"]');
        };
    }, []);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <form action="action" onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit {session.topic}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="schedule_date">Schedule Date</Label>
                            <Controller
                                name="schedule_date"
                                control={control}
                                render={({ field }) => {
                                    const selectedDate = field.value ? new Date(field.value) : undefined;

                                    return (
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(selectedDate) => {
                                                field.onChange(selectedDate ? format(selectedDate, "yyyy-MM-dd") : "");
                                            }}
                                            defaultMonth={selectedDate}
                                            className="rounded-md border mx-auto"
                                        />
                                    );
                                }}
                            />
                            {errors.schedule_date && (
                                <p className="text-red-500 text-sm">{errors.schedule_date.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="start_time">Start Time</Label>
                                <Input id="start_time" type="time" {...register("start_time")} />
                                {errors.start_time && (
                                    <p className="text-red-500 text-sm">{errors.start_time.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="end_time">End Time</Label>
                                <Input id="end_time" type="time" {...register("end_time")} />
                                {errors.end_time && (
                                    <p className="text-red-500 text-sm">{errors.end_time.message}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(val) => field.onChange(val)}
                                            value={field.value}
                                            {...register("status")}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.status && (
                                    <p className="text-red-500 text-sm">{errors.status.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="col-span-1 lg:col-span-2 flex flex-col gap-4">
                            <p className="font-medium">Payment Receipt</p>
                            <a href={session.payment_reciept} data-fancybox="gallery">
                                <img
                                    src={R2_URL + session.payment_reciept}
                                    className="w-full max-h-[400px] object-contain rounded-md border"
                                />
                            </a>
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
