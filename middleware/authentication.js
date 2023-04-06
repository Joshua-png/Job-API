const { UnauthenticatedError } = require("../errors");
const jwt = require("jsonwebtoken");
async function auth(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Aunthentication Invalid");
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, "jwtSecretstoday");
    req.user = { userId: payload.userId, name: payload.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid");
  }
}

module.exports = auth;
