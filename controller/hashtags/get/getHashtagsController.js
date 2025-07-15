
import { catchAsync } from "../../../utils/catchAsync.js";
import { getAllHashtags } from "../../../model/Hashtags/quires.js";

export const getHashtagsController = catchAsync(async (req, res, next) => {
  const hashtags = await getAllHashtags();


  return res.status(200).send({
    message: "found hashtags",
    hashtags,
  });
});
