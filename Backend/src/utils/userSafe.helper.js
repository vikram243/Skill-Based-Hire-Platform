export const getSafeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: user.fullName,
  email: user.email,
  number: user.number,
  isActive: user.isActive,
  isProvider: user.isProvider,
  providerStatus: user.providerStatus,
  avatar: user.avatar,
  location: user.location,
  bio: user.bio
});