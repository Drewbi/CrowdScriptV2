module.exports.routeHandler = (req, res, router) => {
  const handler = router[req.method];
  if (handler) {
    return handler(req, res);
  }
  return res.status(405).json({ message: 'Invalid request' });
};
