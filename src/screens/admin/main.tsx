import React, { useState, useRef, useEffect } from 'react';
import logo from '../../images/lions_logo.png';
import Button from '@material-ui/core/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Icon from '@material-ui/core/Icon';
import PersonAdd from '@material-ui/icons/PersonAdd';
import axios from 'axios';
import comm from '../../common';
import { Link, useHistory } from 'react-router-dom';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddMember from './addMember';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

interface MainPros {
    id: string,
    pass: string,
}

interface userDto {
    id: number;
    name: string;
    position: string;
    startDay: string;
    job: string;
    address: string;
    mobileNum: string;
    phoneNumHome: string;
    phoneNumWork: string;
    email: string;
    belongTo: string;
}

function AdminMain(): any {
    const refJigu = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [jigu, setJigu] = useState(0);
    const [jiyeok, setJiyeok] = useState(0);
    const [jidae, setJidae] = useState(0);
    const [club, setClub] = useState(0);
    const [jiguList, setjiguList] = useState([{ id: 0, name: "지구를 입력하세요" }]);
    const [jiyeokList, setjiyeokList] = useState([]);
    const [jidaeList, setjidaeList] = useState([]);
    const [clubList, setClubList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [member, setMember] = useState(-1);
    
    const history = useHistory();

    useEffect(() => {
        axios.get(comm.SERVER_URL + "/group/jigu").then(res => {
            console.log("jiguRes => ", res.data);
            setjiguList(res.data);
        })

    }, []);

    const handleJiguChange = (ev: any) => {
        let selectedJigu = ev.target.value;
        console.log(" selectedJigu > ", selectedJigu);
        setJigu(ev.target.value);
        setjiyeokList([]);
        axios.get(comm.SERVER_URL + "/group/jiyeok", {
            params: {
                id: selectedJigu
            }
        }).then(res => {
            console.log(" res => ", res.data);
            setjiyeokList(res.data);
        })

    }
    const handleJiyeokChange = (ev: any) => {
        setJiyeok(ev.target.value);
        let selectedJiyeok = ev.target.value;
        setjidaeList([]);

        axios.get(comm.SERVER_URL + "/group/jidae", {
            params: {
                id: selectedJiyeok
            }
        }).then(res => {
            console.log(" res => ", res.data);
            setjidaeList(res.data);
        })
    }

    const handleJidaeChange = (ev: any) => {
        setJidae(ev.target.value);
        let selectedJidae = ev.target.value;
        setClubList([]);

        axios.get(comm.SERVER_URL + "/group/club", {
            params: {
                id: selectedJidae
            }
        }).then(res => {
            console.log(" res => ", res.data);
            setClubList(res.data);
        })

    }

    const getUserList = (clubId:number) => {
        axios.get(comm.SERVER_URL + "/member/club", {
            params: {
                id: clubId
            }
        }).then(res => {
            console.log(" res >> ", res.data);
            setUserList(res.data);
        })
    };

    const handleClubChange = (ev: any) => {
        console.log(" club Id ==> ", ev.target.value);
        setClub(ev.target.value);
        // Fetch Data of designated club members 
        getUserList(ev.target.value);
    }

    const handleClickSelect = (ev: any) => {
        console.log(" ev >>>>> ", ev.target.value);
    }

    const handleDetail = (id:number) => {
        console.log(" id >>>>> ", id);
        setMember(id)
        setOpenModal(true);
    };

    const DeleteWarningSnackBar = () => {
        const handleDeleteMember = () => {
            axios.delete(comm.SERVER_URL + "/member", {
                params: {
                    id: deleteId
                }
            }).then(res => {
                console.log("res => ", res.data);
                getUserList(club);
            });
            setOpen(false);
        };

        const handleClose = () => {
            setOpen(false);
        };

        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    style={{ backgroundColor: '#000000' }}
                    open={open}
                    //   autoHideDuration={6000}
                    onClose={handleClose}
                    message="삭제 진행 버튼을 클릭하시면 해당 회원이 삭제됩니다. 정말로 삭제 하시겠습니까?"
                    action={
                        <div className="flex flex-row justify-start items-center">
                            <Button color="secondary" variant="contained" size="medium" onClick={handleDeleteMember}>
                                삭제 진행
                  </Button>
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                onClick={handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    }
                />
            </div>
        );
    };

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            modal: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            },
            paper: {
                backgroundColor: theme.palette.background.paper,
                border: '2px solid #000',
                boxShadow: theme.shadows[5],
                padding: theme.spacing(2, 4, 3),
            },
        }),
    );

    const TransitionsModal = () => {
        const classes = useStyles();
        // const [openModal, setOpenModal] = useState(false);
        const handleOpen = () => {
            setOpenModal(true);
        };

        const handleClose = () => {
            setOpenModal(false);
        };

        return (
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={openModal}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={openModal}>
                        <div>
                            <AddMember fire={() => {
                                setOpenModal(false) 
                                getUserList(club)
                            }} club={club} memberId={member} />
                        </div>
                    </Fade>
                </Modal>
            </div>
        );
    }

    const getListItem = (listData: Array<userDto>) => {
        if (listData.length === 0) {
            return (<div className="flex flex-col justify-center items-center mt-8"><p className="text-2xl">회원이 없습니다.</p></div>)
        } else {
            return listData.map(each => {
                let id = each.id;
                let nameNPosition = each.name + " / " + each.position;
                let startDay = each.startDay;
                let job = each.job;
                let address = each.address;
                let mobileNum = each.mobileNum;
                mobileNum ="H.P) "+mobileNum.substr(0,3)+"-"+mobileNum.substr(4,4)+"-"+mobileNum.substr(7,4);


                return (
                    <div>
                        <div className="flex flex-row items-center w-full mt-5">
                            <div>
                                <img src={logo} alt="" className="w-20 h-20 ml-5 mr-7" />
                            </div>
                            <div className="flex flex-col" onClick={(ev:any) => handleDetail(id)}>
                                <div className="h-5 w-80">
                                    <span>{nameNPosition}</span>
                                </div>
                                <div className="h-px bg-gray-700 w-36 mt-3"></div>
                                <div className="h-30 bg-blue-100 w-124 mt-3 p-3 rounded-xl">
                                    <p>{startDay} 입회</p>
                                    <p>{job}</p>
                                    <p>{address}</p>
                                    <p>{mobileNum}</p>
                                </div>
                            </div>

                            <div className="mt-2 ml-4">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    onClick={(ev) => {
                                        console.log(" id =>> ", id);
                                        deleteMember(id);
                                    }}
                                >삭제</Button></div>
                        </div>
                        <div className="h-px bg-gray-700 w-full mt-3 mr-3 ml-3"></div>
                    </div>
                )
            })
        }

    }

    const addMember = () => {
        console.log("add Member!");
        setMember(-1);
        if (club !== 0) {
            console.log(" club >>> ", club);
            // history.push("/addMember", { clubId: club });
            setOpenModal(true);
        } else {

        }
    }

    const deleteMember = (id: number) => {
        console.log("delete Member!");
        setOpen(true);
        setDeleteId(id);
    }

    return (
        <div className="flex flex-col ml-5">
            <div id="searchClub"></div>
            <div id="groupArea" className="m-4 flex flex-row">
                <div id="jigu" className="flex flex-col">
                    <span>지구</span>
                    <select className="input mt-2" name="inpJigu" onChange={handleJiguChange} onClick={handleClickSelect}>
                        {
                            jiguList.map((jigu: { id: number, name: string }, idx: number) => {
                                return (<option value={jigu.id}>{jigu.name}</option>)
                            })
                        }
                    </select>
                </div>
                <div id="jiyeok" className="flex flex-col">
                    <span>지역</span>
                    <select className="input mt-2" name="inpJiyeok" onChange={handleJiyeokChange}>
                        {
                            jiyeokList.map((jiyeok: { id: number, name: string }) => {
                                return (<option value={jiyeok.id}>{jiyeok.name}</option>)
                            })
                        }
                    </select>
                </div>
                <div id="jidae" className="flex flex-col">
                    <span>지대</span>
                    <select className="input mt-2" name="inpJidae" onChange={handleJidaeChange}>
                        {
                            jidaeList.map((jidae: { id: number, name: string }) => {
                                return (<option value={jidae.id}>{jidae.name}</option>)
                            })
                        }
                    </select>
                </div>
                <div id="club" className="flex flex-col">
                    <span>클럽</span>
                    <select className="input mt-2" name="inpClub" onChange={handleClubChange}>
                        {
                            clubList.map((club: { id: number, name: string }) => {
                                return (<option value={club.id}>{club.name}</option>)
                            })
                        }
                    </select>
                </div>
            </div>

            <div id="memberList" className="max-w-3xl">
                <div className="flex flex-row justify-between items-center pr-4 pl-4">
                    <span>*회원 리스트</span>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PersonAdd />}
                        className="mr-3"
                        onClick={addMember}
                    >회원 추가</Button>
                </div>
                {getListItem(userList)}
            </div>
            {DeleteWarningSnackBar()}
            {TransitionsModal()}
        </div>
    )
}

export default AdminMain;