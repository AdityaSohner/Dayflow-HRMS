const express = require('express');
const router = express.Router();
const empController = require('../controllers/employee.controller');



router.post('/', empController.createEmployee);
router.get('/', empController.getAllEmployees);
router.get('/:id', empController.getEmployeeById);
router.put('/:id', empController.updateEmployee);
router.delete('/:id', empController.deleteEmployee);



module.exports = router;