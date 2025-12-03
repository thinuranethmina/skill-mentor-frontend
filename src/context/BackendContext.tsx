import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";
import { BACKEND_URL } from "@/config/env";

const BackendContext = createContext<BackendContextType | null>(null);

interface BackendContextType {
    backendProvider: string;
    isDeveloper: boolean;
    setDeveloper: React.Dispatch<React.SetStateAction<boolean>>;
    isRemote: boolean;
    setRemote: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BackendProvider({ children }: { children: ReactNode }) {
    const [backendProvider, setBackendProvider] = useState<string | null>(null);
    const [isDeveloper, setDeveloper] = useState(() => {
        let id = localStorage.getItem("device_id");
        if (!id) {
            id = uuidv4();
            localStorage.setItem("device_id", id);
        }

        return (id === "228a778e-6546-45d8-a486-b23f391f1c9a");
    });

    const [isRemote, setRemote] = useState(() => {
        const cached = localStorage.getItem("isRemote");
        return cached !== null ? cached === "true" : true;
    });

    useEffect(() => {
        localStorage.setItem("isRemote", isRemote.toString());

        if (isDeveloper && !isRemote) {
            setBackendProvider("http://localhost:8080/api/v1");
        } else {
            setBackendProvider(BACKEND_URL);
        }
    }, [isDeveloper, isRemote]);

    if (!backendProvider) {
        return <div>Loading backend...</div>;
    }

    return (
        <BackendContext.Provider
            value={{
                backendProvider,
                isDeveloper,
                setDeveloper,
                isRemote,
                setRemote,
            }}
        >
            {children}
        </BackendContext.Provider>
    );
}

export function useBackend() {
    const ctx = useContext(BackendContext);
    if (!ctx) throw new Error("useBackend must be used inside BackendProvider");
    return ctx;
}
