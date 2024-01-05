// PostService.js
import { ethers } from "ethers";
import { getProviderAndChainId, getZenowayContract } from "./contractFunctions";

async function getZenowayInstance() {
  const { provider, chainId } = await getProviderAndChainId();
  const zenowayContract = await getZenowayContract(chainId);

  return new ethers.Contract(
    zenowayContract.contractAddress,
    zenowayContract.contractAbi,
    provider
  );
}

export async function readFollowingPosts(userAddress) {
  const contract = await getZenowayInstance();
  const followingPosts = await contract.readFollowingPosts(userAddress);
  return followingPosts;
}

export async function readPosts() {
  const contract = await getZenowayInstance();
  const allPosts = await contract.readPosts();
  return allPosts;
}

export async function readUserPosts(userAddress) {
  const contract = await getZenowayInstance();
  const userPosts = await contract.readUserPosts(userAddress);
  return userPosts;
}
