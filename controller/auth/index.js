import { signinController } from "./signin/post/signinController.js";
import { signupController } from "./signup/post/signupController.js";
import { logoutController } from "./logout/get/logoutController.js";
import { terminateSessionController } from "./terminateSession/post/terminateSessionController.js";

export default {
  signinController,
  signupController,
  logoutController,
  terminateSessionController
};
