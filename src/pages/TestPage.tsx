
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function useDeviceId() {
    const [deviceId, setDeviceId] = useState<String>();

    useEffect(() => {
        let id = localStorage.getItem("device_id");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("device_id", id);
        }
        setDeviceId(id);
    }, []);

    return deviceId;
}
export default function TestPage() {

    const deviceId = useDeviceId();

    return (
        <div>
            <h1>Your Device ID</h1>
            <p>{deviceId || "Loading..."}</p>
        </div>
    );
}
