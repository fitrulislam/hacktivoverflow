const answerController = require('../controllers/answerController.js');
const router = require('express').Router();
const { auth } = require('../middleware/auth.js');

router
  .get('/readall', answerController.readAll)
  .post('/create', auth, answerController.create)
  .put('/updatec/:id', answerController.updateC)
  .put('/updatev/:id', answerController.updateV)
  .delete('/delete/:id', answerController.delete)

module.exports = router;
