import { daysLeft } from '../utils';
import { Link } from 'react-router-dom';

const CampaignCard = ({ owner, title, description, target, deadline, amountCollected, image, cId, totalDonators }) => {
  const remainingDays = daysLeft(deadline);

  // Restrict description to 30 words
  const truncatedDescription = description.split(" ").slice(0, 30).join(" ") + (description.split(" ").length > 30 ? "..." : "");

  amountCollected = Number(amountCollected);
  target = Number(target);
  const isActive = remainingDays > 0 && amountCollected < target;
  console.log(remainingDays, amountCollected, target);
  const status = isActive ? "Active" : "Inactive";

  return ( 
    <Link className="campaign-card" to={`/campaign-details/${cId}`}>
      <img src={image} alt="campaign" className="campaign-card-img" />

      <div className="campaign-card-content">
        <div className="block">
          <h3 className="campaign-card-title">{title}</h3>
          <p className="campaign-card-description">{truncatedDescription}</p>
        </div>

        <div className="campaign-card-stats">
          <div>
            <h4>{amountCollected}</h4>
            <p>Raised of {target}</p>
          </div>
          <div>
            <h4>{remainingDays}</h4>
            <p>Days Left</p>
          </div>
          <div>
            <h4>{totalDonators}</h4>
            <p>Total Donators</p>
          </div>
          <div>
            <h4>{status}</h4>
            <p>Status</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CampaignCard;
