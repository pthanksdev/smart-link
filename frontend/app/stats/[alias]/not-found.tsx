import Link from "next/link";

export default function StatsNotFound() {
  return (
    <div className="card mx-auto max-w-md py-12 text-center">
      <h1 className="text-2xl font-bold text-white">Link not found</h1>
      <p className="mt-2 text-gray-500">
        The alias you&apos;re looking for doesn&apos;t exist or has been deleted.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className="btn-primary">
          Go home
        </Link>
        <Link href="/links" className="btn-secondary">
          View all links
        </Link>
      </div>
    </div>
  );
}
