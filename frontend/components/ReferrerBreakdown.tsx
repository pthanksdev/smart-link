interface ReferrerBreakdownProps {
  referrers: { referrer: string; count: number }[];
}

export default function ReferrerBreakdown({ referrers }: ReferrerBreakdownProps) {
  if (referrers.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-gray-400">No referrer data yet</p>
    );
  }

  const max = referrers[0]?.count ?? 1;

  return (
    <div className="space-y-3">
      {referrers.map(({ referrer, count }) => (
        <div key={referrer}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="truncate font-medium text-gray-700">{referrer}</span>
            <span className="ml-2 shrink-0 text-gray-500">{count}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-brand-500 transition-all"
              style={{ width: `${(count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
