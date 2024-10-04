import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useWallet from '../usewallet';
import APP_CONSTANTS from '../constants';
import Spinner from '../assets/spinner.svg';
import { toast, ToastContainer } from 'react-toastify'; 

const MyDonations = () => {
  const [donations, setDonations] = useState([]); 
  const [loading, setLoading] = useState(true);
  const { address } = useWallet(); 

  const fetchDonations = async () => {
    if (!address) {
      toast.error('Wallet address not found. Please connect your wallet.'); 
      setLoading(false); 
      return; 
    }

    try {
      setLoading(true); 
      const response = await axios.post(`${APP_CONSTANTS.backendURL}/mydonations`, {
        address, 
      });
      console.log(response);
      if (response.data.success) {
        setDonations(response.data.donations); 
        console.log(response.data.donations);
      } else {
        toast.error('Failed to fetch donations.'); 
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast.error('Error fetching donations.'); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchDonations();
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

  if (donations.length === 0) {
    return <p className='no-campaigns'>No donations found.</p>; // Show message if no donations are found
  }

  return (
    <div className="my-donations-container">
      <h2 className="my-donations-heading">My Donations</h2>
      <div className="donations-grid">
        {donations.map((donation, index) => (
          <div key={index} className="donation-card">
            <p className="donation-id">Campaign ID: {donation.campaignId}</p>
            <p className="donation-amount">Amount: {donation.amount} HBAR</p>
            <Link to={`/campaign-details/${donation.campaignId}`} className="view-campaign-link">
              View Campaign
            </Link>
          </div>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}

export default MyDonations;
