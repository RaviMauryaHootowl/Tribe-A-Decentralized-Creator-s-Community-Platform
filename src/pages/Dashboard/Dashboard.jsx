import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import logo from "../../images/logo.svg";
import cover from "../../images/cover.png";
import dp from "../../images/dp.png";
import spotify from "../../images/spotify.png";
import youtube from "../../images/youtube.png";
import music from "../../images/musicImage.png";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import Modal from "react-modal";
import { Add, CloseOutlined, UploadFile } from "@mui/icons-material";
import { StoreContext } from "../../utils/Store";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { ethers } from "ethers";
import { ContractABI, ContractAddress } from "../../utils/constants";
import Sidebar from "../../components/Sidebar";
import { isValid } from "../../utils/utils";
import axios from "axios";

const createProjectModalStyles = {
    content: {
        width: "90%",
        maxWidth: "600px",
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        transform: "translate(-50%, -50%)",
        borderRadius: "1rem",
        border: "0",
        backgroundImage: "linear-gradient(to bottom, #242329, #242329)",
    },
    overlay: {
        background: "#000000a6",
        zIndex: 1000,
    },
};

const OuterFrameContainer = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    background-color: #19181d;
    align-items: stretch;
`;

const SideBarMenu = styled.div`
    padding: 2rem;
    width: 400px;
`;

const CreatorPageContainer = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #242329;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const AppLogo = styled.img`
    height: 2.2rem;
    margin: 1rem;
    margin-bottom: 2rem;
`;

const SideOptionCard = styled.div`
    display: flex;
    align-items: center;
    color: #bababa;
    font-size: 1.1rem;
    font-weight: 500;

    border-radius: 8px;
    padding: 0.6rem 1rem;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.5s ease;

    span {
        margin-left: 0.5rem;
    }

    :hover {
        background-color: #383838;
        color: #538bf3;
    }
`;

const CoverImageContainer = styled.div`
    width: 100%;
    height: 250px;
    flex-shrink: 0;
    background-image: url(${cover});
    background-position: center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
`;

const CoverTopActions = styled.div`
    flex: 1;
`;

const CoverCreatorInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`;

const ProfilePicContainer = styled.div`
    position: relative;
    width: 200px;
`;

const ProfilePic = styled.img`
    height: 200px;
    width: 200px;
    border-radius: 50%;
    position: absolute;
    top: -100px;
`;

const InfoContainer = styled.div`
    flex: 1;
    padding-left: 1rem;
    color: white;
    display: flex;
    flex-direction: column;
`;

const CoverCreatorName = styled.div`
    font-weight: bold;
    font-size: 3rem;
`;

const CoverStatsContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;
`;

const CoverStat = styled.div`
    margin-right: 1rem;
    font-size: 1.1rem;
`;

const CoverMilestoneStat = styled.div`
    display: flex;
    flex-direction: column;
    color: white;
    align-items: center;
`;

const MilestoneMeter = styled.div`
    width: 120px;
    height: 5px;
    background-color: white;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    border-radius: 5px;
    overflow: hidden;
`;

const FilledMeter = styled.div`
    width: 70%;
    background-color: #1e5ed9;
`;

const FeedContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
    padding: 1rem 2rem;
`;

const TopFeedActionsContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const BlankSpace = styled.div`
    width: 200px;
`;

const BecomeMemberBtn = styled.button`
    margin-left: 1rem;
    background-color: #2e72f6;
    color: white;
    border: none;
    outline: none;
    border-bottom: #1e5ed9 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    /* margin-top: 2rem; */
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px) rotateZ(2deg);
    }
`;

const FollowBtn = styled.button`
    margin-left: 1rem;
    background-color: #e4e4e4;
    border: none;
    outline: none;
    border-bottom: #8e8e8e 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    /* margin-top: 2rem; */
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px) rotateZ(2deg);
    }
`;

const HomeNavbar = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items:center;
    margin-top: 3rem;
    padding: 0 2rem;
`;

const PageHeader = styled.div`
    font-weight: bold;
    color: #dbdbdb;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const AccountAddress = styled.div`
    font-weight: bold;
    color: #dbdbdb;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const FeedSection = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    color: #828282;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
`;

const SectionHeaderActionBtn = styled.button`
    margin-left: 1rem;
    background-color: #e4e4e4;
    border: none;
    outline: none;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    /* margin-top: 2rem; */
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease;
`;

const StoryText = styled.div`
    color: #d1d1d1;
`;

const WorkListContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const WorkCard = styled.div`
    background-color: #3c3c3c;
    margin-right: 0.8rem;
    color: #dddddd;
    padding: 0.8rem 1rem;
    display: flex;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.5s ease;

    img {
        height: 1.5rem;
        margin-right: 0.8rem;
    }

    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
    }
