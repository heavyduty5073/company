import React from 'react';
import EquipmentCard from "@/components/business/construction/EquipmentCard";

interface Equipment {
    title: string;
    description: string;
    imageUrl: string;
    features: string[];
}
interface EquipmentGridProps{
    equipmentList: Equipment[];
}
function EquipmentGrid({ equipmentList }: EquipmentGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipmentList && equipmentList.map((equipment, index) => (
                <EquipmentCard
                    key={index}
                    title={equipment.title}
                    description={equipment.description}
                    imageUrl={equipment.imageUrl}
                    features={equipment.features}
                />
            ))}
        </div>
    )
}

export default EquipmentGrid;