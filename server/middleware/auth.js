const axios = require('axios');

module.exports = {
  auth: (req, res, next) => {
    axios.post('http://user.roarized.com/api/validateuser', {}, {
      headers: {token: req.headers.token}
    })
      .then(response => {
        console.log('masuk ke then');
        if (response.data.message === 'silahkan lanjut') {
          next();
        } else {
          res.status(404).json({
            message: 'please login first'
          });
        };
      })
      .catch(err => {
        console.log('masuk ke catch');
        res.status(500).json({
          message: 'something went wrong'
        });
      })
  }
};
