import { Outlet } from "react-router-dom";
import Footer from "../Components/Layout/Footer";
import Nav from "../Components/Layout/Nav";

export default function BaseLayout () {
    return <div className="bg-[#0a0a0a] text-white font-sans min-h-screen">
        <Nav/>
        <Outlet/>
        <Footer/>
    </div>
}