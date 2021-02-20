import React from 'react';
import logo from '../../images/lions_main.png';
import './login.css';
import comm from '../../common';
import { TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import axios from 'axios';
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import {Link, useHistory} from 'react-router-dom';

  
// import { onError } from "@apollo/client/link/error";
// export const LOGIN_ADMIN_MUTATION = gql`
//     mutation loginMutation($loginInput: LoginInput!){
//         login(input: $loginInput){
//             error
//             ok
//             token
//         }
//     }
// `;


const AdminLogin = (props:any) => {
    let id ="";
    let password = "";
    const history = useHistory();

    // const onCompleted = (data : any) => {
    //     console.log("onCompleted >> ", data);
    // };
    // const [loginMutation] = useMutation(LOGIN_ADMIN_MUTATION,{onCompleted});
    // console.log(" loginMutation >> ", loginMutation);

    const onIdInputChange = (ev:any) => {
        console.log(" onChange => ", ev.target.value);
        id = ev.target.value;
    }

    const onPasswordInputChange = (ev:any) => {
        console.log(" onChange => ", ev.target.value);
        password = ev.target.value;
    }

    const submit = () =>{
        // axios.get(comm.SERVER_URL+"/admin/test").then(res => {
        //     console.log(" res => ", res);
        // });
        if(id && password){
            axios.get(comm.SERVER_URL+"/admin", { params:{
                mId:id,
                pass: password,
            }}).then((res)=>{
                console.log(" res >> ", res.data);
                if(res.status === 200){
                    // log in 성공
                    history.push("/adminMain");
                }
            })
        }else{
            alert("아이디 혹은 패쓰워드를 입력해주세요");
        }
    }
 
    return(
        <>
            <div>
                <img className='top' src={logo}  />
            </div>
            <div className='login'>
                <div className='inputArea'>
                    <TextField className='textInput' id="outlined-basic" label="아이디" variant="outlined" onChange={onIdInputChange} />
                    <TextField className='textInput' id="outlined-basic" label="패쓰워드" variant="outlined" type="password" onChange={onPasswordInputChange} />
                </div>
                <div className='blank'></div>
                <div className='wrapperBtn'>
                    <div className='blank2'></div>
                    <Button className='button' variant="contained" color="primary"><span className="btnText" onClick={submit}>로그인</span></Button>
                </div>
            </div>
        </>
    )
}

export default AdminLogin;