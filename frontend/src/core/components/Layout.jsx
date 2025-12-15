import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <div className="min-h-screen text-white font-sans overflow-hidden relative">
            <Navbar />
            <main className="w-full h-full">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
