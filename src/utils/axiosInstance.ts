import { JWT_TEMPLATE } from "@/config/env";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useMemo, useRef } from "react";
import { useBackend } from "@/context/BackendContext";

const useAxiosWithAuth = () => {
    const { getToken, isLoaded } = useAuth();
    const interceptorRef = useRef<number | null>(null);
    const { backendProvider } = useBackend();

    const axiosInstance = useMemo(() => {
        if (!backendProvider) return null;

        return axios.create({
            baseURL: backendProvider,
        });
    }, [backendProvider]);

    useEffect(() => {
        if (!axiosInstance || !isLoaded) return;

        interceptorRef.current = axiosInstance.interceptors.request.use(async (config) => {
            const token = await getToken({ template: `${JWT_TEMPLATE}` });

            if (token) {
                console.log("token", token);
                config.headers.Authorization = `Bearer ${token}`;
            }

            if (!config.headers["Content-Type"] && config.method !== "get") {
                config.headers["Content-Type"] = "application/json";
            }

            return config;
        });

        return () => {
            if (interceptorRef.current !== null) {
                axiosInstance.interceptors.request.eject(interceptorRef.current);
            }
        };
    }, [axiosInstance, getToken, isLoaded]);

    return axiosInstance;
};

export default useAxiosWithAuth;