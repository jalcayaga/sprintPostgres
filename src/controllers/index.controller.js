import config from "../config.js";

// render pagina principal
export const renderIndexPage = (req, res) => {
  const authenticated = req.session.userId ? true : false;
  res.render("index", { authenticated });
};
