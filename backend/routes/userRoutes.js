const express = require('express');
const router = express.Router();
const { searchForBooks, requestBook, getMyRequests, getMyIssuedBooks, requestReturn, getPlans } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware');

router.get('/search-books', searchForBooks);
router.post('/request-book', protect, requestBook);
router.get('/my-request', protect, getMyRequests);
router.get('/my-issued-books', protect, getMyIssuedBooks);
router.post('/return-book/:id', protect, requestReturn);
router.get('/plans', protect, getPlans);

module.exports = router;
