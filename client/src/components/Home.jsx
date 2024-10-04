import { useEffect, useState } from 'react';
import Spinner from '../assets/spinner.svg';
import FundCard from './Card';
import APP_CONSTANTS from '../constants';

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isCampaignsLoading, setIsCampaignLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  

  const fetchCampaigns = async () => {
    setIsCampaignLoading(true);
    try {
      const response = await fetch(`${APP_CONSTANTS.backendURL}/active-campaigns`);
      const data = await response.json();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsCampaignLoading(false);
    }
  };

  return (
    <div className="home">
      <h1 className="home-heading">Explore current fundraisers</h1>
      <hr className="horizontalLine" />

      <div className="tab-content">
        {isCampaignsLoading && (
          <div className="spinner">
            <img src={Spinner} alt="Loading..." />
          </div>
        )}

        {!isCampaignsLoading && campaigns.length === 0 && <h2>No active campaigns found.</h2>}

        {!isCampaignsLoading && campaigns.map((campaign, index) => (
          <FundCard key={index} {...campaign} />
        ))}
      </div>
    </div>
  );
};

export default Home;
