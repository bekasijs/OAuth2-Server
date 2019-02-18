const redis = require('./../adapters/redis');
const node_acl = require('acl');
let acl = new node_acl(new node_acl.redisBackend(redis, '_acl'));

const ensurePermission = (role) => {
    return (req, res, next) => {
        if (res.locals.oauth) {
            const { client, user, accessToken, refreshToken } = res.locals.oauth;
            if (user.roles.every(s => s === role)) {
                const sendToken = Object.assign(user, {accessToken}, {refreshToken})
                res.status(200).json(sendToken);
            } else {
                res.status(403).send({ message: 'Forbidden' });
            }
        } else {
            res.status(401).send({ message: 'User not authenticated' });
        }
    }
}

const validateAccessControl = (req, res, next) => {
  if (req.user) {
      acl.allowedPermissions(req.user.user._id.toString(), [req.originalUrl], (err, permission) => {
          console.log(permission);
      });
      acl.isAllowed(
          req.user.user._id.toString(),
          req.originalUrl, req.method, (error, allowed) => {
              if (allowed) next()
              else {
                  res.status(403).send({ message: 'Insufficient permissions to access resource' });
              }
          }
      )
  } else {
      res.status(401).send({ message: 'User not authenticated' });
  }
};

module.exports = {
    ensurePermission,
    validateAccessControl,
    acl
}