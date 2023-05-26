const checkTokens = (req, res, next) => {
  let apiKey = req.get("apiKey");
  if (apiKey == process.env.API_KEY) next();
  else
    return res.status(400).send({
      status: "Failed",
      message: "Invalid credentials",
    });
};

module.exports = {
  checkTokens,
};
