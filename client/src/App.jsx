import { Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import CampaignDetails from "./components/CampaignDetails";
import CreateCampaign from "./components/CreateCampaign";
import MyCampaigns from "./components/MyCampaigns";
import MyDonations from "./components/MyDonations";
import Footer from "./components/Footer";

function App() {
  return (
    <>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-campaigns" element={<MyCampaigns/>} />
            <Route path="/my-donations" element={<MyDonations/>} />
            <Route path="/create-campaign" element={<CreateCampaign/>} />
            <Route path="/campaign-details/:id" element={<CampaignDetails/>} />
          </Routes>
        </div>
        <div>
    </div>
        <Footer/>

    </>

  
  )
}


export default App
