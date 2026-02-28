import React from 'react';
import { SkeletonBlock } from './index';

const ProductListSkeleton = () => {
    return (
        <div className="product-portfolio-page min-vh-100 py-5">
            <div className="container px-4">
                {/* Header Section Skeleton */}
                <div className="row mb-5 align-items-center">
                    <div className="col">
                        <div className="d-flex align-items-center gap-3 mb-2">
                            <SkeletonBlock width="40px" height="40px" borderRadius="12px" />
                            <SkeletonBlock width="250px" height="2rem" />
                        </div>
                        <SkeletonBlock width="400px" height="1rem" className="opacity-50" />
                    </div>
                    <div className="col-auto">
                        <SkeletonBlock width="180px" height="3rem" borderRadius="100px" />
                    </div>
                </div>

                {/* Grid Section Skeleton */}
                <div className="row g-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="col-md-6 col-xl-4">
                            <div className="card h-100 border-0 shadow-lg rounded-5 overflow-hidden">
                                <div className="card-body p-4 pt-5 pb-5">
                                    <div className="d-flex justify-content-between align-items-start mb-4 mt-2">
                                        <div>
                                            <SkeletonBlock width="150px" height="1.5rem" className="mb-2" />
                                            <SkeletonBlock width="100px" height="0.75rem" borderRadius="2px" />
                                        </div>
                                        <SkeletonBlock width="48px" height="48px" borderRadius="12px" />
                                    </div>

                                    <div className="d-flex gap-2 mb-4">
                                        <SkeletonBlock width="80px" height="1.5rem" borderRadius="8px" />
                                        <SkeletonBlock width="100px" height="1.5rem" borderRadius="8px" />
                                    </div>

                                    <div className="mb-5 p-4 rounded-4 bg-light">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <SkeletonBlock width="100px" height="0.65rem" />
                                            <SkeletonBlock width="30px" height="0.75rem" />
                                        </div>
                                        <SkeletonBlock width="100%" height="8px" borderRadius="100px" />
                                        <div className="mt-3">
                                            <SkeletonBlock width="140px" height="0.75rem" />
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-3">
                                        <SkeletonBlock width="100%" height="3.5rem" borderRadius="1rem" />
                                        <SkeletonBlock width="100%" height="3.5rem" borderRadius="1rem" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(ProductListSkeleton);
