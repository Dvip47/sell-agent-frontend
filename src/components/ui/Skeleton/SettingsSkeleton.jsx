import React from 'react';
import { SkeletonBlock, SkeletonText } from './index';

const SettingsSkeleton = () => {
    return (
        <div className="container-fluid py-4 px-4">
            {/* Header Skeleton */}
            <div className="row mb-4 align-items-center">
                <div className="col">
                    <SkeletonBlock width="300px" height="2.5rem" className="mb-2" />
                    <SkeletonBlock width="200px" height="1rem" />
                </div>
                <div className="col-auto">
                    <SkeletonBlock width="200px" height="3rem" borderRadius="100px" />
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="d-flex gap-2 mb-4 border-bottom">
                <SkeletonBlock width="150px" height="2.5rem" borderRadius="0.5rem 0.5rem 0 0" />
                <SkeletonBlock width="180px" height="2.5rem" borderRadius="0.5rem 0.5rem 0 0" />
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    {/* Main Control Card Skeleton */}
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                        <SkeletonBlock width="100%" height="100px" />
                        <div className="card-body p-4">
                            <SkeletonText lines={2} className="mb-4" />
                            <div className="d-flex gap-3">
                                <SkeletonBlock width="160px" height="2.5rem" borderRadius="100px" />
                                <SkeletonBlock width="160px" height="2.5rem" borderRadius="100px" />
                            </div>
                        </div>
                    </div>

                    {/* Agents Grid Skeleton */}
                    <div className="row g-4">
                        {[1, 2].map(i => (
                            <div key={i} className="col-md-6">
                                <div className="card border-0 shadow-sm rounded-4 p-4">
                                    <div className="d-flex justify-content-between mb-3">
                                        <div className="d-flex gap-2 align-items-center">
                                            <SkeletonBlock width="32px" height="32px" borderRadius="100px" />
                                            <SkeletonBlock width="120px" height="1.2rem" />
                                        </div>
                                        <SkeletonBlock width="60px" height="1.2rem" borderRadius="100px" />
                                    </div>
                                    <SkeletonBlock width="100%" height="60px" borderRadius="0.5rem" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-lg-4">
                    {/* Diagnostics Skeleton */}
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <SkeletonBlock width="150px" height="1.2rem" className="mb-4" />
                        <SkeletonBlock width="100%" height="8px" borderRadius="100px" className="mb-4" />
                        <SkeletonBlock width="100%" height="1rem" />
                    </div>
                    <SkeletonBlock width="100%" height="80px" borderRadius="1rem" />
                </div>
            </div>
        </div>
    );
};

export default React.memo(SettingsSkeleton);
