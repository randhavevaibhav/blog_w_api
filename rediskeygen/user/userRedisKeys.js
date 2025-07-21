export const userRedisKeys = () => {
  const getUserInfoRedisKey = ({ userId }) => {
    return `getUserInfo:${userId}`;
  };
  return { getUserInfoRedisKey };
};
