import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
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
import {
    Add,
    CloseOutlined,
    PaidRounded,
    PollRounded,
    SendRounded,
    TaskAltRounded,
    UploadFile,
    UploadFileOutlined,
} from "@mui/icons-material";
import { StoreContext } from "../../utils/Store";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { ethers } from "ethers";
import { ContractABI, ContractAddress } from "../../utils/constants";
import Sidebar from "../../components/Sidebar";
import { isValid } from "../../utils/utils";
import axios from "axios";
import { toast } from "react-toastify";
import { CircularProgress, Switch } from "@mui/material";
import WhiteLoader from "../../components/WhiteLoader";
import { useDropzone } from "react-dropzone";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import moment from "moment";

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
        transform: translateY(4px);
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
    align-items: center;
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

const PostTypeSwitchContainer = styled.div`
    display: flex;
    align-items: center;
`;

const CreateProjModalBottom = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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

const VoteViewContainer = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const VoteBarView = styled.div`
    width: 100%;
    display: grid;
    column-gap: 1rem;
    place-items: center;
    grid-template-columns: auto 1fr;
    color: white;
`;

const VoteBarLabel = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
`;

const VoteBarContainer = styled.div`
    height: 8px;
    width: 100%;
    background-color: white;
    border-radius: 50vh;
`;

const VoteBarFilled = styled.div`
    height: 8px;
    width: ${(props) => props.percent}%;
    background-color: #2ecc71;
    border-radius: 50vh;
`;

const VoteBarFilledRed = styled.div`
    height: 8px;
    width: ${(props) => props.percent}%;
    background-color: #e74c3c;
    border-radius: 50vh;
`;

const VotingModalActions = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
`;

const TextViewGroup = styled.div`
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

const TextViewContent = styled.div`
    font: 1.1rem;
`;

const ActionButtonsList = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

const ActionButton = styled.button`
    padding: 1rem 2rem;
    background-color: #ffffff1f;
    border-radius: 8px;
    outline: none;
    border: none;
    color: white;
    font-size: 1.3rem;
    cursor: pointer;
    transition: all 0.5s ease;
    display: flex;
    margin: 0 1rem 1rem 0;
    flex-direction: column;
    align-items: center;
    &:hover{
        background-color: #1E5ED9;
        color: white;
    }
`;

const ActionButtonIcon = styled.div`
    margin-bottom: 0.5rem;
`;

const ChatsWindowOuterContainer = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 2rem;
    overflow-y: hidden;
`;

const ChatsWindow = styled.div`
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 0.5rem;
    background-color: #2f2f2f;
    color: white;
    overflow-y: hidden;
`;

const ChatsWindowHeader = styled.div`
    width: 100%;
    padding: 1rem;
    background-color: #393939;
    display: flex;
    align-items: center;
`;

const ChatWindowHeaderAvatar = styled.img`
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-right: 1rem;
`;

const ChatsListContainer = styled.div`
    width: 100%;
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
`;

const ChatsListContainerScroll = styled.div`
    width: 100%;
`;

const ChatsMessageInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    padding: 1rem;
`;

const ChatMessageInput = styled.input`
    flex: 1;
    font-size: 1.1rem;
    background-color: #393939;
    border: none;
    outline: none;
    padding: 0.6rem 1rem;
    color: white;

`;
const ChatSendBtn = styled.button`
    margin-left: 1rem;
    background-color: #258e25;
    border: none;
    outline: none;
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.5s ease;
    &:hover{
        transform: rotate(-20deg);
    }
    &:active{
        transform: scale(0.9);
    }
`;

const ChatBubbleContainer = styled.div`
    padding: 0.3rem 0rem;
    display: flex;
    justify-content: ${(props) => props.isMe ? "end" : "start"};
`;

const ChatBubble = styled.div`
    max-width: 40%;
    background-color:${(props) => props.isMe ? "#a9ffca" : "#9e9eff"} ;
    color: black;
    border-radius: 1rem;
    padding: 0.5rem 1rem;
`;

const ChatAuthor = styled.div`
    font-size: 0.9rem;
    font-weight: bold;
`;

const ChatTime = styled.div`
    font-size: 0.9rem;
    color: #343434;
    text-align: right;
