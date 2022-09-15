const { body, validationResult, query, param } = require('express-validator');

const userValidationRules = (method) => {


  return [
        query('address', 'Kindly provide an address').exists()
         ] 

}


const validate = (req, res, next) => {
  const errors = validationResult(req)
  if(errors.isEmpty()){
    return next();
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push(err.msg));

  return res.status(400).send(extractedErrors);
}



module.exports = { userValidationRules, validate };
