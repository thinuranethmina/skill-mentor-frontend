import {
    Dialog,
    DialogContent,
    DialogDescription,
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
    image: z
        .custom<FileList | undefined>((files) => {
            return !files || files instanceof FileList;
        }, {
            message: "Invalid file input",
        })
        .refine(
            (files) => !files || files.length === 0 || files[0]?.type.startsWith("image/"),
            {
                message: "File must be an image",
            }
        )
        .refine(
            (files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
            {
                message: "Image size must be less than 5MB",
            }
        )
        .optional(),
    address: z.string().min(1, { message: "Address is required" }),
    bio: z.string().min(1, { message: "Bio is required" }),
});

type FormData = z.infer<typeof schema>;

interface Props {
    mentor: Mentor;
    mentors: Mentor[];
    setMentors: React.Dispatch<React.SetStateAction<Mentor[]>>;
}

export function MentorEditModel({ mentor, mentors, setMentors }: Props) {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fname: mentor.first_name,
            lname: mentor.last_name,
            email: mentor.email,
            phone: mentor.phone_number,
            qualification: mentor.qualification,
            profession: mentor.profession,
            title: mentor.title,
            subject: mentor.subject,
            session_fee: mentor.session_fee,
            address: mentor.address,
            bio: mentor.bio,
        }
    });
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: FieldValues) => {
        const payload = {
            mentor_id: mentor.mentor_id,
            first_name: data.fname,
            last_name: data.lname,
            email: data.email,
            phone_number: data.phone,
            qualification: data.qualification,
            profession: data.profession,
            title: data.title,
            subject: data.subject,
            session_fee: data.session_fee,
            mentor_image: mentor.mentor_image,
            address: data.address,
            clerk_mentor_id: Math.random().toString(),
            bio: data.bio,
        };

        const formData = new FormData();
        formData.append("mentorJson", JSON.stringify(payload));
        if (data.image) {
            formData.append("mentorImage", data.image[0]);
        }

        try {
            const res = await axios.put("/academic/mentor", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.status === 200) {
                const mentor = res.data;
                toast.success("Mentor update successfully");
                const updatedMentor = {
                    ...mentor,
                    ...payload,
                    mentor_image: mentor.mentor_image
                };

                setMentors(mentors.map((m) => (m.mentor_id === mentor.mentor_id ? updatedMentor : m)));


                setOpen(false);
                reset();
            } else {
                toast.warning("Unexpected response from server.");
            }

        } catch (error: any) {
            toast.error("Error updating mentor", {
                description: error?.response?.data?.message || "Something went wrong.",
            })
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500" onClick={() => setOpen(true)}>Edit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <form action="action" onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Edit {mentor.first_name} {mentor.last_name}'s details</DialogTitle>
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
                            <Label htmlFor="image">Profile Image(Optional) </Label>
                            <Input id="image" type="file" {...register("image")} />
                            {errors.image && <p className="text-red-500">{errors.image.message}</p>}
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
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
