
/**
 * @param scopes {(string|Array<string>)} - Allowed or required scopes. String must be 'space' separated
 * @param options {Object} - Options
 *  - scopeKey {string} [scope] - The user property name to check for the scope. req.user[scopeKey]
 *  - requireAll {boolean} [false] - If true: all scopes must be included. If false, 1 or more
 *  - errorToNext {boolean} [false] - If true: forward errors to 'next', instead of ending the response directly
 * @returns {Function} - Express middelware
 */
const validate = (scopes, options = {}) => {
  options.scopeKey = options && options.scopeKey || 'scope';

  if (typeof scopes === 'string')
    scopes = scopes.split(' ');
  if (!Array.isArray(scopes)) {
    throw new Error('Parameter scopes must be a string or an array of strings.');
  }

  return (req, res, next) => {
    const error = res => {
      const err_message = 'Insufficient scope';

      //  Forward errors to next instead of ending the response directly
      if (options && options.errorToNext)
        return next({statusCode: 403, error: 'Forbidden', message: err_message});

      //  To follow RFC 6750
      //  see https://tools.ietf.org/html/rfc6750#page-7
      res.append(
        'WWW-Authenticate',
        `Bearer scope="${scopes.join(' ')}", error="${err_message}"`
      );

      res.status(403).send(err_message);
    };

    if (scopes.length === 0) {
      return next();
    }

    if (!req.user) return error(res);

    let userScopes = [];
    const scopeKey = options.scopeKey;

    //  Allow 'space' seperated string value or array value
    if (typeof req.user[scopeKey] === 'string') {
      userScopes = req.user[scopeKey].split(' ');
    } else if (Array.isArray(req.user[scopeKey])) {
      userScopes = req.user[scopeKey];
    } else return error(res);

    let isAllowed;
    if (options && options.requireAll) {
      isAllowed = scopes.every(scope => userScopes.includes(scope));
    } else {
      isAllowed = scopes.some(scope => userScopes.includes(scope));
    }

    return isAllowed ? next() : error(res);
  };
};

module.exports = validate;