export const domen = (req) =>
  process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
