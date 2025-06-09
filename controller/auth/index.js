import { signinController } from "./singin/post/singinController.js";
import { singupController } from "./signup/post/singupController.js";
import { logoutController } from "./logout/get/logoutController.js";
import { terminateSessionController } from "./terminateSession/post/terminateSessionController.js";

export default {
  signinController,
  singupController,
  logoutController,
  terminateSessionController
};
