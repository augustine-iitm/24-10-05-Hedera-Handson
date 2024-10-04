import { useState, useEffect } from 'react';
import CampaignCard from './CampaignCard';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; 
import useWallet from '../usewallet'; 
import APP_CONSTANTS from '../constants';
import Spinner from '../assets/spinner.svg';
import { toast, ToastContainer } from 'react-toastify'; 

const MyCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { address } = useWallet(); 

  const fetchCampaigns = async () => {
    if (!address) {
      toast.error('Wallet address not found. Please connect your wallet.'); 
      setLoading(false); 
      return; 
    }

    try {
      setLoading(true); 
      const response = await axios.post(`${APP_CONSTANTS.backendURL}/mycampaigns`, {
        address,
      }); 
      console.log(response.data);

      if (response.data.success) {
        setCampaigns(response.data.data); 
        if(response.data.data.length == 0){
          toast("No campaings found");
        }
      } else {
        toast.error('Failed to fetch campaigns.'); 
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Error fetching campaigns.'); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [address]);

  if (loading) {
    return (
      <div className="spinner">
        <img src={Spinner} alt="Loading..." />
      </div>
    ); 
  }

  if (!address) {
    return <p className='no-campaigns'>Please connect to wallet</p>; 
  }

  if (campaigns.length === 0) {
    return <p className="no-campaigns">No campaigns found.</p>; 
  }

  return (
    <div className="my-campaigns-container">
      <h2>My Campaigns</h2>
      <div className="campaigns-grid">
        {campaigns.map(campaign => (
          <CampaignCard
            key={campaign.cId}
            owner={campaign.owner}
            title={campaign.title}
            description={campaign.description}
            target={campaign.target}
            deadline={campaign.deadline}
            amountCollected={campaign.amountCollected}
            image={campaign.image}
            cId={campaign.cId}
            totalDonators={campaign.totalDonators}
          />
        ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyCampaigns;
