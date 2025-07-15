import { Hashtags } from "./Hashtags.js";


export const getAllHashtags = async()=>{

  const result = await Hashtags.findAll();

  return result;
}


