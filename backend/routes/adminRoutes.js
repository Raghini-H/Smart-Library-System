const express = require('express');
const router = express.Router();
const { loginAdmin, getAllEmployees, registerBooks, getAllBooks, getAllRequests, getAllUsers, addPlan } = require('../controllers/adminController');
const {protect} = require('../middleware/authMiddleware')
const upload = require("../middleware/upload"); 


router.post('/login', loginAdmin);
router.get('/view-employee', protect, getAllEmployees);  
router.post('/add-books', upload.single("bookcover"), protect, registerBooks);  
router.get('/view-books', protect, getAllBooks);  
router.get('/view-all-requests', protect, getAllRequests); 
router.get('/view-users', protect, getAllUsers);  
router.post('/add-plan', protect, addPlan);   


module.exports = router;
