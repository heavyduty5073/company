import MaintenanceServiceClient from '@/components/business/repair/MaintenanceServiceClient';
import React from 'react';

async function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <MaintenanceServiceClient />
        </div>
    );
}

export default Page;