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
import { Mentor, MentorClass } from "@/lib/types"
import { useEffect, useState } from "react"


const schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    mentor: z.string().min(1, "Please select a mentor"),
    class_image: z
        .custom<FileList>((files) => files instanceof FileList && files.length > 0, {
            message: "Image is required",
        })
        .refine((files) => files?.[0]?.type.startsWith("image/"), {
            message: "File must be an image",
        })
        .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, {
            message: "Image size must be less than 5MB",
        }),
});


type FormData = z.infer<typeof schema>;

interface Props {
    classrooms: MentorClass[];
    setClassrooms: React.Dispatch<React.SetStateAction<MentorClass[]>>;
}

export function ClassroomCreateModel({ classrooms, setClassrooms }: Props) {
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

    useEffect(() => {
        async function fetchMentors() {
            const res = await axios.get("/academic/mentor");
            setMentors(res.data);
        }
        fetchMentors();
    }, []);

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    let payload = {};

    const handleSelectMentor = (mentorId: string) => {
        const mentor = mentors.find((m) => m.mentor_id.toString() === mentorId);
        if (mentor) setSelectedMentor(mentor);
    };

    const onSubmit = async (data: FieldValues) => {

        if (!selectedMentor) {
            toast.error("Please select a mentor");
            return;
        }

        payload = {
            ...payload,
            title: data.title,
            enrolled_student_count: 0,
            class_image: data.class_image.name,
            mentor: selectedMentor
        };

        const formData = new FormData();
        formData.append("classroomJson", JSON.stringify(payload));
        formData.append("classRoomImage", data.class_image[0]);

        try {
            const res = await axios.post("/academic/classroom", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                const classroom = res.data;
                if (classroom?.class_room_id) {
                    toast.success("Classroom created successfully");

                    const newClass: MentorClass = {
                        class_room_id: classroom.class_room_id,
                        title: data.title,
                        enrolled_student_count: classroom.enrolled_student_count,
                        class_image: classroom.class_image,
                        mentor: {
                            ...selectedMentor
                        }
                    };

                    setClassrooms([...classrooms, newClass]);
                } else {
                    toast.warning("Classroom created, but response data was unexpected.");
                }

                setOpen(false);
                reset();
            } else {
                toast.warning("Unexpected response from server.");
            }

        } catch (error: any) {
            console.log(error);
            toast.error("Error creating classroom", {
                description: error?.response?.data?.message || "Something went wrong.",
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex self-end md:self-auto" onClick={() => setOpen(true)}>Add Classroom</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <form action="action" onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add Mentor</DialogTitle>
                    </DialogHeader>
                    <div className="grid lg:grid-cols-2 gap-4 mt-3">
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title")} />
                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="mentor">Mentor</Label>
                            <Controller
                                name="mentor"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={(val) => {
                                        field.onChange(val);
                                        handleSelectMentor(val);
                                    }} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Mentor" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {mentors.map((mentor) => (
                                                    <SelectItem
                                                        key={mentor.mentor_id}
                                                        value={mentor.mentor_id.toString()}
                                                    >
                                                        {mentor.first_name} {mentor.last_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.mentor && <p className="text-red-500">{errors.mentor.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="class_image">Class Image</Label>
                            <Input id="class_image" type="file" {...register("class_image")} />
                            {errors.class_image && <p className="text-red-500">{errors.class_image.message}</p>}
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
