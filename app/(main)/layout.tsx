import React, {ReactNode} from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingWrapper from "@/lib/store/LoadingWrapper";

function Layout({children}:{children:ReactNode}) {
    return (
        <div>
            <Header/>
            {children}
            <LoadingWrapper />
            <Footer/>
        </div>
    );
}

export default Layout;