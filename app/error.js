"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Error caught:", error);
  }, [error]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      <p className="mb-6">
        {error?.message ||
          "An unexpected error occurred. Please try again later."}
      </p>
      <div className="space-x-4">
        {/* Retry Button */}
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600"
        >
          Try Again
        </button>

        {/* Go to Home */}
        <Link
          href="/"
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md shadow-md hover:bg-gray-400"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}
