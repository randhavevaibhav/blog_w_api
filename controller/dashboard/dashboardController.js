export const dashboardController = async (req, res) => {
  try {
    res.status(200).send({
      message: "dashboard page",
    });
  } catch (error) {
    console.log("Error ocuured in dashboardController ==> ", error);
    return res.status(500).send({
      message:"Internal Server Error"
    })
  }
};
