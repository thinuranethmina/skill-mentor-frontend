import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label"
import { Button } from "../ui/button"
import { Mentor } from "@/lib/types"
import { useState } from "react"
import { R2_URL } from "@/config/env"


interface Props {
    mentor: Mentor;
}

export function MentorViewModel({ mentor }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-blue-500 text-white" onClick={() => setOpen(true)}>View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[750px]">
                <div className="grid lg:grid-cols-2 gap-4 mt-3">
                    <div className="flex gap-3 col-span-2 mb-6">
                        <img className="h-40 max-w-full rounded-xl object-contain mx-auto" src={R2_URL + mentor.mentor_image} alt="" />
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="fname" className="font-semibold">First Name:</Label>
                        <p>{mentor.first_name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="lname" className="font-semibold">Last Name:</Label>
                        <p>{mentor.last_name}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="email" className="font-semibold">Email:</Label>
                        <p>{mentor.email}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="phone" className="font-semibold">Phone:</Label>
                        <p>{mentor.phone_number}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="qualification" className="font-semibold">Qualification:</Label>
                        <p>{mentor.qualification}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="profession" className="font-semibold">Profession:</Label>
                        <p>{mentor.profession}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="title" className="font-semibold">Title:</Label>
                        <p>{mentor.title}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="profession" className="font-semibold">Subject:</Label>
                        <p>{mentor.subject}</p>
                    </div>
                    <div className="flex gap-3">
                        <Label htmlFor="session_fee" className="font-semibold">Session Fee:</Label>
                        <p>{mentor.session_fee}</p>
                    </div>
                    <div className="flex gap-3 lg:col-span-2">
                        <Label htmlFor="address" className="font-semibold">Address:</Label>
                        <p>{mentor.address}</p>
                    </div>
                    <div className="flex gap-3 lg:col-span-2">
                        <Label htmlFor="bio" className="font-semibold">Bio:</Label>
                        <p>{mentor.bio}</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
