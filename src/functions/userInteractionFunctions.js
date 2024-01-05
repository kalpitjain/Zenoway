// userFunctions.js
import {
  getProviderAndChainId,
  getZenowayContract,
} from "../functions/contractFunctions";
import { ethers } from "ethers";
import { uploadImageToIPFS } from "./uploadImageFunction";

export async function getUserDetails(userAddress) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const [image, name] = await Promise.all([
      contract.getUserProfileImage(userAddress),
      contract.getUserName(userAddress),
    ]);

    return { image, name };
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
}

export async function getLeftSideBarDetails(userAddress) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const [image, name, notificationCount] = await Promise.all([
      contract.getUserProfileImage(userAddress),
      contract.getUserName(userAddress),
      contract.getNotificationCount(userAddress),
    ]);

    return { image, name, notificationCount };
  } catch (error) {
    console.error("Error in getUserDetails:", error);
    throw error;
  }
}

export async function getFollowingStatus(userAddress, targetAddress) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);
    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );

    const status = await contract.isFollowing(userAddress, targetAddress);
    return status;
  } catch (error) {
    console.error("Error in getFollowingStatus:", error);
    throw error;
  }
}

export async function followUser(targetAddress) {
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

    const tx = await contract.followUser(targetAddress, {
      gasLimit: 300000,
    });
    await tx.wait();
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}

export async function unfollowUser(targetAddress) {
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

    const tx = await contract.unfollowUser(targetAddress, {
      gasLimit: 300000,
    });
    await tx.wait();
  } catch (error) {
    console.error("Error in unfollowUser:", error);
    throw error;
  }
}

export async function getUserAllDetails(contract, userAddress) {
  try {
    const image = await contract.getUserProfileImage(userAddress);
    const name = await contract.getUserName(userAddress);
    const bio = await contract.getUserBio(userAddress);
    const following = await contract.getFollowingsCount(userAddress);
    const follower = await contract.getFollowersCount(userAddress);
    const postsCount = await contract.getUserPostsCount(userAddress);
    const followersAddresses = await contract.getFollowersAddress(userAddress);
    const followingAddresses = await contract.getFollowingAddresses(
      userAddress
    );

    return {
      image,
      name,
      bio,
      following: following.toNumber(),
      follower: follower.toNumber(),
      postsCount: postsCount.toNumber(),
      followersAddresses,
      followingAddresses,
    };
  } catch (error) {
    console.error("Error in getUserAllDetails:", error);
    throw error;
  }
}

export async function updateUserName(userName) {
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

    const tx = await contract.setUserName(userName, {
      gasLimit: 300000,
    });
    await tx.wait();
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}

export async function updateUserProfile(profileImage) {
  try {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    const imgUrl = profileImage ? await uploadImageToIPFS(profileImage) : "";

    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      signer
    );

    const updateUserImage = async (imgUrl) => {
      const tx = await contract.setUserProfileImage(imgUrl);
      await tx.wait();
    };

    await updateUserImage(imgUrl, { gasLimit: 300000 });
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}

export async function updateUserBio(userBio) {
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

    const tx = await contract.setUserBio(userBio, {
      gasLimit: 300000,
    });
    await tx.wait();
  } catch (error) {
    console.error("Error in followUser:", error);
    throw error;
  }
}
