
import { FollowerAnalytics } from "./FollowerAnalytics.js";


export const getFollowerAnalytics = async ({ userId }) => {
  const result = await FollowerAnalytics.findOne({
    attributes: ["followers", "following"],
    where: {
      user_id: userId,
    },
  });

  return result;
};
