import { MapPin, Briefcase, Clock, IndianRupee } from "lucide-react";

export default function JobCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse">
            <div className="flex justify-between items-start gap-3 mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                </div>
                <div className="h-8 w-20 bg-blue-50/50 rounded-md"></div>
            </div>

            <div className="flex flex-wrap gap-3 mb-4">
                <div className="h-5 w-24 bg-gray-100 rounded-md"></div>
                <div className="h-5 w-28 bg-gray-100 rounded-md"></div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-100 rounded w-full"></div>
                <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <div className="h-5 w-32 bg-gray-100 rounded"></div>
                <div className="h-9 w-28 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
    );
}
