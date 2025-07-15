import sequelize from "../../db.js";
import { QueryTypes } from "sequelize";
import { PostHashtags } from "./PostHashtags.js";

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

export const createPostHashtags = async({postId,hashtagIdList})=>{

    const postHashtagList = hashtagIdList.map((hashtag)=>{
        return {
            hashtag_id :hashtag.id,
            post_id:postId
        }
    })

    const result = await PostHashtags.bulkCreate(postHashtagList);

    return result;

}

export const deletePostHashtags = async({postId})=>{
 
     const result = await PostHashtags.destroy({
      where :{
        post_id:postId
      }
     });

    return result;
}