import { checkIfUserExistWithId } from "../../../model/Users/quries.js";

export const getUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).send({
        message: "Please send all required fields. userMail",
      });
    }

    const result = await checkIfUserExistWithId(userId);

    if (!result) {
      return res.status(404).send({
        message: "User not found !",
      });
    }
    const resData = {
      userId: result.id,
      userName: result.first_name,
      userMail: result.email,
      registeredAt: result.registered_at,
    };

    return res.status(200).send({
      message: "found user !",
      user: JSON.stringify(resData),
    });
  } catch (error) {
    console.log("Error ocuured in getUserController ===> ", error);
   return  res.status(500).send({
      message: "Internal server error.",
    });
  }
};
