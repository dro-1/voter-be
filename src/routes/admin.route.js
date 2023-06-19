const { adminController } = require("../controllers/admin.controller");

const Router = require("express").Router;

const adminRouter = Router();

adminRouter.post("/register", adminController.createAdmin);

adminRouter.get("/refresh", adminController.refreshAuthToken);

adminRouter.post("/login", adminController.adminLogin);

module.exports = {
  adminRouter,
};
