import { createClient } from "@supabase/supabase-js";

const bucketList = {
  postTitleImgBucket: `post-title-imgs`,
  userAvatarBucket: `user-avatar`,
};

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export const supabaseFileUpload = async ({
  bucket,
  fileName,
  compressedImageBuffer,
  mimetype,
}) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, compressedImageBuffer, {
      contentType: mimetype,
    });

  if (error) {
    console.log(error)
    throw new Error(`Error while uploading file to supabase! ==>`,error);

  }

  return data;
};

export const supabaseGetFilePublicUrl = async ({ bucket, fileName }) => {
  const { data, error } = supabase.storage.from(bucket).getPublicUrl(fileName);
  if (error) {
    throw new Error(
      `Error while getting public URL for ${fileName} from supabase! ==> ${error}`
    );
  }

  return { publicUrl: data.publicUrl };
};


