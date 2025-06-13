import React from 'react';

function UserListSkeleton() {
    return (
        <div className="p-6">
            <div className="h-8 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
            <div className="space-y-4">
                <div className="border rounded-lg">
                    <div className="p-4 border-b">
                        <div className="grid grid-cols-6 gap-4">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border-b last:border-b-0">
                            <div className="grid grid-cols-6 gap-4">
                                {Array.from({ length: 6 }).map((_, j) => (
                                    <div key={j} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserListSkeleton;
