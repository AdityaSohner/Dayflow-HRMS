const express = require('express');
const router = express.Router();
const empController = require('../controllers/employee.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');



router.get('/', authMiddleware, roleMiddleware('admin', 'hr', 'manager'), empController.getAllEmployees);
router.get('/:id', authMiddleware, roleMiddleware('admin', 'hr', 'manager','employee'), empController.getEmployeeById);
router.post('/', authMiddleware, roleMiddleware('admin','hr'), empController.createEmployee);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'hr'), empController.updateEmployee);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), empController.deleteEmployee);




module.exports = router;