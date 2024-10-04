import { createStore } from 'redux';

const initialState = {
  provider: null,
  signer: null,
  address: null,
};

const SET_WALLET = 'SET_WALLET';
const RESET_WALLET = 'RESET_WALLET';

export const setWallet = (wallet) => ({
  type: SET_WALLET,
  payload: wallet,
});

export const resetWallet = () => ({
  type: RESET_WALLET,
});

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET:
      return {
        ...state,
        provider: action.payload.provider,
        signer: action.payload.signer,
        address: action.payload.address,
      };
    case RESET_WALLET:
      return initialState;
    default:
      return state;
  }
};

const store = createStore(walletReducer);

export default store;
