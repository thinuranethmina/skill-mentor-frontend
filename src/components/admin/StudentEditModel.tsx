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
import { email, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosWithAuth from "@/utils/axiosInstance"
import { toast } from "sonner"
import { Student } from "@/lib/types"
import { useState } from "react"


const schema = z.object({
    fname: z.string().min(1, { message: "First name is required" }),
    lname: z.string().min(1, { message: "Last name is required" }),
    phone: z.number().nullable().optional(),
    address: z.string().min(1, { message: "Address is required" })
});


type FormData = z.infer<typeof schema>;

interface Props {
    student: Student;
    students: Student[];
    setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export function StudentEditModel({ student, students, setStudents }: Props) {
    const axios = useAxiosWithAuth();
    const [open, setOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            fname: student.first_name,
            lname: student.last_name,
            phone: Number.parseInt(student.phone_number) || 0,
            address: student.address
        }
    });

    const onSubmit = async (data: FieldValues) => {

        let payload = {
            cleark_student_id: student.clerk_student_id,
            student_id: student.student_id,
            email: student.email,
            first_name: data.fname,
            last_name: data.lname,
            phone_number: Number.parseInt(data.phone),
            address: data.address
        };

        try {

            console.log(payload);

            const res = await axios.put("/academic/student", payload);

            if (res.status === 200) {
                const newStudent = res.data;
                toast.success("Student updated successfully");

                setStudents(students.map((s) => {
                    if (s.student_id === newStudent.student_id) {
                        return {
                            ...s,
                            first_name: newStudent.first_name,
                            last_name: newStudent.last_name,
                            phone_number: newStudent.phone_number,
                            address: newStudent.address,
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
            toast.error("Error updating classroom", {
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
                        <DialogTitle>Edit {student.first_name} {student.last_name}</DialogTitle>
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
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...register("phone")} />
                            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" {...register("address")} />
                            {errors.address && <p className="text-red-500">{errors.address.message}</p>}
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
