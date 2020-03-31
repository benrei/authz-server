/**
 * Check if scope is included in decoded jwt object
 * @param {string} scope - Scope to validate. Example: 'read-user' or 'read-user read-all'
 * @param {*} decodedJWT - Decoded JSON Web Token
 * @param {*} scopeKey - Property to look for scope, like this: decodedJWT['scopeKey']
 */
const validate = (scope, decodedJWT = {}, options = {})=>{
  options.scopeKey = options && options.scopeKey || 'scope';
  if (typeof scope === 'string')
    scope = scope.split(' ');
  if (!Array.isArray(scope)) 
    throw new Error('Parameter scope is required, and must be a string.');
  if (!decodedJWT) 
    throw new Error('Parameter decodedJWT is required, and must be an object.');

    let userScopes = [];
    const scopeKey = options.scopeKey;

    //  Allow 'space' seperated string value or array value
    if (typeof decodedJWT[scopeKey] === 'string') {
      userScopes = decodedJWT[scopeKey].split(' ');
    } else if (Array.isArray(decodedJWT[scopeKey])) {
      userScopes = decodedJWT[scopeKey];
    } else throw new Error(`decodedJWT[${scopeKey}] doesn't exist or isn't of type array or string`);

    let isAllowed = false;
    if (options && options.requireAll) {
      isAllowed = scopes.every(scope => userScopes.includes(scope));
    } else {
      isAllowed = scopes.some(scope => userScopes.includes(scope));
    }
  return isAllowed
}

module.exports = validate