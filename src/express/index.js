const validate = require('./validate');

//  Checks req.user['permission']
const hasPermission = (permissions, options = {}) => validate(permissions, { ...options, scopeKey: 'permissions' });

module.exports = { validate, hasPermission }