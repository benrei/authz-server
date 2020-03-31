# authz-server

## Express
Validate scopes from decoded JWT in Express
```js
const authz = require('authz-server').express;
const { hasPermissions, } = authz;

app.post('/users',
  hasPermissions('read:users write:users'),
  function(req, res) { ... });
```

## Custom
Validate scopes from decoded JWT
```js
const authz = require('authz-server').custom;
const { validate, hasPermissions, } = authz;

app.post(
  '/users', 
  hasPermissions('read:users write:users'), 
  (req, res)=> { ... }
);
```