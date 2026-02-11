
import { catchAsync } from "../../../utils/catchAsync.js";
import { getAllHashtags } from "../../../model/Hashtags/quires.js";

export const getHashtagsController = catchAsync(async (req, res, next) => {
  const hashtags = await getAllHashtags();

  const normalizedHashtags = hashtags.reduce((acc,tag)=>{

    return {
      ...acc,
      [tag.id]:{
        ...tag
      }
    }
  },{

  })


  return res.status(200).send({
    message: "found hashtags",
    hashtags:normalizedHashtags,
  });
});
