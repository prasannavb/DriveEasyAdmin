//CSS
import './Coupon.css'

//Modules
import Navbar from '../Navbar/Navbar'

//React
import { useState ,useRef} from 'react'
import axios from 'axios';


//Antd-Framwork
import {ConfigProvider, notification} from 'antd';


const Coupon=()=>
{

    const [Discount,SetDiscount]=useState('')
    const [api, contextHolder] = notification.useNotification();
    const Dis1=useRef()
    const Dis2=useRef()
    const Dis3=useRef()

    const GenerateCouponCode=async()=>
    {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      var couponCode = '';
      for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        couponCode += characters[randomIndex];
      }
      const {data}=await axios.post('https://drive-easy-admin-server.vercel.app/GenerateCouponCode',{Discount,couponCode})
      if(data.action)
      {
        openNotification(`Coupon generated Successfully ${couponCode}`) 
      }

    }
    const openNotification = (message) => {
        message.includes('Successfully')?( api.success({
          message:message,
          placement:"topRight",
          duration:3,
          style: { 
              background:"#5cb85c	",
            }
        }))
        :(
          api.error({
              message: message,
              placement:"topRight",
              duration:3,
              style: {
                  background:"rgb(223, 67, 67)",
                }
          })
        )
      };

    const FindDiscount=()=>
    {
        if(Discount==='' || Discount===null)
        {
            openNotification('Choose the Discount percentage')
        }
        else
        {
            GenerateCouponCode()
        }
    }
  
    return(
        <>
        <div className='Coupon-Page'>
            <Navbar/>
            <ConfigProvider 
            theme={{
              token: {
              colorText:"white",
              colorSuccess:"white",
              colorError:"white"

            },
            }}>
                {contextHolder}
            </ConfigProvider>
            <div className="Coupon">
                <div className='Coupon-div'>
                <h1>Coupon Codes</h1>

                    <div className="Coupon-Cards">
                        <div ref={Dis1} onClick={()=>{SetDiscount("25"),Dis1.current.style.border='5px solid gold',Dis2.current.style.border="none",Dis3.current.style.border="none"}}><h1>25%</h1></div>
                        <div ref={Dis2} onClick={()=>{SetDiscount("50"),Dis2.current.style.border='5px solid gold',Dis1.current.style.border="none",Dis3.current.style.border="none"}}><h1>50%</h1></div>
                        <div ref={Dis3} onClick={()=>{SetDiscount("75"),Dis3.current.style.border='5px solid gold',Dis1.current.style.border="none",Dis2.current.style.border="none"}}><h1>75%</h1></div>
                    </div>
                    <div className="Coupon-btn">
                        <button onClick={FindDiscount}>Generate Coupons</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Coupon