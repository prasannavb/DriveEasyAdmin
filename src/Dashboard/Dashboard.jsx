//React
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

//Antd-Framework
import {EnvironmentOutlined,CarOutlined,CheckOutlined,CloseOutlined,ArrowUpOutlined,CheckSquareOutlined,CloseSquareOutlined,BookOutlined} from '@ant-design/icons'
import { Empty,Modal,ConfigProvider,Select ,notification} from 'antd';

//CustomSVGIcons
import { FuelIcon,GearIcon } from "../SVGIcons/SvgComponent";

//CSS
import './Dashboard.css'

//Modules
import Navbar from '../Navbar/Navbar'

//firebase
import {storage} from '../Config/firebase'
import { getDownloadURL,ref,listAll,deleteObject} from 'firebase/storage'

const Dashboard=()=>
{

  const [loading,Setloading]=useState(true)
  const [CardCount,SetCardCount]=useState({total:0,verified:0,unverified:0,Bookings:0})
  const [ListofCars,SetListofCars]=useState([])
  const [isArray,SetisArray]=useState(false)
  const [Insurance,SetInsurance]=useState(false)
  const [RCBook,SetRCBook]=useState(false)
  const [ReasonPrompt,SetReasonPrompt]=useState(false)
  const [singlecar,SetSingleCar]=useState({car_no:'',sid:''})
  const [image,SetImage]=useState()
  const [Reason,SetReason]=useState('')
  const [api, contextHolder] = notification.useNotification();

  const Navigate=useNavigate()

  const RejectReasons = [
    {
      value: 'Improper Format of RC Book',
      label: 'Improper Format of RC Book',
    },
    {
      value: 'Improper Format of Insurance Documentation',
      label: 'Improper Format of Insurance Documentation',
    },
    {
      value: 'High Price',
      label: 'High Price',
    },
    {
      value: 'False Details',
      label: 'False Details',
    },
    {
      value: 'Incomplete or Inconsistent Information',
      label: 'Incomplete or Inconsistent Information',
    },
  ];

  const openNotification = (message) => {
    message.includes('Approved')?( api.success({
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

  const getCarDetails=async()=>
  {
    const {data}=await axios.get('https://drive-easy-admin-server.vercel.app/Dashboard')
    if(data.length>0)
    {
      SetisArray(false)
      SetListofCars(data)
    }
    else
    {
      SetisArray(true)
    }
    Setloading(false)
  }

  const getCardCount=async()=>
  {
    const {data}=await axios.get('https://drive-easy-admin-server.vercel.app/ActiveCount')
    SetCardCount(data)
  }
  
  const ShowInsurance=async(car_no,sid)=>
  {
    let imgref=ref(storage,`/CarImages/${sid}/${car_no}/Insurance`)
    const imgdata=await getDownloadURL(imgref)
    SetImage(imgdata)
    SetInsurance(true)
  }

  const ShowRCBook=async(car_no,sid)=>
  {
    let imgref=ref(storage,`/CarImages/${sid}/${car_no}/Insurance`)
    const imgdata=await getDownloadURL(imgref)
    SetImage(imgdata)
    SetRCBook(true)
  }

  const Approve=async(car_no,sid)=>
  {
    const {data}=await axios.post('https://drive-easy-admin-server.vercel.app/VerifyCar',{car_no,sid})
    if(data.action)
    {
      openNotification('The car has been Approved')
      setTimeout(() => {getCarDetails()}, 2000);
    }
  }
  
  async function deleteFolderContents(folderRef) {
    try {
        const folderRes = await listAll(folderRef);
        folderRes.items.forEach((itemRef) => {
            deleteObject(itemRef).then(() => {
            }).catch((error) => {
                console.error('Error deleting item:', itemRef.fullPath, error);
            });
        });
        folderRes.prefixes.forEach((prefixRef) => {
            deleteFolderContents(prefixRef);
        });
    } catch (error) {
        console.error("Error deleting folder contents:", error);
    }
}

  
  const Decline=async()=>
  {
    if(Reason!=='' && Reason!==null && Reason!==undefined)
    {
      const {data}=await axios.post('https://drive-easy-admin-server.vercel.app/DeleteCar',{singlecar,Reason})
      if(data.action)
      {
        SetReasonPrompt(false)
        Setloading(true)
        getCarDetails()

       const folderRef = ref(storage,`/CarImages/${singlecar.sid}/${singlecar.car_no}`);
       listAll(folderRef)
       .then((res) => {
         res.items.forEach((itemRef) => {
           deleteObject(itemRef).then(() => {
             }).catch((error) => {
               console.error('Error deleting item:', itemRef.fullPath, error);
             });
         });
         res.prefixes.forEach((prefixRef) => {
       deleteFolderContents(prefixRef);
   });
   })
   .catch((error) => {
   console.error('Error listing items:', error);
   });
      }
    }    
    else
    {
      openNotification('Choose the Reason')
    }
  }

  const ReasonChange=(value)=>
  {
    SetReason(value)
  }

  useEffect(()=>{
    if(sessionStorage.getItem('userAuth'))
    {
      getCarDetails()
      getCardCount()
    }
    else
    {
      Navigate('/')
    }
  },[])

  if(loading)
  {
    return <h2>Loading</h2>
  }
  
  return(
    <div className='Dashboard-Page'>
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

      <ConfigProvider
        theme={{
        token: {
        colorBgMask:"rgba(0, 0, 0, 0.80)"	,
        zIndexPopupBase:"9999",
        colorIcon:"white",
        colorIconHover:"white",
        padding:0,
        paddingLG:0,
        paddingContentHorizontalLG: 0,
        paddingMD:0,
        paddingSM:0,
        paddingXL:0,
        },
        }}
      >            
        <Modal  footer={null} width={750} centered open={Insurance}  onOk={()=>{SetInsurance(false)}} onCancel={()=>{SetInsurance(false)}}>
          <img src={image} alt="InsuranceImage"  className='ModalInsurance'/>
        </Modal>
          
        <Modal  footer={null} width={750} centered open={RCBook}  onOk={()=>{SetRCBook(false)}} onCancel={()=>{SetRCBook(false)}}>
          <img src={image} alt="RCBookImage"  className='ModalRCBook'/>
        </Modal>  
      </ConfigProvider>
            
      <Modal  width={750} centered open={ReasonPrompt} okText="Reject" cancelText="Back to Safety"  onOk={()=>{Decline()}} onCancel={()=>{SetReasonPrompt(false),SetSingleCar({car_no:'',sid:''})}}
        okButtonProps={{
          style: {
          color: 'white',
          backgroundColor: '#E74C3C',
          },
          }}
        cancelButtonProps={{
            style: {
                color: 'white',
                backgroundColor: '#333',
            },
        }}
      >
        <div className="ModalReason-title">
          <h2>Reject the Car!!</h2>
        </div>
                    
        <div className='ModalReason'>
          <q>Warning: This action is irreversible. Once rejected, it cannot be undone.</q><br/>
          <div>
            <b>Reason:</b>
            <Select 
              placeholder="Choose your option"
              options={RejectReasons}
              onChange={ReasonChange}
            />    
          </div>
        </div>
      </Modal>

      <div className="Dashboard">
        <div className="Dashboard-TopCardDeck">
          <div className="Dashboard-Top" id='Dashboard-Top-1'>
            <div className="Dashboard-Top-title">
            <BookOutlined  style={{marginLeft:'10%',marginRight:'5%',fontSize:'25px'}}/>
              <h3>Total Cars</h3>
            </div>
        
            <div className="Dashboard-Top-info">
              <h2>{CardCount.total}</h2>
              <ArrowUpOutlined style={{fontSize:'30px',color:'#3f8600'}} />
            </div>
          </div>
           
          <div className="Dashboard-Top" id='Dashboard-Top-2'>
            <div className="Dashboard-Top-title">
              <CheckSquareOutlined  style={{marginLeft:'10%',marginRight:'5%',fontSize:'25px'}}/>
              <h3>Verfied Cars</h3>
            </div>
            
            <div className="Dashboard-Top-info">
              <h2>{CardCount.verified}</h2>
              <ArrowUpOutlined style={{fontSize:'30px',color:'#3f8600'}} />
            </div>
          </div>
          
          <div className="Dashboard-Top" id='Dashboard-Top-4'>
            <div className="Dashboard-Top-title">
              <CloseSquareOutlined style={{marginLeft:'10%',marginRight:'5%',fontSize:'25px'}}/>
              <h3>Unverified Cars</h3>
            </div>
              
            <div className="Dashboard-Top-info">
              <h2>{CardCount.unverified}</h2>
              <ArrowUpOutlined style={{fontSize:'30px',color:'#3f8600'}} />
            </div>
          </div>

            <div className="Dashboard-Top" id='Dashboard-Top-3'>
              <div className="Dashboard-Top-title">
                <CarOutlined style={{marginLeft:'10%',marginRight:'5%',fontSize:'25px'}}/>
                <h3>Bookings</h3>
              </div>
              
              <div className="Dashboard-Top-info">
                <h2>{CardCount.Bookings}</h2>
                <ArrowUpOutlined style={{fontSize:'30px',color:'#3f8600'}} />
              </div>
            </div>
            
        </div>

        {isArray?(
          <div className='Dashboard-Empty'>
            <Empty />
          </div>
        ):(
        <div className='Dashboard-CardDeck'>
          {ListofCars.map((data)=>{
              return(
              <div key={data._id} className="Dashboard-Card">
                <div className="Dashboard-Details">
                  <div className="Dashboard-Img">
                    <img className="Dashboard-CarImg" src={data.cardetails.img} alt="CarImage" />
                  </div>
            
                <div className="Dashboard-CarDetails">
                  <div className="Dashboard-CarDetails-Name">
                    <h2>{data.cardetails.make} {data.cardetails.name} {data.cardetails.year}</h2>
                  </div>
                
                  <div className="Dashboard-CarDetails-Type">
                    <b><FuelIcon width='22px' height='22px' style={{ marginRight: '5px' }} /> Fuel: <span>{data.cardetails.fuel}</span></b>
                    <b><CarOutlined style={{fontSize:'22px',marginRight:'4%'}} /> Model: <span>{data.cardetails.model}</span></b>
                    <b><GearIcon width='20px' height='20px' style={{ marginRight: '5px' }}/> Type: <span>{data.cardetails.type}</span></b>
                  </div>
           
                  <div className="Dashboard-CarDetails-Primary">
                    <b>Vehicle Number: <span>{data.cardetails.car_no}</span></b>
                    <b><EnvironmentOutlined style={{fontSize:'20px',marginRight:'2%'}}/> Location: <span>{data.cardetails.location}</span> </b>
                    <b>Price:<span> &#x20B9;{data.cardetails.price}</span></b>
                  </div>

                  <div className="Dashboard-CarDetails-Host">
                    <b>Host Details:</b>
                  </div>
                
                  <div className="Dashboard-CarDetails-HostDetails">
                    <b>Name: <span>{data.sellerdetails.name}</span></b>
                    <b>Contact No: <span>{data.sellerdetails.phone}</span></b>
                  </div>

                  <div className="Dashboard-CarDetails-btns">
                    <button className='Dashboard-CarDetails-Viewbtn' onClick={()=>{ShowInsurance(data.cardetails.car_no,data.sellerdetails.sid)}} >View Insurance</button>
                    <button className='Dashboard-CarDetails-Viewbtn' onClick={()=>{ShowRCBook(data.cardetails.car_no,data.sellerdetails.sid)}} >View RCBook</button>
                    <button className='Dashboard-CarDetails-Tickbtn'   onClick={()=>{Approve(data.cardetails.car_no,data.sellerdetails.sid)}} ><CheckOutlined /></button>
                    <button className='Dashboard-CarDetails-Cancelbtn' onClick={()=>{SetReasonPrompt(true),SetSingleCar({car_no:data.cardetails.car_no,sid:data.sellerdetails.sid})}} ><CloseOutlined /></button>
                  </div>
              </div>
      </div>
  </div>
  )
  })}
</div>
)}
  </div>
</div>
)
}

export default Dashboard;

