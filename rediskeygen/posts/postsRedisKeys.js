export const postsRedisKeys = () => {
  const getIndividualPostRedisKey = ({ postId }) => {
    return `getIndividualPost:${postId}`;
  };
  return { getIndividualPostRedisKey };
};
