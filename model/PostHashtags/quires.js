import sequelize from "../../db.js";
import { QueryTypes } from "sequelize";


export const getAllPostHashtags = async ({ postId }) => {
  const result = await sequelize.query(
`select h.name,ph.post_id,h.id,h.color
from post_hashtags ph
join hashtags h on h.id=ph.hashtag_id
where ph.post_id=:postId`,
    {
      replacements: {
        postId,
      },
      type: QueryTypes.SELECT,
    }
  );

  return result;
};
