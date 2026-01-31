import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";



export const decCommentLike = async ({ commentId }) => {
  const result = await sequelize.query(`UPDATE comment_analytics
  SET likes = CASE
      WHEN likes > 0 THEN likes - 1
      ELSE 0
  END
  WHERE comment_id=:commentId`,{
    replacements:{commentId},
    type:QueryTypes.SELECT
  });

  return result;
};
