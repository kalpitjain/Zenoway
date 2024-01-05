// uploadPost.js
import {
  getProviderAndChainId,
  getZenowayContract,
} from "../functions/contractFunctions";
import { uploadImageToIPFS } from "./uploadImageFunction";
import { ethers } from "ethers";

export async function uploadPost(image, postCaption) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const imgUrl = image ? await uploadImageToIPFS(image) : "";

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      signer
    );

    const createPost = async (imgUrl, postCaption) => {
      const tx = await contract.createPost(imgUrl, postCaption);
      await tx.wait();
    };

    await createPost(imgUrl, postCaption);
  } catch (error) {
    console.log(error);
    alert("Unable to Create Post!");
  }
}
