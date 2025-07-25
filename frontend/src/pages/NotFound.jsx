import { Button } from "../components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto py-24 text-center">
      <h2 className="text-5xl font-bold mb-4 text-zinc-900">404</h2>
      <p className="text-lg text-zinc-600 mb-8">Page not found.</p>
      <Button asChild className="px-6 py-2 rounded-lg font-semibold">
        <a href="/">Go Home</a>
      </Button>
    </div>
  );
} 