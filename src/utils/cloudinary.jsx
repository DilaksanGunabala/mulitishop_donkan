export const uploadImageToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "my_unsigned_upload");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/ddszxtx3p/image/upload",
        {
            method: "POST",
            body: data,
        }
    );

    const result = await res.json();

    return result.secure_url;
};