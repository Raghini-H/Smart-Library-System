import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import '../../style/UserDashboard.css';

const Dashboard = () => {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    if (loading) return null;

    if (!user || user.type !== "user") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="libraryHome">

            <div className="heroSection">
                <div className="heroText">
                    <h1>Hello, <span>{user?.fullname || "Reader"}</span> </h1>
                    <p>Discover books. Track your reads. Enjoy learning.</p>
                </div>

                <button className="logoutBtn" onClick={logout}>Logout</button>
            </div>

            <div className="featuredBanner">
                <h2>Keep Reading, Keep Growing</h2>
                <p>Explore thousands of books across different categories.</p>
                <button
                    className="primaryBtn"
                    onClick={() => navigate('/user/search-books')}
                >
                    Explore Books
                </button>
            </div>

            <div className="navCards">
                <div
                    className="navCard"
                    onClick={() => navigate('/user/my-issued-books')}
                >
                    <h3>My Books</h3>
                    <p>View and manage your borrowed books</p>
                </div>

                <div
                    className="navCard"
                    onClick={() => navigate('/user/my-request')}
                >
                    <h3>My Requests</h3>
                    <p>Track your book requests easily</p>
                </div>

                <div className="navCard">
                    <h3>Profile</h3>
                    <p>Update your personal details</p>
                </div>
            </div>


            <div className="quoteSection">
                <h2>Daily Reading Quote</h2>
                <p>
                    “A reader lives a thousand lives before he dies.”
                </p>
            </div>

        </div>
    );
};

export default Dashboard;
