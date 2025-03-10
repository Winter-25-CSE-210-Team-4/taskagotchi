import { Router } from 'express';
import { register, login, requestPasswordReset, resetPassword, changePassword } from '../controllers/authController';
import { protectRoute } from '../middleware/auth'; // 添加保护路由中间件的导入

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.post('/change-password', protectRoute, changePassword);

export default router;
