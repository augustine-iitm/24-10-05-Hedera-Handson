import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWallet, resetWallet } from './store';
import walletConnectFcn from "./hedera/walletConnect";

const useWallet = () => {
  const dispatch = useDispatch();
   const { provider, signer, address } = useSelector((state) => state);

  const connectWallet = async () => {
    try {
      const [selectedAccount, _provider, network] = await walletConnectFcn();
      console.log(selectedAccount);
      const _signer = _provider.getSigner();
      dispatch(setWallet({ provider: _provider, signer: _signer, address: selectedAccount }));
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleAccountChange = (accounts) => {
    if (accounts.length > 0) {
      const _address = accounts[0];
      console.log(_address);
      dispatch(setWallet({ ...provider, address: _address }));
    } else {
      dispatch(resetWallet());
    }
  };

  const handleNetworkChange = (newNetwork) => {
    console.log('Network changed to:', newNetwork);
    if(newNetwork!=296){
      dispatch(resetWallet());
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
      window.ethereum.on('networkChanged', handleNetworkChange); 
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
        window.ethereum.removeListener('networkChanged', handleNetworkChange); 
      };
    }
  }, [provider]);

  return { connectWallet, provider, signer, address };
};

export default useWallet;
