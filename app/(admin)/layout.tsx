import React, {ReactNode} from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

function Layout({children}:{children:ReactNode}) {
    return (
        <SidebarProvider>

            <main>
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}

export default Layout;