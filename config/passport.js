const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../src/models/userModel");
require("dotenv").config();

const initializePassport = (passport) =>{
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails[0].value;

        let user = await User.findOne({ googleId: id });
        if (!user) {
          user = await User.create({
            googleId: id,
            name: displayName,
            email,
            isVerified: true,
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
};

module.exports = initializePassport;
