// src/lib/useAxiosWithAuth.ts
import { BACKEND_URL, JWT_TEMPLATE } from "@/config/env";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `${BACKEND_URL}`,
});

const useAxiosWithAuth = () => {
    const { getToken } = useAuth();

    const instance = axiosInstance;

    instance.interceptors.request.use(async (config) => {
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

    return instance;
};

export default useAxiosWithAuth;
