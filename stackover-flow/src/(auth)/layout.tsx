import { useAuthStore } from "@/store/Auth"; // Import Zustand store for session management
import React, { useEffect } from "react"; // Import React and useEffect
import { useRouter } from "next/router"; // Import useRouter for navigation

interface LayoutProps {
  children: React.ReactNode; // Define the type for children prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { session } = useAuthStore(); // Get the session state from the store
  const router = useRouter(); // Get the Next.js router

  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect to home page if session exists
    }
  }, [session, router]);

  if (session) {
    return null; // Don't render anything if session exists
  }

  return (
    <div className="">
      <div className="">{children}</div>
    </div>
  );
};

export default Layout;
