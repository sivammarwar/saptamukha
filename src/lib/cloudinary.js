const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

/**
 * Uploads an image to Cloudinary with compression from the browser (client-side)
 * @param {Blob|File} image - Image blob or file object
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadImage(image, folder = "saptamukha/souls") {
  if (!CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary cloud name not set, skipping upload");
    return { url: null, public_id: null };
  }

  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "unsigned_preset"); // User needs to create an unsigned upload preset in Cloudinary
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload error:", errorData);
      throw new Error("Cloudinary upload failed");
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      public_id: data.public_id,
    };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}