`;

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: "2px",
    borderRadius: "1rem",
    borderColor: "#E3E3E3",
    backgroundColor: "#4b4b4b56",
    color: "#6e6e6e",
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const Chats = () => {
    const { state, dispatch } = useContext(StoreContext);
    const params = useParams();
    const navigate = useNavigate();
    const [creatorInfo, setCreatorInfo] = useState({});
    const [isMember, setIsMember] = useState(false);
    const [chatBody, setChatBody] = useState("");
    const [chatsList, setChatsList] = useState([]);
    const [requestAmount, setRequestAmount] = useState("");
    const [cdName, setCdName] = useState("");
    const [cdDesc, setCdDesc] = useState("");
    const [cdProfilePicURL, setCdProfilePicURL] = useState("");
    const [cdProfilePicFile, setCdProfilePicFile] = useState(null);
    const [cdSocialURL, setCdSocialURL] = useState("");
    const [cdMilestone, setCdMilestone] = useState("");
    const [cpPic, setCpPic] = useState(null);
    const [cpCaption, setCpCaption] = useState(null);
    const [votingName, setVotingName] = useState("");
    const [votingDesc, setVotingDesc] = useState("");
    const [votingInfo, setVotingInfo] = useState({});
    const [creatorDetailsSaveLoading, setCreatorDetailsSaveLoading] =
        useState(false);
    const [requestFundsLoading, setRequestFundsLoading] = useState(false);
    const [closeVotesLoading, setCloseVotesLoading] = useState(false);
    const [postSaveLoading, setPostSaveLoading] = useState(false);
    const [postType, setPostType] = useState(false);

    useEffect(() => {
        console.log(state.user);
    }, [state.user]);

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
        useState(false);

    const [isCreatorSetupModalOpen, setIsCreatorSetupModalOpen] =
        useState(false);

    const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    const closeVoteModal = () => {
        setIsVoteModalOpen(false);
    };

    const openVoteModal = () => {
        setIsVoteModalOpen(true);
    };

    const closeCreateProjectModal = () => {
        setIsCreateProjectModalOpen(false);
    };

    const openCreateProjectModal = () => {
        setIsCreateProjectModalOpen(true);
    };

    const closeCreatorSetupModal = () => {
        setIsCreatorSetupModalOpen(false);
    };

    const openCreatorSetupModal = () => {
        setIsCreatorSetupModalOpen(true);
    };

    const closeCreatePostModal = () => {
        setIsCreatePostModalOpen(false);
    };

    const openCreatePostModal = () => {
        setIsCreatePostModalOpen(true);
    };

    const onDrop = useCallback(
        (acceptedFiles) => {
            setCdProfilePicFile(acceptedFiles[0]);
            setCpPic(acceptedFiles[0]);
        },
        [cdProfilePicFile, cpPic]
    );

    useEffect(() => {
        console.log(params.id);
        fetchCreatorInfo(params.id);
    }, [params]);

    const fetchCreatorInfo = async (id) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API}/user/getCreatorInfo?walletAddress=${id}`
            );
            console.log(res.data);
            const memberFind = res.data.members.find(
                (o) => o.emailId == state.user.emailId
            );
            if (memberFind) {
                setIsMember(true);
            } else {
                setIsMember(false);
            }
            setCreatorInfo(res.data);
            fetchAllChats(res.data.walletAddress);
            // getMilestoneDetails(res.data.walletAddress);
            // getVoteDetails(res.data.walletAddress);
        } catch (err) {
            console.log(err);
            setCreatorInfo({});
        }
    };

    const getVoteDetails = async () => {
        try {
            const magic = new Magic(
                process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY,
                {
                    network: {
                        rpcUrl: process.env.REACT_APP_RPC_URL,
                        chainId: 80001,
                    },
                    extensions: [new OAuthExtension()],
                }
            );

            console.log(magic);

            const rpcProvider = new ethers.providers.Web3Provider(
                magic.rpcProvider
            );
            const signer = rpcProvider.getSigner();
            const contractInstance = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );
            console.log(contractInstance);

            let resFromSC;
            resFromSC = await contractInstance.getVotingStatus(
                state.user.walletAddress
            );
            console.log(resFromSC);

            const res = await axios.get(
                `${process.env.REACT_APP_API}/user/getCreatorInfo?walletAddress=${state.user.walletAddress}`
            );
            console.log(res.data);
            const upVoteCount = parseInt(resFromSC[2].toString());
            const downVoteCount = parseInt(resFromSC[3].toString());
            setVotingInfo({
                name: res.data.votingName,
                desc: res.data.votingDesc,
                isLive: resFromSC[0],
                hasVoted: resFromSC[5],
                noOfVotes: parseInt(resFromSC[1].toString()),
                upvoteCount: upVoteCount,
                downvoteCount: downVoteCount,
                percentUp:
                    upVoteCount + downVoteCount != 0
                        ? (upVoteCount * 100) / (upVoteCount + downVoteCount)
                        : 0,
                percentDown:
                    upVoteCount + downVoteCount != 0
                        ? (downVoteCount * 100) / (upVoteCount + downVoteCount)
                        : 0,
                amount: parseInt(resFromSC[4].toString()),
            });
        } catch (e) {
            console.log(e);
        }
    };

    const getVotingStatus = async () => {
        const magic = new Magic(
            process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY,
            {
                network: {
                    rpcUrl: process.env.REACT_APP_RPC_URL,
                    chainId: 80001,
                },
                extensions: [new OAuthExtension()],
            }
        );

        console.log(magic);

        const rpcProvider = new ethers.providers.Web3Provider(
            magic.rpcProvider
        );
        const signer = rpcProvider.getSigner();
        const contractInstance = new ethers.Contract(
            ContractAddress,
            ContractABI,
            signer
        );
        console.log(contractInstance);

        let resFromSC;
        resFromSC = await contractInstance.getVotingStatus(
            state.user.walletAddress
        );

        console.log(resFromSC);
    };

    const initiateVotingForRequest = async () => {
        try {
            setRequestFundsLoading(false);
            const magic = new Magic(
                process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY,
                {
                    network: {
                        rpcUrl: process.env.REACT_APP_RPC_URL,
                        chainId: 80001,
                    },
                    extensions: [new OAuthExtension()],
                }
            );

            console.log(magic);

            const rpcProvider = new ethers.providers.Web3Provider(
                magic.rpcProvider
            );
            const signer = rpcProvider.getSigner();
            const contractInstance = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );
            console.log(contractInstance);

            let resFromSC;
            resFromSC = await contractInstance.InitiateVoting(
                ethers.utils.parseEther(`${requestAmount}`)
            );

            console.log(resFromSC);

            const res = await axios.post(
                `${process.env.REACT_APP_API}/user/updateVotingInfo`,
                {
                    emailId: state.user.emailId,
                    votingName,
                    votingDesc,
                }
            );
            console.log(res.data);
            setRequestFundsLoading(false);
            closeCreateProjectModal();
            toast.success("Funds requested! Users can vote now.");
        } catch (e) {
            console.log(e);
            setRequestFundsLoading(false);
            toast.error("Error in requesting funds");
            // alert("Error in requesting funds, mostly due to reqesting more than collected amount!");
        }
    };

    const handleCloseVotes = async () => {
        try {
            setCloseVotesLoading(true);
            const magic = new Magic(
                process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY,
                {
                    network: {
                        rpcUrl: process.env.REACT_APP_RPC_URL,
                        chainId: 80001,
                    },
                    extensions: [new OAuthExtension()],
                }
            );

            console.log(magic);

            const rpcProvider = new ethers.providers.Web3Provider(
                magic.rpcProvider
            );
            const signer = rpcProvider.getSigner();
            const contractInstance = new ethers.Contract(
                ContractAddress,
                ContractABI,
                signer
            );
            console.log(contractInstance);

            let resFromSC;
            resFromSC = await contractInstance.endVoting();
            resFromSC = await resFromSC.wait();

            resFromSC = await contractInstance.claimAmountForCreator();
            resFromSC = await resFromSC.wait();

            console.log(resFromSC);
            setCloseVotesLoading(false);
            toast.success(
                "Voting closed and amount transferred to your wallet"
            );
        } catch (e) {
            console.log(e);
            setCloseVotesLoading(false);
            toast.error("We ran into an error");
        }
    };

    const saveCreatorDetails = async () => {
        if (
            isValid(cdName) &&
            isValid(cdDesc) &&
            cdProfilePicFile != null &&
            isValid(cdSocialURL) &&
            isValid(cdMilestone)
        ) {
            try {
                setCreatorDetailsSaveLoading(true);
                const data = new FormData();
                data.append("image", cdProfilePicFile);
                const imageUploadRes = await axios.post(
                    `${process.env.REACT_APP_API}/uploadImage`,
                    data
                );
                console.log(imageUploadRes);

                
                const milestoneInWei = ethers.utils.parseEther(
                    `${cdMilestone}`
                );

                const magic = new Magic(
                    process.env.REACT_APP_MAGICLINK_PUBLISHABLE_KEY,
                    {
                        network: {
                            rpcUrl: process.env.REACT_APP_RPC_URL,
                            chainId: 80001,
                        },
                        extensions: [new OAuthExtension()],
                    }
                );

                console.log(magic);

                const rpcProvider = new ethers.providers.Web3Provider(
                    magic.rpcProvider
                );
                const signer = rpcProvider.getSigner();
                const contractInstance = new ethers.Contract(
                    ContractAddress,
                    ContractABI,
                    signer
                );
                console.log(contractInstance);

                let resFromSC;
                resFromSC = await contractInstance.setMilestoneGoal(
                    milestoneInWei
                );
                resFromSC = await resFromSC.wait();
                console.log(resFromSC);

                const res = await axios.post(
                    `${process.env.REACT_APP_API}/user/setCreatorInfo`,
                    {
                        emailId: state.user.emailId,
                        name: cdName,
                        description: cdDesc,
                        profilePic: imageUploadRes.data,
                        socialUrl: cdSocialURL,
                    }
                );
                console.log(res.data);
                setCreatorDetailsSaveLoading(false);
                toast.success("Creator details saved! 🥳");
                closeCreatorSetupModal();
            } catch (e) {
                setCreatorDetailsSaveLoading(false);
                toast.error("Failed to save details!");
                console.log(e);
            }
        } else {
            alert("Fill all the details first");
        }
    };

    const savePost = async () => {
        if (isValid(cpCaption) && cpPic != null) {
            try {
                setPostSaveLoading(true);
                const data = new FormData();
                data.append("image", cpPic);
                data.append("walletAddress", state.user.walletAddress);
                data.append("emailId", state.user.emailId);
                data.append("caption", cpCaption);
                data.append("isMemberOnly", postType);

                const postRes = await axios.post(
                    `${process.env.REACT_APP_API}/post/create`,
                    data
                );
                console.log(postRes);

                setPostSaveLoading(false);
                toast.success("Post published! 🥳");
                closeCreatePostModal();
            } catch (e) {
                setPostSaveLoading(false);
                toast.error("Failed to save details!");
                console.log(e);
            }
        } else {
            alert("Fill all the details first");
        }
    };

    const chats = [
        {
        walletAddress: "0x123",
        userName: "raviMaurya",
        chatBody: "Heeeyyyy, this is a test message!",
        time: "4:20 AM"   
    },
        {
        walletAddress: "0x44c346CD856f70c4a3df0A7c23a4C88041CFC61b",
        userName: "pikuuu",
        chatBody: "Hieeeee, howwzzz is you???",
        time: "4:23 AM"
    },
];