`;

const ProjectsCard = styled.div`
    background-color: #3c3c3c;
    margin-right: 0.8rem;
    color: #dddddd;
    display: flex;
    align-items: center;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.5s ease;

    img {
        height: 5rem;
    }

    span {
        padding: 0.8rem;
        font-weight: 600;
    }
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
    }
`;

const CreateProjModalContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const ModalHeader = styled.span`
    font-weight: bold;
    color: white;
    font-size: 1.2rem;
    margin-bottom: 1rem;
    text-align: center;
`;

const TextInputGroup = styled.div`
    background-color: #161616;
    color: white;
    border-radius: 6px;
    border: none;
    outline: none;
    padding: 0.8rem 1rem;
    font-size: 1rem;
    margin-bottom: 0.5rem;
    flex-direction: column;
    display: flex;

    span {
        font-size: 0.9rem;
        font-weight: bold;
        margin-bottom: 0.6rem;
        color: #c1c1c1;
    }
`;

const CustomInput = styled.input`
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 1.1rem;
`;

const CreateProjModalBottom = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
`;

const FullFlexDiv = styled.div`
    flex: 1;
`;

const SetupMessageContainer = styled.div`
    width: 100%;
    padding: 0 2rem;
    margin-top: 1rem;
`;

const SetupMessageBox = styled.div`
    width: 100%;
    border-radius: 8px;
    background-color: #3a3a3a;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SetupMessageBtn = styled.button`
    margin-left: 1rem;
    background-color: #2e72f6;
    color: white;
    border: none;
    outline: none;
    border-bottom: #1e5ed9 6px solid;
    padding: 0.8rem 2rem;
    border-radius: 0.5rem;
    font-size: 1.1rem;
    /* margin-top: 2rem; */
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover {
        transform: translateY(-2px);
    }
    &:active {
        transition: all 0.1s ease;
        transform: translateY(4px);
    }
