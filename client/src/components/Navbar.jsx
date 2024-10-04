import { Link } from 'react-router-dom';
import useWallet from '../usewallet'; 

const Navbar = () => {
  const {  connectWallet, address } = useWallet(); 


  return (
    <div className='navbar'>
      <div className="navbar-left">
        <div className='logo'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#d80032" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
          </svg>
        </div>
        <div className='logo-text'>GiveBack</div>
      </div>
      <div className="navbar-right">
        {address ? (
          <>
            <Link className='nav-link' to="/">Home</Link>
            <Link className='nav-link' to="/my-campaigns">My Campaigns</Link>
            <Link className='nav-link' to="/my-donations">My Donations</Link>
            <Link className='nav-link-button btn-special' to="/create-campaign">Create Campaign</Link>
          </>
        ) : (
          <>
            <Link className='nav-link' to="/">Home</Link>
            <button className='nav-link-button btn-special' onClick={connectWallet}>Connect Wallet</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
