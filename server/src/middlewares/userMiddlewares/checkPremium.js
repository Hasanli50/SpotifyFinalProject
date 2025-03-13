const User = require("../../models/user");

const checkPremiumStatus = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (user && user.isPremium && user.premiumSince) {
      const currentDate = new Date();
      const premiumExpirationDate = new Date(user.premiumSince);
      premiumExpirationDate.setMinutes(premiumExpirationDate.getMinutes() + 1);
      if (currentDate > premiumExpirationDate) {
        await User.findByIdAndUpdate(id, {
          isPremium: false,
          premiumSince: null,
        });
        req.premiumExpired = true;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkPremiumStatus;
