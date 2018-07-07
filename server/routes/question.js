const questionController = require('../controllers/questionController.js');
const router = require('express').Router();
const { auth } = require('../middleware/auth.js');

router
  .post('/create', auth, questionController.create)
  .get('/readall', questionController.readall)
  .get('/readbyid/:id', questionController.readbyid)
  .get('/readforaccount', auth, questionController.readforaccount)
  .put('/updateq/:id', questionController.updateQ)
  .put('/updatec/:id', questionController.updateC)
  .put('/updatev/:id', questionController.updateV)
  .delete('/delete/:id', questionController.delete)

module.exports = router;
