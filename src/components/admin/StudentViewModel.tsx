import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Button } from "../ui/button"
import { Student } from "@/lib/types"
import { useState } from "react"


interface Props {
    student: Student;
}

export function StudentViewModel({ student }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}>View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <div className="grid lg:grid-cols-2 gap-4 mt-3">
                    <div className="flex gap-3">
                        <Label htmlFor="fname" className="font-semibold">First Name:</Label>
                        <p>{student.first_name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="lname" className="font-semibold">Last Name:</Label>
                        <p>{student.last_name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="email" className="font-semibold">Email:</Label>
                        <p>{student.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="phone" className="font-semibold">Phone:</Label>
                        <p>{student.phone_number}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="phone" className="font-semibold">Address:</Label>
                        <p>{student.address}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
