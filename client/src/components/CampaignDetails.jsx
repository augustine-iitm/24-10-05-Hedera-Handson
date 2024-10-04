import { useState, useEffect } from 'react';
import {  useParams } from 'react-router-dom';
import APP_CONSTANTS from '../constants';
import Spinner from '../assets/spinner.svg';
import { donate } from "../hedera/executeContract";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWallet from '../usewallet';

const CampaignDetails = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [amount, setAmount] = useState('');
    const [campaign, setCampaign] = useState(null);
    const [remainingDays, setRemainingDays] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [isDonating, setIsDonating] = useState(false);

    const { provider, address } = useWallet(); 
    const walletData = [address, provider];
    console.log(walletData);    

    const fetchCampaignData = async () => {
        try {
            const response = await fetch(`${APP_CONSTANTS.backendURL}/campaign/${id}`);
            const data = await response.json();
            const deadlineDate = new Date(data.deadline * 1000);
            const daysLeft = Math.ceil((deadlineDate - Date.now()) / (1000 * 60 * 60 * 24));
    
            // Calculate active status based on days left and amount collected
            const amountCollected = parseFloat(data.amountCollected);
            const targetAmount = parseFloat(data.target);
            const isActive = daysLeft > 0 && amountCollected < targetAmount;
    
            setRemainingDays(daysLeft > 0 ? daysLeft : 0);
            setIsActive(isActive);
    
            setCampaign({
                owner: data.owner,
                title: data.title,
                description: data.description,
                target: targetAmount.toFixed(2) + ' HBAR',
                deadline: deadlineDate.toISOString().split('T')[0],
                amountCollected: amountCollected.toFixed(2) + ' HBAR',
                image: data.image,
                donators: data.donators,
                donations: data.donations.map(donation => parseFloat(donation).toFixed(2) + ' HBAR')
            });
        } catch (error) {
            console.error('Failed to fetch campaign data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCampaignData(); // Fetch campaign data on component mount
    }, [id]);

    

    const handleDonate = async () => {
        if (!address) {
            toast.error('You must be connected to donate.');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        setIsDonating(true);
        const txResult = await donate(walletData, APP_CONSTANTS.contractAddress, id, amount);
        setIsDonating(false);

        if (txResult) {
            toast.success('Donation successful! Thank you for your support.');
            fetchCampaignData(); // Re-fetch campaign data after donation
        } else {
            toast.error('Donation failed. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="spinner">
                <img src={Spinner} alt="Loading..." />
            </div>
        );
    }

    if (!campaign) {
        return <div>No campaign found.</div>;
    }

    return (
        <div>
            <ToastContainer style={{ fontSize: '18px' }} />
            <div className="campaign-details-container">
                <div className="campaign-image-container">
                    <img src={campaign.image} alt="campaign" className="campaign-image" />
                </div>
                <div className="campaign-detail-right">
                    <div className="count-box-container">
                        <div className="count-box">
                            <p className="count-value">{remainingDays}</p>
                            <p className="count-title">Days Left</p>
                        </div>
                        <div className="count-box">
                            <p className="count-value">{campaign.amountCollected}</p>
                            <p className="count-title">Raised of {campaign.target}</p>
                        </div>
                        <div className="count-box">
                            <p className="count-value">{((parseFloat(campaign.amountCollected) / parseFloat(campaign.target)) * 100).toFixed(0)}%</p>
                            <p className="count-title">Target Percentage</p>
                        </div>
                        <div className="count-box">
                            <p className="count-value">{isActive ? 'Active' : 'Inactive'}</p>
                            <p className="count-title">Status</p>
                        </div>
                    </div>

                    <div className="fund-box">
                        <h4 className="section-title">Fund</h4>
                        <p className="fund-text">Fund the campaign</p>
                        <div className="input-section">
                            <input 
                                type="number"
                                placeholder="HBAR 0.1"
                                step="0.01"
                                className="amount-input"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={!isActive || isDonating} // Disable input during donation
                            />
                            <button 
                                type="button"
                                className="fund-button"
                                onClick={handleDonate}
                                disabled={!isActive || isDonating} // Disable button during donation
                            >
                                {isDonating ? 'Donating...' : 'Fund Campaign'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="details-section">
                <div className="details-left">
                    <h4 className="section-title">Story</h4>
                    <div className="story-description">
                        <p>{campaign.description}</p>
                    </div>
                </div>
                <div className="details-right">
                    <h4 className="section-title">Donators</h4>
                    <div className="donators-list">
                        {campaign.donators.length > 0 ? campaign.donators.map((address, index) => (
                            <div key={`${address}-${index}`} className="donator-item">
                                <p className="donator-address">{address}</p>
                                <p className="donator-amount">{campaign.donations[index]}</p>
                            </div>
                        )) : (
                            <p className="no-donators">No donators yet. Be the first one!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignDetails;
