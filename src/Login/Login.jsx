//Hooks Imports
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";

//Antd-Framework
import { ConfigProvider,notification } from 'antd'

//CSS
import "./Login.css"

const Login = () => {
    
    const [formdata, Setformdata] = useState({ email: "", password: "" });
    const [Ack, SetAck] = useState(false);
    const [Errmsg, SetErr] = useState({ email: "", password: "" });
    const [api, contextHolder] = notification.useNotification();
  
    const Navigate = useNavigate();
  
    const openNotification = (message) => {
      api.warning({
        message: message,
        placement: "topRight",
        duration: 2,
        style: {
          background: "#EED202	",
        },
      });
    };
  
    const ValidateForm = () => {
      if (formdata.email.trim() === "" || formdata.email === null) {
        SetErr((prev) => {
          return { ...prev, email: "Enter your email" };
        });
        SetAck(true);
      } else if (!formdata.email.includes("@gmail.com")) {
        SetErr((prev) => {
          return { ...prev, email: "Enter a valid email" };
        });
        SetAck(true);
      } else {
        SetErr((prev) => {
          return { ...prev, email: "" };
        });
        SetAck(false);
      }
  
      if (formdata.password.trim() === "" || formdata.password === null) {
        SetErr((prev) => {
          return { ...prev, password: "Enter your password" };
        });
        SetAck(true);
      } else {
        SetErr((prev) => {
          return { ...prev, password: "" };
        });
        SetAck(false);
      }
  
      if (formdata.email !== "" &&formdata.email != null &&formdata.email.includes("@gmail.com") && formdata.password !== "" && formdata.password !== null) 
      {
        LoginInDetails();
      }
    };
  
    const LoginInDetails = async () => {
      const { data } = await axios.post("https://drive-easy-admin-server.vercel.app/", formdata);
      if (data.action) {
        sessionStorage.setItem("userAuth", true);
        Navigate("/Dashboard");
      } else {
        openNotification("Invalid Details");
      }
    };
  
    const LoginChange = (e) => {
      const { name, value } = e.target;
      Setformdata({ ...formdata, [name]: value.trim() });
    };
  
    return (
      <div className="LogIn-Page">
        <div className="LogIn-Form">
          <h1 className="LogIn-title">Login Page</h1>
          <label htmlFor="Login-Email" className="Login-Email-label">
            Email Address:
          </label>
          <input
            type="email"
            name="email"
            onChange={LoginChange}
            className="Login-Email"
            placeholder="Email Address"
            autoComplete="off"
            required
          />
          {Ack ? (
            <span className="Login-Err">{Errmsg.email}</span>
          ) : (
            <span className="Login-Err">{Errmsg.email}</span>
          )}
  
          <label htmlFor="Login-Password" className="Login-Password-label">
            Password:
          </label>
          <input
            type="password"
            name="password"
            onChange={LoginChange}
            className="Login-Password"
            placeholder="Password"
            autoComplete="off"
            aria-required
          />
          {Ack ? (
            <span className="Login-Err">{Errmsg.password}</span>
          ) : (
            <>{Errmsg.password}</>
          )}
  
          <div className="Login-btns">
            <button className="Login-Submitbtn" onClick={ValidateForm}>
              Login
            </button>
          </div>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorText: "white",
              colorSuccess: "white",
              colorError: "white",
            },
            components: { Notification: { zIndexPopup: 99999 } },
          }}
        >
          {contextHolder}
        </ConfigProvider>
      </div>
    );
  };
  export default Login;
  