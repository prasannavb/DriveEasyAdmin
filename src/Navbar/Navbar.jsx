//React
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

//Antd-Framework
import {BarChartOutlined,LogoutOutlined,PlusSquareOutlined,CreditCardOutlined} from '@ant-design/icons'

//CSS
import './Navbar.css'

//Images
import Logo from '../Images/Logo.png'

const Navbar = () => {
    const location = useLocation();
    const Navigate = useNavigate();
  
    const isActiveLink = (path) => {
      return location.pathname === path;
    };

  
    return (
      <div className="Navbar">
        <div className="Navbar-Logo-div">
          <img src={Logo} alt="Company Logo" className="Navbar-Logo" />
          <h2 className="Navbar-Logo-title">DriveEasy</h2>
        </div>
        <div className="Navbar-items">
          <Link
            to="/Dashboard"
            className={`Navbar-links ${isActiveLink("/Dashboard") && "active"}`}
          >
            <BarChartOutlined style={{ marginRight: "2%", fontSize: "25px" }} />{" "}
            Dashbaord
          </Link>
          <Link
            to="/Add"
            className={`Navbar-links ${isActiveLink("/Add") && "active"}`}
          >
            <PlusSquareOutlined
              style={{
                marginRight: "2%",
                fontSize: "25px",
                transform: "rotateY(180deg)",
              }}
            />{" "}
            Add
          </Link>
          <Link className={`Navbar-links ${isActiveLink("/Coupon") && "active"}`} to='/Coupon'> <CreditCardOutlined style={{marginRight:'2%',fontSize:'25px'}} />Generate Coupon</Link>

          <button
            onClick={() => {
              sessionStorage.removeItem("userAuth"), Navigate("/");
            }}
          >
            <LogoutOutlined style={{ marginRight: "2%", fontSize: "25px" }} />
            Logout
          </button>
        </div>
      </div>
    );
  };
  
  export default Navbar;
  