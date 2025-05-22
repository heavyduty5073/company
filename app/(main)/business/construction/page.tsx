import React from 'react';
import EquipmentGrid from "@/components/business/construction/EquipmentGrid";
import ConstructHeader from "@/components/business/construction/ConstructHeader";
import {equipmentData} from "@/lib/store/constructData";

function Page() {

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-12">
                <ConstructHeader/>
                <EquipmentGrid equipmentList={equipmentData} />
            </div>
        </div>
    );
}

export default Page;