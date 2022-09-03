const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // https://docs.mongodb.com/manual/tutorial/query-array-of-documents/#specify-a-query-condition-on-a-field-embedded-in-an-array-of-documents
    // That's a special syntax in Mongoose for accessing a property on an array of objects. So you could use tokens.token to say "look for an objet in the tokens array and check it's token property against this value".
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token });

    if(!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({
      error: 'Please authenticate.'
    })
  }
}

module.exports = auth;
