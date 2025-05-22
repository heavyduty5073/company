import React from 'react';

interface equipmentListProps{
    title:string;
    description:string;
    imageUrl:string;
    features:string[];
}
function EquipmentCard({ title, description, imageUrl, features }:equipmentListProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
                {features && features.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">주요 특징:</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EquipmentCard;