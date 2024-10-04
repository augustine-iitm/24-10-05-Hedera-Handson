const express = require('express');
const { ethers } = require('ethers');
const abi = require('./abi');
const { BigNumber } = require('ethers');
const cors = require('cors'); 

const app = express();
const port = 3000;

const providerUrl = 'https://testnet.hashio.io/api';
const provider = new ethers.JsonRpcProvider(providerUrl);
app.use(cors()); // Allow all origins
app.use(express.json());



const contractAddress = '0x643F910Db5EdC319790A8316fb3c08B213351cd8';
const contract = new ethers.Contract(contractAddress, abi, provider);

app.get('/campaign/:id', async (req, res) => {
  const campaignId = parseInt(req.params.id);

  try {
    const campaign = await contract.getCampaign(campaignId);

    const formattedData = {
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatUnits(campaign.target, 8), 
      deadline: campaign.deadline.toString(),
      amountCollected: ethers.formatUnits(campaign.amountCollected, 8),
      image: campaign.image,
      donators: campaign.donators,
      donations: campaign.donations.map(donation =>ethers.formatUnits(donation, 8)) 
    };

    res.json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve campaign data' });
  }
});

app.get('/active-campaigns', async (req, res) => {
  try {
    const campaigns = await contract.getCampaigns();

    const currentTimestamp = Math.floor(Date.now() / 1000); 

    let activeCampaigns = campaigns.filter(campaign => campaign.deadline > currentTimestamp);

    const sortedActiveCampaigns = [...activeCampaigns].sort((a, b) => parseInt(a.deadline) - parseInt(b.deadline));

    const formattedCampaigns = sortedActiveCampaigns.map((campaign, index) => ({
      cId: campaign.id.toString(), 
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatUnits(campaign.target, 8),
      deadline: campaign.deadline.toString(),
      amountCollected: ethers.formatUnits(campaign.amountCollected, 8),
      image: campaign.image
    }));

    res.json(formattedCampaigns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve campaigns' });
  }
});

app.post('/mycampaigns', async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address is required',
    });
  }

  try {
    const campaigns = await contract.getMyCampaigns(address);
    console.log(campaigns);

    const formattedCampaigns = campaigns.map((campaign, index) => ({
      cId: campaign.id.toString(),
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.formatUnits(campaign.target, 8),
      deadline:campaign.deadline.toString(), 
      amountCollected: ethers.formatUnits(campaign.amountCollected, 8), 
      image: campaign.image,
      totalDonators: campaign.donators.length,
    }));

    res.status(200).json({
      success: true,
      data: formattedCampaigns,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve campaigns',
    });
  }
});

app.post('/mydonations', async (req, res) => {
  const { address } = req.body; 

  if (!address) {
    return res.status(400).json({
      success: false,
      message: 'Address is required',
    });
  }

  try {
    const result = await contract.getMyDonations(address);
    const [campaignIds, donationAmounts] = result;
    const formattedDonations = donationAmounts.map((amount, index) => ({
      campaignId: campaignIds[index].toString(),
      amount: ethers.formatUnits(amount, 8), 
    }));

    res.status(200).json({
      success: true,
      donations: formattedDonations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve donations',
    });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



