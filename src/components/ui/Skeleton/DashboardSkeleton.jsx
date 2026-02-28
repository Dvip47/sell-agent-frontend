import React from 'react';
import { SkeletonBlock, SkeletonCard, SkeletonChart, SkeletonTableRow, SkeletonText } from './index';

const DashboardSkeleton = () => {
    return (
        <div className="container-fluid py-4 px-4">
            {/* Header Skeleton */}
            <div className="row mb-5 align-items-center">
                <div className="col">
                    <SkeletonBlock width="300px" height="2.5rem" className="mb-2" />
                    <SkeletonBlock width="200px" height="1rem" />
                </div>
                <div className="col-auto d-flex gap-3">
                    <SkeletonBlock width="120px" height="2.5rem" borderRadius="100px" />
                    <SkeletonBlock width="120px" height="2.5rem" borderRadius="1rem" />
                </div>
            </div>

            {/* Performance Banner Skeleton */}
            <div className="row mb-4">
                <div className="col-12">
                    <SkeletonBlock width="100%" height="120px" borderRadius="1rem" />
                </div>
            </div>

            {/* Metric Cards Skeleton */}
            <div className="row g-4 mb-5">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="col-md-3">
                        <SkeletonCard />
                    </div>
                ))}
            </div>

            <div className="row g-4">
                {/* Table Skeleton */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm h-100 rounded-4 bg-white overflow-hidden p-4">
                        <SkeletonBlock width="200px" height="1.5rem" className="mb-4" />
                        <table className="table mb-0">
                            <tbody>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <SkeletonTableRow key={i} columns={4} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Console Skeleton */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm h-100 rounded-4 bg-dark p-4">
                        <SkeletonBlock width="150px" height="1.5rem" className="mb-4" />
                        <SkeletonText lines={12} className="opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DashboardSkeleton);
