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
    TaskAltRounded,
    UploadFile,
    UploadFileOutlined,
} from "@mui/icons-material";
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
import { toast } from "react-toastify";
import { CircularProgress, Switch } from "@mui/material";
import WhiteLoader from "../../components/WhiteLoader";
import { useDropzone } from "react-dropzone";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";

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
    &:hover {
        background-color: #1e5ed9;
        color: white;
    }
`;

const ActionButtonIcon = styled.div`
    margin-bottom: 0.5rem;
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

const Dashboard = () => {
    const { state, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();
    const [requestAmount, setRequestAmount] = useState("");
    const [creatorInfo, setCreatorInfo] = useState({});
    const [cdName, setCdName] = useState("");
    const [cdDesc, setCdDesc] = useState("");
    const [cdBenefits, setCdBenefits] = useState("");
    const [cdProfilePicURL, setCdProfilePicURL] = useState("");
    const [cdProfilePicFile, setCdProfilePicFile] = useState(null);
    const [cdSocialURL, setCdSocialURL] = useState("");
    const [cdMilestone, setCdMilestone] = useState("");
    const [cpPic, setCpPic] = useState(null);
    const [cpCaption, setCpCaption] = useState(null);
    const [votingName, setVotingName] = useState("");
    const [votingDesc, setVotingDesc] = useState("");
    const [votingInfo, setVotingInfo] = useState({});
    const [redeemableAmount, setRedeemableAmount] = useState(0);
    const [creatorDetailsSaveLoading, setCreatorDetailsSaveLoading] =
        useState(false);
    const [requestFundsLoading, setRequestFundsLoading] = useState(false);
    const [closeVotesLoading, setCloseVotesLoading] = useState(false);
    const [postSaveLoading, setPostSaveLoading] = useState(false);
    const [postType, setPostType] = useState(false);

    useEffect(() => {
        console.log(state.user);
        if (state.user.walletAddress) {
            fetchCreatorInfo(state.user.walletAddress);
        }
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
        fetchCreatorRedeemableAmount();
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

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop });

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const fetchCreatorInfo = async (id) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API}/user/getCreatorInfo?walletAddress=${id}`
            );
            setCreatorInfo(res.data);
        } catch (err) {
            console.log(err);
            setCreatorInfo({});
        }
    };

    const fetchCreatorRedeemableAmount = async () => {
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
            resFromSC = await contractInstance.viewCreatorInfo(
                state.user.walletAddress
            );
            console.log(resFromSC);
            console.log(parseInt(resFromSC[1].toString()));
            setRedeemableAmount(parseInt(resFromSC[1].toString()));
        } catch (e) {
            console.log(e);
        }
    }

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
            setRequestFundsLoading(true);
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
            isValid(cdBenefits) &&
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
                        benefits: cdBenefits,
                        profilePic: imageUploadRes.data,
                        socialUrl: cdSocialURL,
                    }
                );
                console.log(res.data);
                setCreatorDetailsSaveLoading(false);
                toast.success("Creator details saved! 🥳");
                fetchCreatorInfo();
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

    return (
        <OuterFrameContainer>
            <Modal
                isOpen={isVoteModalOpen}
                onRequestClose={closeVoteModal}
                style={createProjectModalStyles}
            >
                <CreateProjModalContainer>
                    <ModalHeader>Cast Vote</ModalHeader>
                    <VoteViewContainer>
                        <TextViewGroup>
                            <span>Request Name</span>
                            <TextViewContent>{votingInfo.name}</TextViewContent>
                        </TextViewGroup>
                        <TextViewGroup>
                            <span>Request Description</span>
                            <TextViewContent>{votingInfo.desc}</TextViewContent>
                        </TextViewGroup>
                        <VoteBarView>
                            <VoteBarLabel>Yes</VoteBarLabel>
                            <VoteBarContainer>
                                <VoteBarFilled
                                    percent={votingInfo.percentUp}
                                ></VoteBarFilled>
                            </VoteBarContainer>
                            <VoteBarLabel>No</VoteBarLabel>
                            <VoteBarContainer>
                                <VoteBarFilledRed
                                    percent={votingInfo.percentDown}
                                ></VoteBarFilledRed>
                            </VoteBarContainer>
                        </VoteBarView>
                    </VoteViewContainer>
                </CreateProjModalContainer>
            </Modal>
            <Modal
                isOpen={isCreatePostModalOpen}
                onRequestClose={closeCreatePostModal}
                style={createProjectModalStyles}
            >
                <CreateProjModalContainer>
                    <ModalHeader>Create Post</ModalHeader>
                    <TextInputGroup>
                        <span>Post Image</span>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <UploadFileOutlined />
                            <p>
                                {cpPic != null
                                    ? `${cpPic.path.substring(
                                          0,
                                          Math.min(cpPic.path.length, 10)
                                      )}...`
                                    : "Upload image"}
                            </p>
                        </div>
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Caption</span>
                        <CustomInput
                            value={cpCaption}
                            onChange={(e) => {
                                setCpCaption(e.target.value);
                            }}
                            type="text"
                            placeholder="Post Description"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Post Type</span>
                        <PostTypeSwitchContainer>
                            Everyone
                            <Switch
                                checked={postType}
                                onChange={(e) => {
                                    setPostType(e.target.checked);
                                }}
                                inputProps={{ "aria-label": "controlled" }}
                            />
                            Members Only
                        </PostTypeSwitchContainer>
                    </TextInputGroup>

                    <CreateProjModalBottom>
                        <BecomeMemberBtn
                            disabled={postSaveLoading}
                            onClick={savePost}
                        >
                            {!postSaveLoading ? (
                                "Publish"
                            ) : (
                                <WhiteLoader label={"Sending..."} />
                            )}
                        </BecomeMemberBtn>
                    </CreateProjModalBottom>
                </CreateProjModalContainer>
            </Modal>
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
                            onChange={(e) => {
                                setCdName(e.target.value);
                            }}
                            type="text"
                            placeholder="Creator Name"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Your work Description</span>
                        <CustomInput
                            value={cdDesc}
                            onChange={(e) => {
                                setCdDesc(e.target.value);
                            }}
                            type="text"
                            placeholder="Describe your work"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Perks & Benefits</span>
                        <CustomInput
                            value={cdBenefits}
                            onChange={(e) => {
                                setCdBenefits(e.target.value);
                            }}
                            type="text"
                            placeholder="What perks & benefits can you provide?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Profile Picture URL</span>
                        <div {...getRootProps({ style })}>
                            <input {...getInputProps()} />
                            <UploadFileOutlined />
                            <p>
                                {cdProfilePicFile != null
                                    ? `${cdProfilePicFile.path.substring(
                                          0,
                                          Math.min(
                                              cdProfilePicFile.path.length,
                                              10
                                          )
                                      )}...`
                                    : "Upload image"}
                            </p>
                        </div>
                        {/* <CustomInput
                            type="file"
                            onChange={(e) => {
                                setCdProfilePicFile(e.target.files[0]);
                            }}
                        /> */}
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Social Media URL</span>
                        <CustomInput
                            value={cdSocialURL}
                            onChange={(e) => {
                                setCdSocialURL(e.target.value);
                            }}
                            type="text"
                            placeholder="Instagram/YouTube/Spotify"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Milestone Goal (Recommended: 10)</span>
                        <CustomInput
                            value={cdMilestone}
                            onChange={(e) => {
                                setCdMilestone(e.target.value);
                            }}
                            type="text"
                            placeholder="Number of Crypts for Milestone"
                        />
                    </TextInputGroup>
                    <CreateProjModalBottom>
                        <BecomeMemberBtn
                            disabled={creatorDetailsSaveLoading}
                            onClick={saveCreatorDetails}
                        >
                            {!creatorDetailsSaveLoading ? (
                                "Save"
                            ) : (
                                <WhiteLoader label={"Saving..."} />
                            )}
                        </BecomeMemberBtn>
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
                            value={votingName}
                            onChange={(e) => {
                                setVotingName(e.target.value);
                            }}
                            placeholder="What are you creating?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Request Description</span>
                        <CustomInput
                            type="text"
                            value={votingDesc}
                            onChange={(e) => {
                                setVotingDesc(e.target.value);
                            }}
                            placeholder="Describe why you need the funds"
                        />
                    </TextInputGroup>
                    <CreateProjModalBottom>
                        <FullFlexDiv>
                            <TextInputGroup>
                                <span>Required Amount in MATIC</span>
                                <CustomInput
                                    value={requestAmount}
                                    onChange={(e) => {
                                        setRequestAmount(e.target.value);
                                    }}
                                    type="text"
                                    placeholder={`Maximum ${(redeemableAmount/1e18).toFixed(4)} MATIC`}
                                />
                            </TextInputGroup>
                        </FullFlexDiv>
                        <BecomeMemberBtn onClick={initiateVotingForRequest}>
                            {requestFundsLoading ? (
                                <WhiteLoader label={"Requesting..."} />
                            ) : (
                                "Request"
                            )}
                        </BecomeMemberBtn>
                    </CreateProjModalBottom>
                </CreateProjModalContainer>
            </Modal>
            <Sidebar />
            <CreatorPageContainer>
                <Navbar title={"DASHBOARD"} />

                {creatorInfo.profilePic == "" && (
                    <SetupMessageContainer>
                        <SetupMessageBox>
                            <span>
                                Hey there, your first step would be to setup
                                your account with some basic details!
                            </span>
                            <SetupMessageBtn onClick={openCreatorSetupModal}>
                                SETUP
                            </SetupMessageBtn>
                        </SetupMessageBox>
                    </SetupMessageContainer>
                )}

                <FeedContainer>
                    <ActionButtonsList>
                        <ActionButton onClick={openCreatePostModal}>
                            <ActionButtonIcon>
                                <MarkAsUnreadIcon fontSize="large" />
                            </ActionButtonIcon>
                            Create Post
                        </ActionButton>
                        <ActionButton onClick={openCreateProjectModal}>
                            <ActionButtonIcon>
                                <PaidRounded fontSize="large" />
                            </ActionButtonIcon>
                            Request Funds
                        </ActionButton>
                        <ActionButton
                            onClick={() => {
                                getVoteDetails();
                                setIsVoteModalOpen(true);
                            }}
                        >
                            <ActionButtonIcon>
                                <PollRounded fontSize="large" />
                            </ActionButtonIcon>
                            View Votes
                        </ActionButton>
                        <ActionButton onClick={handleCloseVotes}>
                            <ActionButtonIcon>
                                {closeVotesLoading ? (
                                    <WhiteLoader label={"Sending..."} />
                                ) : (
                                    <TaskAltRounded fontSize="large" />
                                )}
                            </ActionButtonIcon>
                            Close Votes & Transfer
                        </ActionButton>
                    </ActionButtonsList>
                </FeedContainer>
            </CreatorPageContainer>
        </OuterFrameContainer>
    );
};

export default Dashboard;
