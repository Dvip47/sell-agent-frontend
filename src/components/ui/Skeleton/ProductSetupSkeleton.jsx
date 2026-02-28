import React from 'react';
import { SkeletonBlock } from './index';

const ProductSetupSkeleton = () => {
    return (
        <div className="container py-4 px-4">
            <div className="row justify-content-center">
                <div className="col-lg-11">
                    {/* Status Header Skeleton */}
                    <div className="row mb-5 align-items-center">
                        <div className="col">
                            <SkeletonBlock width="350px" height="2.5rem" className="mb-2" />
                            <SkeletonBlock width="250px" height="1rem" />
                        </div>
                        <div className="col-auto">
                            <SkeletonBlock width="150px" height="2.5rem" borderRadius="100px" />
                        </div>
                    </div>

                    {/* Progress Stepper Skeleton */}
                    <div className="mb-5 py-4 bg-light bg-opacity-10 rounded-5 px-5 border" style={{ height: '120px' }}>
                        <div className="d-flex justify-content-between align-items-center h-100">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="d-flex flex-column align-items-center" style={{ width: '80px' }}>
                                    <SkeletonBlock width="48px" height="48px" borderRadius="50%" className="mb-3" />
                                    <SkeletonBlock width="60px" height="0.75rem" borderRadius="4px" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Card Skeleton */}
                    <div className="card border-0 shadow-lg rounded-5 overflow-hidden">
                        <div className="card-body p-4 p-md-5">
                            {/* Card Header */}
                            <div className="d-flex align-items-center gap-4 mb-5">
                                <SkeletonBlock width="64px" height="64px" borderRadius="1.25rem" />
                                <div>
                                    <SkeletonBlock width="300px" height="2rem" className="mb-2" />
                                    <SkeletonBlock width="400px" height="1rem" />
                                </div>
                            </div>

                            {/* Form Fields Grid */}
                            <div className="row g-4 pt-2">
                                <div className="col-12 mb-4">
                                    <SkeletonBlock width="100%" height="200px" borderRadius="1.5rem" />
                                </div>

                                <div className="col-12 mb-3">
                                    <SkeletonBlock width="200px" height="0.75rem" className="mb-2" />
                                    <SkeletonBlock width="100%" height="3.5rem" borderRadius="1rem" />
                                </div>

                                <div className="col-md-4">
                                    <SkeletonBlock width="100px" height="0.75rem" className="mb-2" />
                                    <SkeletonBlock width="100%" height="3rem" borderRadius="1rem" />
                                </div>
                                <div className="col-md-4">
                                    <SkeletonBlock width="100px" height="0.75rem" className="mb-2" />
                                    <SkeletonBlock width="100%" height="3rem" borderRadius="1rem" />
                                </div>
                                <div className="col-md-4">
                                    <SkeletonBlock width="100px" height="0.75rem" className="mb-2" />
                                    <SkeletonBlock width="100%" height="3rem" borderRadius="1rem" />
                                </div>

                                <div className="col-12 mt-5">
                                    <SkeletonBlock width="100%" height="150px" borderRadius="1.5rem" />
                                </div>
                            </div>

                            {/* Footer Buttons */}
                            <div className="d-flex justify-content-end mt-5 pt-4">
                                <SkeletonBlock width="200px" height="3.5rem" borderRadius="100px" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductSetupSkeleton);
