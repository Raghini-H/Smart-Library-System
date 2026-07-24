import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import '../../style/EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    if (loading) return null;

    if (!user || user.type !== "employee") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="employeeHome">

            <div className="heroSection">
                <div className="heroText">
                    <h1>
                        Hello, <span>{user?.name || "Staff"}</span> 
                    </h1>
                    <p>Manage library operations efficiently</p>
                </div>

                <button className="logoutBtn" onClick={logout}>
                    Logout
                </button>
            </div>


            <div className="featuredBanner">
                <h2>Library Operations Center</h2>
                <p>Handle book issues, returns, and maintain inventory smoothly.</p>
            </div>


            <div className="navCards">

                <div
                    className="navCard"
                    onClick={() => navigate('/employee/issue-request')}
                >
                    <h3>Issue Requests</h3>
                    <p>Review and approve book issue requests</p>
                </div>

                <div
                    className="navCard"
                    onClick={() => navigate('/employee/return-requests')}
                >
                    <h3>Return Requests</h3>
                    <p>Process and confirm returned books</p>
                </div>

                <div
                    className="navCard"
                    onClick={() => navigate('/admin/add-books')}
                >
                    <h3>Add Books</h3>
                    <p>Add new books to inventory</p>
                </div>

                <div
                    className="navCard"
                    onClick={() => navigate('/admin/view-books')}
                >
                    <h3>Inventory</h3>
                    <p>View and manage book collection</p>
                </div>

            </div>


            <div className="quoteSection">
                <h2>Staff Reminder</h2>
                <p>
                    Keep records accurate and ensure smooth borrowing experience.
                </p>
            </div>

        </div>
    );
};

export default EmployeeDashboard;
