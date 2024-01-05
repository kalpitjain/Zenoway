// uploadImage.js
import axios from "axios";

export async function uploadImageToIPFS(image) {
  const data = new FormData();
  data.append("file", image);

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: "52a084fdd2c59360dcb7",
          pinata_secret_api_key:
            "8ce0d49080a717d547482ac09191e276dd4cdbe49e67200313cd82c9cd6d7cfd",
        },
      }
    );

    return "https://gateway.ipfs.io/ipfs/" + response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading image to IPFS:", error);
    throw error;
  }
}
