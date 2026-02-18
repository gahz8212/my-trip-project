const passport = require("passport");
const local = require("./LocalStrategy");
const pool=require("../db/db")
// const { User } = require("../models");
module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      // console.log("디시리얼라이즈 실행:", id);
      const [user] = await pool.query("SELECT * FROM users WHERE ID=?",[id]);
      done(null, user[0]);
    } catch (e) {
      console.error(e);
      done(e);
    }
  });

  local();
};
