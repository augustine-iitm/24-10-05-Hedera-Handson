import abi from "./contracts/abi";
import { ethers } from "ethers";

const tinybarsToHbar = (target) => {
    return target / 100000000;
};

const hbarToTinybars = (target) => {
    return target * 100000000;
}; 


async function contractExecuteFcn(walletData, contractAddress, title, description, target, deadline, image, navigate) {
    const provider = walletData[1];
    const signer = provider.getSigner();

    try {
        const myContract = new ethers.Contract(contractAddress, abi, signer);

        const gasEstimate = await myContract.estimateGas.createCampaign(title, description, hbarToTinybars(target), deadline, image);
        const createCampaignTx = await myContract.createCampaign(
            title, description, hbarToTinybars(target), deadline, image, { 
                gasLimit: gasEstimate,
                maxFeePerGas: ethers.utils.parseUnits('2000', 'gwei'),
                maxPriorityFeePerGas: ethers.utils.parseUnits('1000', 'gwei')
            }
        );

        const createCampaignRx = await createCampaignTx.wait();

        const campaignCreatedEvent = createCampaignRx.events.find(event => event.event === 'CampaignCreated');
        if (campaignCreatedEvent) {
            const campaignId = campaignCreatedEvent.args.campaignId;
            navigate(`/campaign-details/${campaignId}`);
        } else {
            console.log(`- Campaign creation event not found in logs.`);
        }

    } catch (executeError) {
        console.log(`- ${executeError.message.toString()}`);
    }
}


async function getAllCampaigns(walletData, contractAddress) {

    const provider = walletData[1]; // Assuming walletData[1] is the provider
    const myContract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const campaigns = await myContract.getCampaigns();

        const parsedCampaigns = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            target:tinybarsToHbar(campaign.target),
            deadline: campaign.deadline.toNumber(),
            amountCollected: tinybarsToHbar(campaign.amountCollected) ,
            image: campaign.image,
            pId: i
        }));

        return parsedCampaigns;
    } catch (error) {
        console.error(`- Failed to retrieve campaigns: ${error.message}`);
        return [];
    }
}

async function getUserCampaigns(walletData, contractAddress, userAddress) {

    const allCampaigns = await getAllCampaigns(walletData, contractAddress);
    const filteredCampaigns = allCampaigns.filter(campaign => campaign.owner === userAddress);
    
    return filteredCampaigns;
}

async function donate(walletData, contractAddress, pId, amount) {

    const provider = walletData[1];
    const signer = provider.getSigner();
    const myContract = new ethers.Contract(contractAddress, abi, signer);

    try {
		const valueInWei = ethers.utils.parseUnits(amount.toString(), 18); // Convert HBAR to smallest unit
        const donationTx = await myContract.donateToCampaign(pId, { value: valueInWei });
        const donationRx = await donationTx.wait();

        return donationRx;
    } catch (error) {
        console.error(`- Failed to donate: ${error.message}`);
        return null;
    }
}

async function getDonations(walletData, contractAddress, pId) {

    const provider = walletData[1];
    const myContract = new ethers.Contract(contractAddress, abi, provider);

    try {
        const donations = await myContract.getDonators(pId);
        const numberOfDonations = donations[0].length;

        const parsedDonations = [];

        for(let i = 0; i < numberOfDonations; i++) {
            parsedDonations.push({
                donator: donations[0][i],
                donation: ethers.utils.formatEther(donations[1][i].toString())
            });
        }

        return parsedDonations;
    } catch (error) {
        console.error(`- Failed to retrieve donations: ${error.message}`);
        return [];
    }
}

export default contractExecuteFcn;
export { getAllCampaigns, getUserCampaigns, donate, getDonations };
