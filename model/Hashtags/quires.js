import { QueryTypes } from "sequelize";
import sequelize from "../../db.js";
import { Hashtags } from "./Hashtags.js";


export const getAllHashtags = async()=>{

  const result = await Hashtags.findAll({
    raw:true
  });

  return result;
}

export const getPopularHashtags = async()=>{
  const result = await sequelize.query(`
    WITH
    HashtagCounts AS (
        SELECT
            h.id,
            h.color,
            h.name,
            COUNT(ph.post_id) AS usage_count
        FROM
            hashtags h
            JOIN post_hashtags ph ON h.id = ph.hashtag_id
        GROUP BY
            h.id,
            h.color,
            h.name
    )
SELECT
    id,
    name,
    color,
    usage_count,
    ROW_NUMBER() OVER (
        ORDER BY
            usage_count DESC
    ) as popularity_rank
FROM
    HashtagCounts
ORDER BY
    popularity_rank ASC
limit
    5;`,{
      type:QueryTypes.SELECT,
      raw:true
    });

    return result;
}


