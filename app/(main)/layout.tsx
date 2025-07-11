import React, {ReactNode} from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingWrapper from "@/lib/store/LoadingWrapper";
import Chatbot from "@/components/layout/Chatbot";

function Layout({children}:{children:ReactNode}) {
    return (
        <div>
            <Header/>
            {children}
            <Chatbot/>
            <LoadingWrapper />
            <Footer/>
        </div>
    );
}

export default Layout;
