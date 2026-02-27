const express = require('express');
const router = express.Router();
const { registerEmployee, loginEmployee, getRequests, updateRequestStatus, getReturnRequests, confirmReturn, requestReturnFromUser } = require('../controllers/employeeController');
const upload = require('../middleware/upload');
const {protect} = require('../middleware/authMiddleware');

router.post('/register', upload.single('image'), registerEmployee);
router.post('/login', loginEmployee);
router.get('/issue-request', protect, getRequests);
router.put('/issue-request/:id', protect, updateRequestStatus);
router.get('/return-requests', protect, getReturnRequests);
router.put('/return-requests/:id', protect, confirmReturn);
router.put('/return-requests/:id/request', protect, requestReturnFromUser);

module.exports = router;
