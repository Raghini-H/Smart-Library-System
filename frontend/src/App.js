import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/User/Login';
import Dashboard from './pages/User/Dashboard';
import EmployeeDashboard from './pages/Employee/EmployeeDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Register from './pages/User/Register';
import EmployeeLogin from './pages/Employee/EmployeeLogin';
import EmployeeRegister from './pages/Employee/EmployeeRegister';
import AdminLogin from './pages/Admin/AdminLogin';
import ViewEmployees from './pages/Admin/ViewEmployees';
import AddBooks from './pages/Admin/AddBooks';
import ViewBooks from './pages/Admin/ViewBooks';
import SearchBooks from './pages/User/SearchBooks';
import MyIssuedBooks from './pages/User/MyIssuedBooks';
import IssueRequests from './pages/Employee/IssueRequests';
import ReturnRequests from './pages/Employee/ReturnRequests';
import ViewAllRequests from './pages/Admin/ViewAllRequests';
import MyRequest from './pages/User/MyRequest';
import ViewUsers from './pages/Admin/ViewUsers';
import AddPlan from './pages/Admin/AddPlan';
import AddEmployee from './pages/Admin/AddEmployee';
import Plans from './pages/User/Plans';
import EmployeeAddBooks from './pages/Employee/EmployeeAddBooks';
import EmployeeViewBooks from './pages/Employee/EmployeeViewBooks';
import UserProfile from './pages/User/UserProfile';
import EmployeeProfile from './pages/Employee/EmployeeProfile';
import ForgotPassword from './pages/User/ForgotPassword';
import './App.css';


function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/search-books" element={<SearchBooks/>}/>
            <Route path="/user/my-issued-books" element={<MyIssuedBooks/>}/>
            <Route path="/user/my-request" element={<MyRequest/>}/>
            <Route path="/user/plans" element={<Plans />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/forgot-password" element={<ForgotPassword />} />
            <Route path="/employee-register" element={<EmployeeRegister />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/issue-request" element={<IssueRequests />} />
            <Route path="/employee/return-requests" element={<ReturnRequests />} />
            <Route path="/employee/profile" element={<EmployeeProfile />} />
            <Route path="/employee/add-books" element={<EmployeeAddBooks />} />
            <Route path="/employee/view-books" element={<EmployeeViewBooks />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/view-employee" element={<ViewEmployees />} />
            <Route path="/admin/add-books" element={<AddBooks />} />
            <Route path="/admin/add-plan" element={<AddPlan />} />
            <Route path="/admin/add-employee" element={<AddEmployee />} />
            <Route path="/admin/view-books" element={<ViewBooks />} />
            <Route path="/admin/view-users" element={<ViewUsers />} />
            <Route path="/admin/view-all-requests" element={<ViewAllRequests />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
