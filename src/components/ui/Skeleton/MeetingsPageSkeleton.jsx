import React from 'react';
import { SkeletonBlock } from './index';

const MeetingsPageSkeleton = () => {
    return (
        <div className="container-fluid py-4 px-4 h-100 d-flex flex-column">
            {/* Header Area Skeleton */}
            <div className="row mb-5 align-items-center flex-shrink-0">
                <div className="col">
                    <SkeletonBlock width="250px" height="2.5rem" className="mb-2" />
                    <SkeletonBlock width="180px" height="1rem" borderRadius="100px" />
                </div>
                <div className="col-auto">
                    <SkeletonBlock width="150px" height="2.5rem" borderRadius="100px" />
                </div>
            </div>

            {/* Connection Status Skeleton */}
            <div className="row mb-5 flex-shrink-0">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div className="card-body d-flex align-items-center p-4">
                            <SkeletonBlock width="64px" height="64px" borderRadius="1rem" className="me-4" />
                            <div className="flex-grow-1">
                                <SkeletonBlock width="200px" height="1.25rem" className="mb-2" />
                                <SkeletonBlock width="80%" height="0.85rem" />
                            </div>
                            <SkeletonBlock width="160px" height="2.5rem" borderRadius="100px" className="ms-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Hub Skeleton */}
            <div className="row g-4 flex-grow-1 overflow-hidden">
                <div className="col-lg-12 h-100">
                    <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden h-100 d-flex flex-column">
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center flex-shrink-0">
                            <div className="d-flex align-items-center gap-2">
                                <SkeletonBlock width="24px" height="24px" borderRadius="6px" />
                                <SkeletonBlock width="180px" height="1.5rem" />
                            </div>
                            <SkeletonBlock width="150px" height="0.75rem" />
                        </div>
                        <div className="card-body p-0 flex-grow-1 d-flex flex-column">
                            <div className="p-4 border-bottom border-light bg-light bg-opacity-30 flex-shrink-0">
                                <div className="row g-3">
                                    <div className="col-auto">
                                        <SkeletonBlock width="100px" height="2rem" borderRadius="100px" />
                                    </div>
                                    <div className="col-auto">
                                        <SkeletonBlock width="100px" height="2rem" borderRadius="100px" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex-grow-1">
                                {/* Simulated Calendar Grid */}
                                <div className="row g-0 h-100 border rounded-4 overflow-hidden">
                                    <div className="col-12 h-100 bg-light bg-opacity-10 d-flex flex-column">
                                        <div className="row g-0 border-bottom flex-shrink-0" style={{ height: '50px' }}>
                                            {[1, 2, 3, 4, 5, 6, 7].map(i => (
                                                <div key={i} className="col border-end d-flex align-items-center justify-content-center">
                                                    <SkeletonBlock width="30px" height="0.75rem" />
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex-grow-1 position-relative">
                                            <div className="position-absolute inset-0 d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)' }}>
                                                {Array.from({ length: 35 }).map((_, i) => (
                                                    <div key={i} className="border-end border-bottom p-2">
                                                        <SkeletonBlock width="20px" height="12px" className="mb-1" />
                                                        {i % 8 === 0 && <SkeletonBlock width="90%" height="20px" borderRadius="4px" className="mt-2" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MeetingsPageSkeleton);
