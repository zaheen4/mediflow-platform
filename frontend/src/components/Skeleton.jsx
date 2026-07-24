const SkeletonCard = ({ count = 6 }) => (
    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }, (_, i) => (
            <div key={i} className="card items-center bg-base-100 shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-pulse">
                <div className="w-48 h-48 skeleton rounded-lg m-4" />
                <div className="card-body w-full bg-primary/10 rounded-md">
                    <div className="h-6 skeleton rounded w-3/4 mb-2" />
                    <div className="h-4 skeleton rounded w-full mb-1" />
                    <div className="h-4 skeleton rounded w-2/3 mb-4" />
                    <div className="h-4 skeleton rounded w-1/3 mb-4" />
                    <div className="card-actions justify-end">
                        <div className="h-10 skeleton rounded w-28" />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

const SkeletonTable = ({ rows = 5, cols = 4 }) => (
    <div className="space-y-3 animate-pulse">
        {Array.from({ length: rows }, (_, i) => (
            <div key={i} className="flex gap-4">
                {Array.from({ length: cols }, (_, j) => (
                    <div key={j} className="h-6 skeleton rounded flex-1" />
                ))}
            </div>
        ))}
    </div>
);

const SkeletonOrderCard = ({ count = 3 }) => (
    <div className="space-y-4 animate-pulse">
        {Array.from({ length: count }, (_, i) => (
            <div key={i} className="card bg-base-100 shadow-md">
                <div className="card-body space-y-3">
                    <div className="flex justify-between">
                        <div className="h-6 skeleton rounded w-48" />
                        <div className="h-6 skeleton rounded w-24" />
                    </div>
                    <div className="h-4 skeleton rounded w-full" />
                    <div className="h-4 skeleton rounded w-3/4" />
                </div>
            </div>
        ))}
    </div>
);

export { SkeletonCard, SkeletonTable, SkeletonOrderCard };
