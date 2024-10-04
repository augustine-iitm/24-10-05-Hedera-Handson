import { daysLeft } from '../utils';
import { Link } from 'react-router-dom';

const FundCard = ({ owner, title, description, target, deadline, amountCollected, image, handleClick, cId }) => {
  const remainingDays = daysLeft(deadline);

  // Helper function to truncate the description
  const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
  };

  return (
    <Link className="fund-card" to={`/campaign-details/${cId}`} onClick={handleClick}>
      <div className="fund-card-img-container">
        <img src={image || 'placeholder_image_url'} alt="fund" className="fund-card-img" />
      </div>

      <div className="fund-card-content">
        <div className="block">
          <h3 className="fund-card-title">{title}</h3>
          <p className="fund-card-description">{truncateText(description, 25)}</p> 
        </div>

        <div className="fund-card-stats">
          <div>
            <h4>{amountCollected}</h4>
            <p>Raised of {target}</p>
          </div>
          <div>
            <h4>{remainingDays}</h4>
            <p>Days Left</p>
          </div>
        </div>

        <div className="fund-card-footer">
          <p className="fund-card-owner-box">Created by <span>{owner}</span></p>
        </div>
      </div>  
    </Link>
  );
};

export default FundCard;
