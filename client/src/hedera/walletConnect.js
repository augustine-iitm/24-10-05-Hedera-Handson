import { ethers } from "ethers";
const network = "testnet";

async function walletConnectFcn() {
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

	let chainId;
	if (network === "testnet") {
		chainId = "0x128";
	} else if (network === "previewnet") {
		chainId = "0x129";
	} else {
		chainId = "0x127";
	}

	let selectedAccount;
	try {
		await window.ethereum.request({
		   method: "wallet_switchEthereumChain",
		   params: [{ chainId: chainId }],
		});

		await provider
		.send("eth_requestAccounts", [])
		.then((accounts) => {
			selectedAccount = accounts[0];
			console.log(`- Selected account: ${selectedAccount} ✅`);
		})
		.catch((connectError) => {
			console.log(`- ${connectError.message.toString()}`);
			return;
		});
		console.log(selectedAccount, provider, network);
	 } catch (switchError) {
		if (switchError.code === 4902) {
		   try {
			  await window.ethereum.request({
				 method: "wallet_addEthereumChain",
				 params: [
					{
					   chainName: `Hedera ${network}`,
					   chainId: chainId,
					   nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
					   rpcUrls: [`https://${network}.hashio.io/api`],
					   blockExplorerUrls: [`https://hashscan.io/${network}/`],
					},
				 ],
			  });
		   } catch (addError) {
			  console.error("Failed to add the network:", addError.message);
		   }
		} else {
		   console.error("Failed to switch the network:", switchError.message);
		}
	 }
	return [selectedAccount, provider, network];
}

  
export default walletConnectFcn;