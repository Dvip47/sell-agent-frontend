import Header from './Header';
import Sidebar from './Sidebar';

/**
 * AppLayout Component
 * 
 * Main application layout with header and sidebar.
 */
function AppLayout({ children }) {
    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Header />
            <div className="d-flex flex-grow-1">
                <Sidebar />
                <main className="flex-grow-1 bg-white">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AppLayout;
