import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ToastProvider, ToastViewport } from "./ui/toast";
import { Outlet } from "react-router";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <ToastProvider>
      <section className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Outlet />
          <Toaster position="top-right" richColors />
        </main>
        <Footer />
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
