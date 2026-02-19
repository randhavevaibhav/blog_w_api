import { catchAsync } from "../../../utils/catchAsync.js";
import { getPopularHashtags } from "../../../model/Hashtags/quires.js";

export const getPopularHashtagsController = catchAsync(
  async (req, res, next) => {
    const hashtags = await getPopularHashtags();
    const normalizedHashtags = hashtags.reduce((acc, tag) => {
      return {
        ...acc,
        [tag.id]: {
          ...tag,
        },
      };
    }, {});

    return res.status(200).send({
      message: "found popular hashtags",
      hashtags: normalizedHashtags,
    });
  },
);
