import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import '../../style/AdminDashboard.css';

const AdminDashboard = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    if (loading) return null;

    if (!user || user.type !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="adminHome">

            <div className="heroSection">
                <div className="heroText">
                    <h1>
                        Hello, <span>{user?.name || "Administrator"}</span>
                    </h1>
                    <p>Full system control & configuration</p>
                </div>

                <button className="logoutBtn" onClick={logout}>
                    Logout
                </button>
            </div>


            <div className="featuredBanner">
                <h2>Administration Control Center</h2>
                <p>
                    Manage employees, books, users, and monitor system activities.
                </p>
            </div>


            <div className="navCards">

                <div
                    className="navCard"
                    onClick={() => navigate('/admin/add-employee')}
                >
                    <h3>Employees</h3>
                    <p>Add and manage staff members</p>
                </div>

                <div
                    className="navCard"
                    onClick={() => navigate('/admin/add-books')}
                >
                    <h3>Books</h3>
                    <p>Add and organize book inventory</p>
                </div>

                <div
                    className="navCard"
                    onClick={() => navigate('/admin/view-users')}
                >
                    <h3>Users</h3>
                    <p>View and manage registered users</p>
                </div>

                <div className="navCard">
                    <h3>Reports</h3>
                    <p>View analytics and system reports</p>
                </div>

            </div>


            <div className="quoteSection">
                <h2>System Status</h2>
                <p>
                    Maintain integrity, monitor activity, and ensure smooth operation.
                </p>
            </div>

        </div>
    );
};

export default AdminDashboard;
