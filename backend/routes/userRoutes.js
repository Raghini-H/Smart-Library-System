const express = require('express');
const router = express.Router();
const { searchForBooks, requestBook, getMyRequests,resetPassword, forgotPassword, getMyIssuedBooks, requestReturn, getPlans, getUserProfile, updateUserProfile } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware');

router.get('/search-books', searchForBooks);
router.post('/request-book', protect, requestBook);
router.get('/my-request', protect, getMyRequests);
router.get('/my-issued-books', protect, getMyIssuedBooks);
router.post('/return-book/:id', protect, requestReturn);
router.get('/plans', protect, getPlans);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
