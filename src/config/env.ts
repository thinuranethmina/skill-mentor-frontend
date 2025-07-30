const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;
const JWT_TEMPLATE = `${import.meta.env.VITE_JWT_TEMPLATE}`;
const R2_URL = `${import.meta.env.VITE_R2_URL}`;

if (!BACKEND_URL) {
  throw new Error("Add your Backend URL to the .env file");
}

export { BACKEND_URL, JWT_TEMPLATE, R2_URL };
