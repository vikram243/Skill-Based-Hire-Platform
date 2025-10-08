export const getSafeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isActive: user.isActive,
  isProvider: user.isProvider,
  providerStatus: user.providerStatus
});