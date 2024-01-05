// postFunctions.js
import {
  getProviderAndChainId,
  getZenowayContract,
} from "../functions/contractFunctions";
import { ethers } from "ethers";

export async function getPostDetails(userAddress, postId) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const [image, name, allLikesUsers] = await Promise.all([
      contract.getUserProfileImage(userAddress),
      contract.getUserName(userAddress),
      contract.getPostLikes(postId),
    ]);

    return { image, name, allLikesUsers };
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
}

export async function getLikeCount(postId) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const likesCount = await contract.getPostLikesCount(postId);
    return likesCount;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
}

export async function getIsLiked(postId, targetAddress) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const isLiked = await contract.hasLiked(postId, targetAddress);
    return isLiked;
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
}

export async function likePost(postId) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      signer
    );

    const tx = await contract.likePost(postId, {
      gasLimit: 300000,
    });
    await tx.wait();
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}

export async function unLikePost(postId) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      signer
    );

    const tx = await contract.unlikePost(postId, {
      gasLimit: 300000,
    });
    await tx.wait();
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}
