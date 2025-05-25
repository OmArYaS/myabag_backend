export const canAccessOwnData = (req, res, next) => {
  const userId = req.params.id;
  if (req.user.role === "admin" || req.user.id === userId) {
    return next();
  }
  return res.status(403).json({ message: "Access denied." });
};