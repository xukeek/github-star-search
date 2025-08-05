'use client';

// This file is used for non-localized requests, e.g. when visiting `/unmatched`.
// The not-found page for localized routes is at `[locale]/not-found.tsx`.
export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="text-lg text-gray-600">
            The page you are looking for does not exist.
          </p>
          <a href="/" className="mt-4 text-blue-500 underline">
            Return Home
          </a>
        </div>
      </body>
    </html>
  );
}
