export const logoutController = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });

  res.redirect("/");
};
