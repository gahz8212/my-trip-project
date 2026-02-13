const passport = require("passport");
const local = require("./LocalStrategy");
const { User } = require("../models");
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      // console.log("디시리얼라이즈 실행:", id);
      const user = await User.findOne({ where: { id } });
      done(null, user);
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  local();
};
