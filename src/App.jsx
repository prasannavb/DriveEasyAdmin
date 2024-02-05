// React
import { BrowserRouter, Route, Routes } from "react-router-dom";

//Module
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import Add from './Add/Add.jsx'
import Coupon from "./Coupon/Coupon.jsx";
import Error from "./Error/Error";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/Add" element={<Add/>}/>
          <Route path="/Coupon" element={<Coupon/>}/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
