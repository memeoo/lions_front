import React, { useRef, useState, useEffect } from 'react';
import logo from '../../images/lions_logo.png';
import { Img } from 'react-image'
import { useForm } from "react-hook-form";
import comm from '../../common';
import axios from 'axios';
import {Location} from 'history';
import { useHistory, useLocation } from 'react-router-dom';

interface ChildProps {
    fire: () => void,
    club: number,
    memberId: number,
 }

const AddMember : React.FC<ChildProps> = (props :ChildProps) => {
    const { register, handleSubmit, watch, errors, getValues, setValue } = useForm();
    const picUpload = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [position, setPosition] = useState("회원");
    const [memberImg, setMemberImg] = useState(logo);
    const location = useLocation<Location>();
    // const state : any = location.state;
    // console.log(" state.clubId => ", state.clubId);

    console.log(" props => ", props);
    
    useEffect(() => {
        // props.memberId
        axios.get(comm.SERVER_URL + "/member/",{
            params:{
                id: props.memberId
            }
        }).then(res => {
            console.log(" res >> ", res.data);
            setValue("inputName", res.data.name);
            setValue("inputPosition", res.data.position);
            setValue("inputMemberDate", res.data.startDay);
            setValue("inputJob", res.data.job);
            setValue("inputAddress", res.data.address);
            setValue("inputMobile", res.data.mobileNum);
            setValue("inputHome", res.data.phoneNumHome);
            setValue("inputBusiness", res.data.phoneNumWork);
            setValue("inputEmail", res.data.email);
            if(props.memberId !== -1){
                const imgUrl = `https://clublions.s3.ap-northeast-2.amazonaws.com/${res.data.imgName}`;
                if(res.data.imgName){
                    setMemberImg(imgUrl);
                }else{
                    setMemberImg(logo);
                }
            }

        })

    },[]);

    const onSubmit = (data: any) => {
        const {inputPic, inputName, inputPosition, inputMemberDate, inputJob, inputAddress, inputMobile, inputHome, inputBusiness,  inputEmail} = getValues();    
        console.log(" inputPic => ", inputPic);
        let imgName = inputPic[0].lastModified + inputPic[0].name;
        console.log(" imgName => ", imgName);
        let dtoObj = {
            name: inputName,
            position: inputPosition, 
            startDay: inputMemberDate,
            job:inputJob,
            address:inputAddress,
            mobileNum:inputMobile,
            phoneNumHome:inputHome,
            phoneNumWork:inputBusiness,
            email: inputEmail,
            belongTo: props.club,
            imgName: imgName
        }

        if(props.memberId === -1){
            //  AddMember
            axios.post(comm.SERVER_URL+"/member", dtoObj).then((res)=>{
                console.log(" add res >> ", res.data);
    
                if(res.data.ok){
                    console.log(" Adding member to DB success !!");
                    uploadProfilePic(inputPic, imgName);
                }
            });
        }else{
            //  updateMember
            let dtoObj = {
                id: props.memberId,
                name: inputName,
                position: inputPosition, 
                startDay: inputMemberDate,
                job:inputJob,
                address:inputAddress,
                mobileNum:inputMobile,
                phoneNumHome:inputHome,
                phoneNumWork:inputBusiness,
                email: inputEmail,
                belongTo: props.club,
                imgName: imgName
            }
            axios.put(comm.SERVER_URL+"/member", dtoObj).then((res)=>{
                console.log(" update res >> ", res.data);
    
                if(res.data.ok){
                    console.log(" Modify member to DB success !!");
                    uploadProfilePic(inputPic, imgName);
                }
            });
        }
    };

    const uploadProfilePic = (inputPic : Array<any>, imgName:string) => {
        const actualFile = inputPic[0];
        const formBody = new FormData();
        formBody.append("file", actualFile);
        formBody.append("imgName", imgName);

        axios.post(comm.SERVER_URL+"/member/upload",formBody).then((imgUpRes)=> {
            console.log(" Adding member to DB success !! => ", imgUpRes);
            if(imgUpRes){
                console.log(" data.ok !! => ", imgUpRes.data.url);
            }
        })     
        // log in 성공
        // history.push("/adminMain");
        props.fire();
    }

    const handlePositionChange = (ev: any) => {
        setPosition(ev.target.value);
    }

    const handleFileInputChange = (ev:any) => {
        let imageFile = ev.target.files[0];
  
        console.log(" file >>> " , URL.createObjectURL(imageFile));
        setMemberImg(URL.createObjectURL(imageFile));
    }

    const handleOnBeforeInput = (ev:any) => {
        console.log("handleOnBeforeInput");
    }

    const fileInputStyle = {
        width:'90px'
    }
 
    const url = comm.SERVER_URL + 'member';
    return (
            <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 border-gray-800 border-2 bg-white">
                <div className="flex m-8 flex-row">
                    <div className="w- flex flex-col mr-10">  
                        <div className="flex flex-row items-center w-62 justify-between">
                            <span className="w-16">사진</span>
                            <input type="file" ref={register} name="inputPic" id="inputPic" accept="image/*" style={fileInputStyle} onChange={handleFileInputChange} onSelect={handleOnBeforeInput} />
                        </div>
                        {/* <Img src={memberImg} className="w-64 h-64 mt-5"/> */}
                        <img src={memberImg} className="w-64 h-64 mt-5"/>
                    </div>

                    <div className="w-240">
                        <div className="flex flex-row items-center">
                            <div className="flex flex-col w-1/2">
                                <span>이름</span>
                                <input type="text" name="inputName" className="input mt-2" ref={register} required />
                            </div>
                            <div className="flex flex-col ml-8 w-1/2">
                                <span>직책</span>
                                <select value={position} className="input mt-2" name="inputPosition" onChange={handlePositionChange} ref={register}>
                                    <option value="회장">회장</option>
                                    <option value="제1부 회장">제1부 회장</option>
                                    <option value="제2부 회장">제2부 회장</option>
                                    <option value="이사">이사</option>
                                    <option value="회원">회원</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-row items-center mt-6">
                            <div className="flex flex-col w-42 w-1/2">
                                <span>입회일</span>
                                <input type="date" name="inputMemberDate" className="input mt-2" ref={register} required/>
                            </div>
                            <div className="flex flex-col ml-8 w-1/2">
                                <span>직업</span>
                                <input type="text" name="inputJob" className="input mt-2" ref={register} />
                            </div>
                        </div>
                        <div className="flex flex-row items-center mt-6">
                            <div className="flex flex-col w-full">
                                <span>주소</span>
                                <input type="text" name="inputAddress" className="input mt-2 w-128" ref={register} />
                            </div>
                        </div>

                        <div className="mt-8">연락처</div>
                        <div className="flex flex-row items-center mt-3">
                            <span className="w-20">핸드폰</span>
                            <input type="text" name="inputMobile" className="input ml-3" ref={register} required />
                            <span className="w-20 ml-5">자택</span>
                            <input type="text" name="inputHome" className="input ml-3" ref={register} />
                        </div>
                        <div className="flex flex-row items-center mt-3">
                            <span className="w-20">사업장</span>
                            <input type="text" name="inputBusiness" className="input ml-3" ref={register} />
                            <span className="w-20 ml-5">이메일</span>
                            <input type="text" name="inputEmail" className="input ml-3" ref={register} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-row justify-center items-center h-32">
                    <button type="submit" className="mr-8 rounded-xl border-blue-600 border-solid border-2 border-opacity-60 w-48 h-16 hover:bg-blue-200">{props.memberId === -1 ? "회원 추가" : "회원 수정" }</button>
                    <button type="button" className="ml-8 rounded-xl border-blue-600 border-solid border-2 border-opacity-60 w-48 h-16 hover:bg-red-200" onClick={props.fire}>취소</button>
                </div>
            </form>
    )
}

export default AddMember;