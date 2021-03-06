const initPassportStrategy = (options) => {
  const { passport, ExtractJwt, config, JwtStrategy, authenticationModule } = options;
  const jwtOptions = {
    jwtFromRequest: ExtractJwt,
    secretOrKey: config.SECRET
  };

  passport.use(new JwtStrategy(jwtOptions, authenticationModule.passportVerify));
};

const jwtAuthenticate = ({ req, res, next, passport }) => {
  passport.authenticate('jwt', {
    session: false
  })(req, res, next);
};

const isAuthorized = ({ passport, authenticationModule, constants }) => async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;
    const bearer = token || '';
    const isTokenInBlackList = await authenticationModule.isTokenInvalidated(bearer);
    if (isTokenInBlackList) {
      res.status(constants.RESPONSE.STATUSES.UNAUTHORIZED)
        .json({ message: constants.RESPONSE.MESSAGES.SESSION_EXPIRED });
    } else {
      jwtAuthenticate({ req, res, next, passport });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = ({ passport, config, JwtStrategy, authenticationModule, constants }) => {
  const ExtractJwt = req => (req && req.cookies ? req.cookies.token : null);

  initPassportStrategy({ passport, ExtractJwt, config, JwtStrategy, authenticationModule });

  return {
    isAuthorized: isAuthorized({ passport, authenticationModule, constants })
  };
};
