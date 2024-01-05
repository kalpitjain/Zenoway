import { ethers } from "ethers";
import { getProviderAndChainId, getZenowayContract } from "./contractFunctions";

let cachedProvider;
let cachedContract;

async function getProviderAndContract() {
  if (!cachedProvider || !cachedContract) {
    const { provider, chainId } = await getProviderAndChainId();
    const zenowayContract = await getZenowayContract(chainId);

    cachedProvider = provider;
    cachedContract = new ethers.Contract(
      zenowayContract.contractAddress,
      zenowayContract.contractAbi,
      provider
    );
  }

  return { provider: cachedProvider, contract: cachedContract };
}

export async function readNotifications(userAddress) {
  const { contract } = await getProviderAndContract();

  const allNotifications = await contract.getUserNotifications(userAddress);
  const notificationCount = await contract.getNotificationCount(userAddress);

  return {
    notifications: allNotifications,
    notificationsCount: notificationCount.toNumber(),
  };
}

export async function clearNotifications() {
  const { provider, contract } = await getProviderAndContract();

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const signer = provider.getSigner();

  const contractWithSigner = contract.connect(signer);

  const tx = await contractWithSigner.clearNotifications({
    gasLimit: 300000,
  });

  await tx.wait();
}
