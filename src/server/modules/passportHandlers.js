const initPassportStrategy = ({ passport, ExtractJwt, config, JwtStrategy, authenticationModule }) => {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.SECRET
  };

  passport.use(new JwtStrategy(jwtOptions, authenticationModule.passportVerify));
}

const jwtAuthenticate = ({ req, res, next, passport }) => {
  passport.authenticate('jwt', {
    session: false
  })(req, res, next);
};

const isAuthorized = ({ passport, authenticationModule, constants }) => async (req, res, next) => {
  try {
    console.log(req.cookies)
    const bearer = req.cookies && req.cookies.token || '';
    const isTokenInBlackList = await authenticationModule.isTokenInvalidated(bearer);
    if (isTokenInBlackList) {
      res.status(constants.RESPONSE.STATUSES.UNAUTHORIZED).json({ message: constants.RESPONSE.MESSAGES.SESSION_EXPIRED });
    } else {
      jwtAuthenticate({ req, res, next, passport });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = ({ passport, ExtractJwt, config, JwtStrategy, authenticationModule, constants }) => {
  initPassportStrategy({ passport, ExtractJwt, config, JwtStrategy, authenticationModule });

  return {
    isAuthorized: isAuthorized({ passport, authenticationModule, constants })
  };
};
