import Showdown from "showdown";
const converter = new Showdown.Converter();

export const markDownToHTMLController = async (req, res) => {
  try {
    const { content } = req.body;
    // console.log("content ===> ", content);
    if (!content) {
      return res.status(400).send({
        message: `please provide all required fields. ==> content`,
      });
    }
   const html = converter.makeHtml(content);

  
   
    res.status(200).send({
      message: `successfully converted markdown to HTML`,
      html
    });
  } catch (error) {
    console.log("Error occurred in createPostsController ==> ", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};