const sendMessage = async () => {
    try{
        console.log(chatBody);
        const chatRes = await axios.post(
            `${process.env.REACT_APP_API}/chat/sendChat`,
            {
                chatBody: chatBody,
                walletAddress: state.user.walletAddress,
                userName: state.user.userName,
                creatorWalletAddress: creatorInfo.walletAddress
            }
        );
        setChatBody("");
        console.log(chatRes);
        fetchAllChats(creatorInfo.walletAddress);
    }
    catch (e){
        console.log(e);
    }
}

const fetchAllChats = async (creatorWalletAddress) => {
    try{
        const chatRes = await axios.get(
            `${process.env.REACT_APP_API}/chat/getByCreatorWallet`,
            { params: { walletAddress: creatorWalletAddress } }
        );
        setChatsList(chatRes.data);
    }catch (e){
        console.log(e);
    }
}

    return (
        <OuterFrameContainer>
            <Sidebar />
            <CreatorPageContainer>
                <Navbar title={"CHATS"} />
                <ChatsWindowOuterContainer>
                    <ChatsWindow>
                        <ChatsWindowHeader>
                            <ChatWindowHeaderAvatar src={creatorInfo.profilePic}/>
                            {creatorInfo.fullName}</ChatsWindowHeader>
                        <ChatsListContainer>
                            <ChatsListContainerScroll>

                            {
                                chatsList.map((chat, index) => {
                                return <ChatBubbleContainer key={index} isMe={chat.walletAddress == state.user.walletAddress}>
                                        <ChatBubble isMe={chat.walletAddress == state.user.walletAddress}>
                                            <ChatAuthor>{chat.userName}</ChatAuthor>
                                            {chat.chatBody}
                                            <ChatTime>{moment(chat.createdAt).format("hh:mm A")}</ChatTime>
                                        </ChatBubble>
                                    </ChatBubbleContainer>
                                })
                            }
                            
                            </ChatsListContainerScroll>
                        </ChatsListContainer>
                        <ChatsMessageInputContainer>
                            <ChatMessageInput type="text" value={chatBody} onChange={(e) => {
                                setChatBody(e.target.value);
                            }} placeholder="Type your message here"/>
                            <ChatSendBtn onClick={sendMessage}>
                                <SendRounded style={{color: "white"}}/>
                            </ChatSendBtn>
                        </ChatsMessageInputContainer>
                    </ChatsWindow>
                </ChatsWindowOuterContainer>
                
            </CreatorPageContainer>
        </OuterFrameContainer>
    );
};

export default Chats;
