import {
  checkIfAlreadyFollowed,
  createNewFollowerTransaction,
} from "../../../model/Followers/quires.js";
import { catchAsync } from "../../../utils/catchAsync.js";


export const createNewFollowerController = catchAsync(
  async (req, res) => {
    const {userId} = req.user;
    const { followingUserId } = req.body

    const isAlreadyFollowed = await checkIfAlreadyFollowed({
      userId,
      followingUserId,
    });

    if (isAlreadyFollowed) {
      return res.status(200).send({
        message: "already followed !",
        followed: true,
      });
    }

    await createNewFollowerTransaction({
      userId,
      followingUserId
    })

    res.status(201).send({
      message: `followed new user`,
      followed: true,
    });
  }
);
