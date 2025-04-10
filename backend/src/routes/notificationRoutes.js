const express = require('express')
const {
  getNotifications,
  markAsRead,
  deleteNotification,
  createNotification
} =  require('../controllers/notificationController.js');
const verifyJWT = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.use(verifyJWT);
router.get('/', getNotifications);
router.post('/', createNotification);
router.patch('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router