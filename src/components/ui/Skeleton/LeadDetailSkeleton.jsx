import React from 'react';
import { SkeletonBlock, SkeletonAvatar, SkeletonText, SkeletonBadge } from './index';

const LeadDetailSkeleton = () => {
    return (
        <div className="container-fluid py-4 px-4 overflow-hidden">
            {/* Header Skeleton */}
            <div className="row mb-5 align-items-center">
                <div className="col d-flex align-items-center gap-4">
                    <SkeletonBlock width="40px" height="40px" borderRadius="100px" />
                    <div className="d-flex align-items-center gap-3">
                        <SkeletonBlock width="56px" height="56px" borderRadius="1rem" />
                        <div>
                            <SkeletonBlock width="300px" height="2.5rem" className="mb-2" />
                            <div className="d-flex gap-3">
                                <SkeletonBlock width="150px" height="1rem" />
                                <SkeletonBlock width="100px" height="1rem" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-auto">
                    <SkeletonBadge width="100px" height="32px" />
                </div>
            </div>

            <div className="row g-4 pt-2">
                {/* Sidebar Skeleton */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <SkeletonBlock width="180px" height="1.5rem" className="mb-4" />
                        <SkeletonBlock width="100%" height="8px" borderRadius="100px" className="mb-4" />
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <SkeletonBlock key={i} width="100%" height="80px" borderRadius="1rem" className="mb-3" />
                            ))}
                        </div>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <SkeletonBlock width="150px" height="1.5rem" className="mb-4" />
                        <div className="row g-3">
                            <div className="col-6"><SkeletonBlock width="100%" height="80px" borderRadius="1rem" /></div>
                            <div className="col-6"><SkeletonBlock width="100%" height="80px" borderRadius="1rem" /></div>
                        </div>
                    </div>
                </div>

                {/* Timeline Skeleton */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <SkeletonBlock width="200px" height="2rem" className="mb-4" />
                        <div className="d-flex flex-column gap-5">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="d-flex gap-4">
                                    <SkeletonBlock width="40px" height="40px" borderRadius="12px" />
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between mb-3">
                                            <SkeletonBlock width="120px" height="1rem" />
                                            <SkeletonBlock width="80px" height="1rem" />
                                        </div>
                                        <SkeletonBlock width="100%" height="100px" borderRadius="1rem" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(LeadDetailSkeleton);
