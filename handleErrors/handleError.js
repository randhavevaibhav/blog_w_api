export const handleError = (err) => {
  
  const error = err.errors[0];

  // console.log("Error ====> ###########, ",Object.keys(error))
 return `Error ocuured at field ${error.path}.`
};
