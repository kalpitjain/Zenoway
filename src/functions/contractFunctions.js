// contractFunctions.js
import { ethers } from "ethers";
import Contract from "./Contract.json";

export async function getProviderAndChainId() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();
  return { provider, chainId: network.chainId };
}

export async function getZenowayContract(chainId) {
  let zenowayContract;

  if (chainId === 80001) {
    zenowayContract = {
      contractAddress: Contract.MumbaiContractAddress,
      contractAbi: Contract.abi,
    };
  } else if (chainId === 8082) {
    zenowayContract = {
      contractAddress: Contract.ShardeumContractAddress,
      contractAbi: Contract.abi,
    };
  } else {
    zenowayContract = {
      contractAddress: Contract.SpoliaContractAddress,
      contractAbi: Contract.abi,
    };
  }

  return zenowayContract;
}
