//React
import { useEffect,useState } from "react";
import axios from "axios";

//Firebase
import {storage} from '../Config/firebase'
import { ref, uploadBytes } from "firebase/storage";

//Modules
import Navbar from "../Navbar/Navbar"

//Antd-Framework
import { ConfigProvider,notification} from 'antd';

//CSS
import './Add.css'



const Add=()=>
{
    const [Fuel,SetFuel]=useState([])
    const [Make,SetMake]=useState([])
    const [Model,SetModel]=useState([])
    const [Type,SetType]=useState([])
    const [FormDetails,SetFormDetails]=useState({Fuel:'',Make:'',Model:'',Type:''})
    const [image,SetImage]=useState()
    const [Filename,SetFilename]=useState('No file chosen')

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message) => {
        {
          message.includes("Added")
            ? api.success({
                message: message,
                placement: "topRight",
                duration: 2,
                style: {
                  background: "#5cb85c	",
                },
              })
            : api.error({
                message: message,
                placement: "topRight",
                duration: 2,
                style: {
                  background: "#E74C3C	",
                },
              });
        }
      };

    const getFiltersMetaData=async()=>
    {
        const {data}=await axios.get('http://localhost:8000/FiltersMetaData')
        SetFuel(data[0].Fuel)
        SetMake(data[0].Make)
        SetModel(data[0].Model)
        SetType(data[0].Type)
    }

    useEffect(()=>{
        getFiltersMetaData()
    },[])

    const AddDetails=async()=>
    {
        if((FormDetails.Fuel!=='' && FormDetails.Fuel!==undefined ) || (FormDetails.Make!=='' && FormDetails.Make!==undefined) || (FormDetails.Model!==undefined && FormDetails.Model!=='') || (FormDetails.Type!==undefined && FormDetails.Type!==''))
        {
            const {data}=await axios.post('http://localhost:8000/UpdateMetaData',{FormDetails,Fuel,Make,Model,Type})
            if(data.action)
            {
                openNotification('Details Added')
                getFiltersMetaData()
            }
        }
        else
        {
            openNotification('Add Details')
        }
    }

    const FormChange=(e)=>
    {
        const {name,value}=e.target
        SetFormDetails((prev)=>{return({...prev,[name]:value.trim()})})
    }

    const UploadExcel=(e)=>
    {
        const selectedFile = e.target.files[0];
        SetImage(selectedFile);
        SetFilename(selectedFile.name)
     }

    const Upload=async()=>
    {
        if(image==='' || image===null || image===undefined)
        {
            openNotification('Choose your file')
        }
        else
        {
            const imgRef = ref(storage, '/MapLocation/' + image.name);
            await uploadBytes(imgRef, image);
            SetImage(null)
            SetFilename('No file chosen')
        }
    } 

    return(
        <>
            <div className="Add-Page">
                <Navbar/>
                <div className="Add">
                    <div className="Add-Whole">
                        <div className="Add-title-div">
                            <h2>Add Extra Details</h2>
                        </div>
                    <div className="Add-Form">
                        <div className="AddCar-div-Fuel">
                                <label className="AddCar-Fuel-label"  htmlFor="AddCar-Fuel">Fuel:</label>
                                <select className="AddCar-Fuel" name="fuel"  autoComplete="off">
                                    <option value="">Fuel</option>
                                    {Fuel.map((data)=>{
                                        return(
                                            <option name="fuel" key={data.id}  value={data.fuel}>{data.fuel}</option>
                                        )
                                    })}
                                </select>
                        </div>
                        
                        <div className="AddCar-div-Make">
                            <label className="AddCar-Make-label" htmlFor="AddCar-Make">Make:</label>
                            <select className="AddCar-Make" name="make"  autoComplete="off">
                                <option value="">Make</option>
                                {Make.map((data)=>{
                                    return(
                                        <option name="make" key={data.id}  value={data.make}>{data.make}</option>
                                    )
                                })}
                            </select>
                        </div>   
                        
                        <div className="AddCar-div-Model">
                            <label className="AddCar-Model-label" htmlFor="AddCar-Model">Model:</label>
                            <select className="AddCar-Model" name="model"  autoComplete="off">
                                <option value="">Model</option>
                                {Model.map((data)=>{
                                    return(
                                        <option name="model" key={data.id}  value={data.model}>{data.model}</option>
                                    )
                                })}
                            </select>
                        </div>
                    
                        <div className="AddCar-div-Type">
                            <label className="AddCar-Type-label" htmlFor="AddCar-Type">Type:</label>
                            <select className="AddCar-Type" name="type"  autoComplete="off">
                                <option value="">Type</option>
                                {Type.map((data)=>{
                                    return(
                                        <option name="type" key={data.id}  value={data.type}>{data.type}</option>
                                    )
                                })}
                            </select>
                        </div>

                    </div>

                    <div className="Add-NewForm">
                        <div className="AddCar-div-2">
                            <div className="AddCar-div">
                                <label className="AddCar-label" htmlFor="AddCar">Fuel:</label>
                                <input type="text" name="Fuel" onChange={FormChange} className="AddCar"  placeholder="Fuel" autoComplete="off" />
                            </div>
    
                            <div className="AddCar-div">
                                <label className="AddCar-label" htmlFor="AddCar">Make:</label>
                                <input type="text" name="Make" onChange={FormChange} className="AddCar"  placeholder="Make" autoComplete="off" />
                            </div>
                        </div>
     
                        <div className="AddCar-div-2">
                            <div className="AddCar-div">
                                <label className="AddCar-label" htmlFor="AddCar">Model:</label>
                                <input type="text" name="Model" onChange={FormChange} className="AddCar"  placeholder="Model" autoComplete="off" />
                            </div>
                                
                            <div className="AddCar-div">
                                <label className="AddCar-label" htmlFor="AddCar">Type:</label>
                                <input type="text" name="Type" onChange={FormChange} className="AddCar"  placeholder="Transmission Type" autoComplete="off" />
                            </div>
                        </div>
                    </div>

                    <div className="Add-title-div">
                        <h1>Service Center </h1>
                    </div>
                    
                    <div className="Add-file-btn">
                        <input type="file" id="actual-btn" accept=".xlsx,.xls" onChange={UploadExcel} hidden/>
                        <label htmlFor="actual-btn" className="actual-btn">Upload Excel</label>
                        <span id="file-chosen">{Filename}</span>
                        <button onClick={Upload}>Upload</button>
                    </div>
                   
                   <div className="Add-btns">
                        <button onClick={AddDetails}>Add</button>
                   </div>
                </div>
                 
                </div>
            
                <ConfigProvider 
                    theme={{
                        token: {
                            colorText:"white",
                            colorSuccess:"white",
                            colorError:"white"
                        },
                        components: {Notification: {zIndexPopup:99999},}
                    }}>
                    {contextHolder}
                </ConfigProvider>
            </div>
        </>
    )
}

export default Add