`;

const Dashboard = () => {
    const { state, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();
    const [requestAmount, setRequestAmount] = useState("");
    const [cdName, setCdName] = useState("");
    const [cdDesc, setCdDesc] = useState("");
    const [cdProfilePicURL, setCdProfilePicURL] = useState("");
    const [cdSocialURL, setCdSocialURL] = useState("");
    const [cdMilestone, setCdMilestone] = useState("");

    useEffect(() => {
        console.log(state.user);
    }, [state.user]);

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
        useState(false);

    const [isCreatorSetupModalOpen, setIsCreatorSetupModalOpen] =
        useState(false);

    const closeCreateProjectModal = () => {
        setIsCreateProjectModalOpen(false);
    }

    const openCreateProjectModal = () => {
        setIsCreateProjectModalOpen(true);
    }

    const closeCreatorSetupModal = () => {
        setIsCreatorSetupModalOpen(false);
    }

    const openCreatorSetupModal = () => {
        setIsCreatorSetupModalOpen(true);
    }

    const getVotingStatus = async () => {
        const magic = new Magic(process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY, {
            network: {
              rpcUrl: process.env.REACT_APP_RPC_URL,
              chainId: 80001
            },
            extensions: [new OAuthExtension()],
        });

        console.log(magic);
    
        const rpcProvider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = rpcProvider.getSigner();
        const contractInstance = new ethers.Contract(
            ContractAddress,
            ContractABI,
            signer
        );
        console.log(contractInstance);

        let resFromSC;
        resFromSC = await contractInstance.getVotingStatus(state.user.walletAddress);

        console.log(resFromSC);
    }

    const initiateVotingForRequest = async () => {
        const magic = new Magic(process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY, {
            network: {
              rpcUrl: process.env.REACT_APP_RPC_URL,
              chainId: 80001
            },
            extensions: [new OAuthExtension()],
        });

        console.log(magic);
    
        const rpcProvider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = rpcProvider.getSigner();
        const contractInstance = new ethers.Contract(
            ContractAddress,
            ContractABI,
            signer
        );
        console.log(contractInstance);

        let resFromSC;
        resFromSC = await contractInstance.InitiateVoting(ethers.utils.parseEther(`${requestAmount}`));

        console.log(resFromSC);
    }

    const handleCloseVotes = async () => {
        const magic = new Magic(process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY, {
            network: {
              rpcUrl: process.env.REACT_APP_RPC_URL,
              chainId: 80001
            },
            extensions: [new OAuthExtension()],
        });

        console.log(magic);
    
        const rpcProvider = new ethers.providers.Web3Provider(magic.rpcProvider);
        const signer = rpcProvider.getSigner();
        const contractInstance = new ethers.Contract(
            ContractAddress,
            ContractABI,
            signer
        );
        console.log(contractInstance);

        let resFromSC;
        resFromSC = await contractInstance.getMyVotingVentureResult();
        resFromSC = await resFromSC.wait();

        resFromSC = await contractInstance.claimAmountForCreator();
        resFromSC = await resFromSC.wait();

        console.log(resFromSC);
    }

    const saveCreatorDetails = async () => {
        if(isValid(cdName) && isValid(cdDesc) && isValid(cdProfilePicURL) && isValid(cdSocialURL) && isValid(cdMilestone)){
            const res = await axios.post(
                `${process.env.REACT_APP_API}/user/setCreatorInfo`,
                {
                    emailId: state.user.emailId,
                    name: cdName,
                    description: cdDesc,
                    profilePic: cdProfilePicURL,
                    socialUrl: cdSocialURL
                }
            );
            console.log(res.data);
        }else{
            alert("Fill all the details first");
        }
    }

    return (
        <OuterFrameContainer>
            <Modal
                isOpen={isCreatorSetupModalOpen}
                onRequestClose={closeCreatorSetupModal}
                style={createProjectModalStyles}
            >
                <CreateProjModalContainer>
                    <ModalHeader>Creator Setup</ModalHeader>
                    <TextInputGroup>
                        <span>Your Name</span>
                        <CustomInput
                            value={cdName}
                            onChange={(e) => {setCdName(e.target.value)}}
                            type="text"
                            placeholder="Creator Name"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Your work Description</span>
                        <CustomInput
                            value={cdDesc}
                            onChange={(e) => {setCdDesc(e.target.value)}}
                            type="text"
                            placeholder="Describe your work"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Profile Picture URL</span>
                        <CustomInput
                            value={cdProfilePicURL}
                            onChange={(e) => {setCdProfilePicURL(e.target.value)}}
                            type="text"
                            placeholder="www.asdf.com/imageurl"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Social Media URL</span>
                        <CustomInput
                            value={cdSocialURL}
                            onChange={(e) => {setCdSocialURL(e.target.value)}}
                            type="text"
                            placeholder="Instagram/YouTube/Spotify"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Milestone Goal (Recommended: 100)</span>
                        <CustomInput
                            value={cdMilestone}
                            onChange={(e) => {setCdMilestone(e.target.value)}}
                            type="number"
                            placeholder="Number of Crypts for Milestone"
                        />
                    </TextInputGroup>
                    <CreateProjModalBottom>
                        <BecomeMemberBtn onClick={saveCreatorDetails}>Save</BecomeMemberBtn>
                    </CreateProjModalBottom>
                </CreateProjModalContainer>
            </Modal>
            <Modal
                isOpen={isCreateProjectModalOpen}
                onRequestClose={closeCreateProjectModal}
                style={createProjectModalStyles}
            >
                <CreateProjModalContainer>
                    <ModalHeader>Request Funds</ModalHeader>
                    <TextInputGroup>
                        <span>Request Name</span>
                        <CustomInput
                            type="text"
                            name=""
                            id=""
                            placeholder="What are you creating?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Request Description</span>
                        <CustomInput
                            type="text"
                            name=""
                            id=""
                            placeholder="Describe your project mentioning amount breakdown"
                        />
                    </TextInputGroup>
                    <CreateProjModalBottom>
                        <FullFlexDiv>
                            <TextInputGroup>
                                <span>Required Amount in MATIC</span>
                                <CustomInput
                                    value={requestAmount}
                                    onChange={(e)=>{setRequestAmount(e.target.value)}}
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="₹"
                                />
                            </TextInputGroup>
                        </FullFlexDiv>
                        <BecomeMemberBtn onClick={initiateVotingForRequest}>Request</BecomeMemberBtn>
                    </CreateProjModalBottom>
                </CreateProjModalContainer>
            </Modal>
            <Sidebar />
            <CreatorPageContainer>
                <Navbar title={"DASHBOARD"} />

                <SetupMessageContainer>
                    <SetupMessageBox>
                        <span>
                            Hey there, your first step would be to setup your account with some basic details!
                        </span>
                        <SetupMessageBtn onClick={openCreatorSetupModal}>SETUP</SetupMessageBtn>
                    </SetupMessageBox>
                </SetupMessageContainer>
                <FeedContainer>


                    
                    <BecomeMemberBtn onClick={getVotingStatus}>View Votes</BecomeMemberBtn>
                    <BecomeMemberBtn onClick={openCreateProjectModal}>Request Funds</BecomeMemberBtn>
                    <BecomeMemberBtn onClick={handleCloseVotes}>Close Votes & Transfer</BecomeMemberBtn>
                    
                </FeedContainer>
            </CreatorPageContainer>
        </OuterFrameContainer>
    );
};

export default Dashboard;
