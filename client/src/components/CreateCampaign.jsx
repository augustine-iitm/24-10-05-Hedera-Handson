import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import contractExecuteFcn from "../hedera/executeContract";
import useWallet from '../usewallet';
import { useNavigate } from "react-router-dom";
import APP_CONSTANTS from '../constants';

const CreateCampaign = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const {provider, address } = useWallet(); // Use the hook
  const contractAddress = APP_CONSTANTS.contractAddress;
  const navigate = useNavigate();

  useEffect(() => {
    if (!address) {
      toast.error("You must be connected to create a campaign.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is connected
    if (!address) {
      toast.error("You must be connected to create a campaign.");
      return;
    }

    const deadlineDate = new Date(deadline);
    const epochTime = Math.floor(deadlineDate.getTime() / 1000);
    
    setLoading(true);

    try {
      console.log(provider);
      const txHash = await contractExecuteFcn([  address, provider ], contractAddress, title, description, target, epochTime, image, navigate);
      if (txHash) {  
        toast.success(`Campaign created successfully! Transaction hash: ${txHash}`);
      } else {
        toast.error('Failed to create campaign.');
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-campaign-container">
      <h2>Create Campaign</h2>
      <form onSubmit={handleSubmit} className="create-campaign-form">
        <div className="input-box">
          <label>Campaign Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>Target Amount (in HBAR)</label>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label>Image URL</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateCampaign;
