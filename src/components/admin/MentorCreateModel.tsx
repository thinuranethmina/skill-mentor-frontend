import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import { Button } from "../ui/button"
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosWithAuth from "@/utils/axiosInstance"
import { toast } from "sonner"
import { Textarea } from "../ui/textarea"
import { Mentor } from "@/lib/types"
import { useState } from "react"

const schema = z.object({
    fname: z.string().min(1, { message: "First name is required" }),
    lname: z.string(),
    email: z.string().email({ message: "Invalid email" }),
    phone: z.string().min(10, { message: "Invalid phone number" }),
    qualification: z.string().min(1, { message: "Qualification is required" }),
    profession: z.string().min(1, { message: "Profession is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    subject: z.string().min(1, { message: "Subject is required" }),
    session_fee: z
        .number("Price must be a number")
        .positive("Price must be greater than 0"),
    mentor_image: z
        .custom<FileList>((files) => files instanceof FileList && files.length > 0, {
            message: "Image is required",
        })
        .refine((files) => files?.[0]?.type.startsWith("image/"), {
            message: "File must be an image",
        })
        .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, {
            message: "Image size must be less than 5MB",
        }),
    address: z.string().min(1, { message: "Address is required" }),
    bio: z.string().min(1, { message: "Bio is required" }),
});

type FormData = z.infer<typeof schema>;

interface Props {
    mentors: Mentor[];
    setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
}

export function MentorCreateModel({ mentors, setMentors }: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);
    const [process, setProcess] = useState(false);

    const onSubmit = async (data: FieldValues) => {
        setProcess(true);

        const payload = {
            first_name: data.fname,
            last_name: data.lname,
            email: data.email,
            phone_number: data.phone,
            qualification: data.qualification,
            profession: data.profession,
            title: data.title,
            subject: data.subject,
            session_fee: data.session_fee,
            mentor_image: data.mentor_image.name,
            address: data.address,
            clerk_mentor_id: Math.random().toString(),
            bio: data.bio,
        };

        const formData = new FormData();
        formData.append("mentorJson", JSON.stringify(payload));
        formData.append("mentor_image", data.mentor_image[0]);

        try {
            const res = await axios.post("/academic/mentor", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 200) {
                const mentor = res.data;
                if (mentor?.mentor_id) {
                    toast.success("Mentor created successfully");
                    const newMentor = {
                        ...payload,
                        mentor_id: mentor?.mentor_id,
                        mentor_image: mentor?.mentor_image,
                        classrooms: [],
                    };

                    setMentors([...mentors, newMentor]);
                } else {
                    toast.warning("Mentor created, but response data was unexpected.");
                }

                setOpen(false);
                reset();
            } else {
                toast.warning("Unexpected response from server.");
            }

        } catch (error: any) {
            console.log(error);
            toast.error("Error creating mentor", {
                description: error?.response?.data?.message || "Something went wrong.",
            })
        } finally {
            setProcess(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex self-end md:self-auto" onClick={() => setOpen(true)}>Add Mentor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <form action="action" onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Add Mentor</DialogTitle>
                    </DialogHeader>
                    <div className="grid lg:grid-cols-2 gap-4 mt-3">
                        <div className="grid gap-3">
                            <Label htmlFor="fname">First Name</Label>
                            <Input id="fname" {...register("fname")} />
                            {errors.fname && <p className="text-red-500">{errors.fname.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="lname">Last Name</Label>
                            <Input id="lname" {...register("lname")} />
                            {errors.lname && <p className="text-red-500">{errors.lname.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" {...register("email")} />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...register("phone")} />
                            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="qualification">Qualification</Label>
                            <Input id="qualification" {...register("qualification")} />
                            {errors.qualification && <p className="text-red-500">{errors.qualification.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="profession">Profession</Label>
                            <Input id="profession" {...register("profession")} />
                            {errors.profession && <p className="text-red-500">{errors.profession.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" {...register("title")} />
                            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="profession">Subject</Label>
                            <Input id="profession" {...register("subject")} />
                            {errors.subject && <p className="text-red-500">{errors.subject.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="session_fee">Session Fee</Label>
                            <Input id="session_fee" type="number" {...register("session_fee", { valueAsNumber: true })} />
                            {errors.session_fee && <p className="text-red-500">{errors.session_fee.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="image">Profile Image</Label>
                            <Input id="image" type="file" {...register("mentor_image")} />
                            {errors.mentor_image && <p className="text-red-500">{errors.mentor_image.message}</p>}
                        </div>
                        <div className="grid gap-3 lg:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Textarea id="address" {...register("address")} />
                            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
                        </div>
                        <div className="grid gap-3 lg:col-span-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" {...register("bio")} />
                            {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={process}>{process ? "Creating..." : "Create Mentor"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
