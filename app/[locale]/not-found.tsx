import { Navbar } from "@/components/global/Navbar";
import { Ghost } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <Ghost size={80} className="text-blue-400 mb-6 animate-bounce" />
        <h1 className="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
          Page not found
        </h2>
        <p className="text-lg text-gray-500 mb-8 text-center max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
          <br />
          Let's get you back to where you belong.
        </p>
        <Link href="/">
          <button className="cursor-pointer px-8 py-2 rounded-full bg-blue-500 text-white text-lg shadow-lg hover:bg-blue-600 transition-colors">
            Go home
          </button>
        </Link>
      </div>
    </>
  );
}
