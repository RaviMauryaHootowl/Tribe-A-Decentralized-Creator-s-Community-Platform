import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import cover from "../../images/cover.png";
import dp from "../../images/dp.png";
import spotify from "../../images/spotify.png";
import youtube from "../../images/youtube.png";
import music from "../../images/musicImage.png";
import Modal from "react-modal";
import { Add, CloseOutlined, UploadFile } from "@mui/icons-material";
import { StoreContext } from "../../utils/Store";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Magic } from "magic-sdk";
import { OAuthExtension } from "@magic-ext/oauth";
import { ethers } from "ethers";
import { ContractABI, ContractAddress } from "../../utils/constants";
import Sidebar from "../../components/Sidebar";

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
    width: ${props => props.percent}%;
    background-color: #1e5ed9;
`;

const FeedContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 1rem 2rem;
`;

const TopFeedActionsContainer = styled.div`
    width: 100%;
    min-height: 3rem;
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
`;

const VoteBarFilled = styled.div`
    height: 8px;
    width: ${props => props.percent}%;
    background-color: green;
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

const CreatorFeed = ({match}) => {
    const params = useParams();
    const { state, dispatch } = useContext(StoreContext);
    const [creatorInfo, setCreatorInfo] = useState({});
    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
        useState(false);
    const [isBecomeMemberModalOpen, setIsBecomeMemberModalOpen] =
        useState(false);
    const [isVoteModalOpen, setIsVoteModalOpen] =
        useState(false);
    const [becomeMemberValue, setBecomeMemberValue] = useState();
    const [isMember, setIsMember] = useState(false);
    const [milestoneInfo, setMilestoneInfo] = useState({});
    const [votingInfo, setVotingInfo] = useState({});

    useEffect(() => {
        console.log(state.user);
    }, [state.user]);

    useEffect(() => {
        console.log(params.id);
        fetchCreatorInfo(params.id);
    }, [params]);

    useEffect(() => {
        console.log(milestoneInfo);
    }, [milestoneInfo])
    
    const fetchCreatorInfo = async (id) => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API}/user/getCreatorInfo?walletAddress=${id}`
            );
            console.log(res.data);
            const memberFind = res.data.members.find(o => o.emailId == state.user.emailId);
            if(memberFind){
                setIsMember(true);
            }else{
                setIsMember(false);
            }
            setCreatorInfo(res.data);
            getMilestoneDetails(res.data.walletAddress);
            getVoteDetails(res.data.walletAddress);
        } catch (err) {
            console.log(err);
            setCreatorInfo({});
        }
    }

    const handleBecomeMember = async () => {
        try{
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
            const options = {value: ethers.utils.parseEther(`${becomeMemberValue}`)}
            resFromSC = await contractInstance.contribute(creatorInfo.walletAddress, options);
    
            console.log(resFromSC);

            const res = await axios.post(
                `${process.env.REACT_APP_API}/user/joinMembership`,
                {
                    emailIdCreator: creatorInfo.emailId,
                    emailId: state.user.emailId
                }
            );
            console.log(res.data);
            closeBecomeMemberModal();
            fetchCreatorInfo(params.id);
            alert("Became member");
        }catch(e){
            console.log(e);
            
        }
        
    }

    const getMilestoneDetails = async (creatorWalletAddress) => {
        try{
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
            resFromSC = await contractInstance.getMilestoneDetails(creatorWalletAddress);

            setMilestoneInfo({
                milestoneNum : resFromSC.milestoneNo.toString(),
                goal: resFromSC.goal.toString(),
                fundsRaised: resFromSC.fundsRaised.toString()
            });
        }catch(e){
            console.log(e);
        }
    }

    const getVoteDetails = async (creatorWalletAddress) => {
        try{
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
            resFromSC = await contractInstance.getVotingStatus(creatorWalletAddress);
            console.log(resFromSC);

            const res = await axios.get(
                `${process.env.REACT_APP_API}/user/getCreatorInfo?walletAddress=${creatorWalletAddress}`
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
                percentUp: (upVoteCount + downVoteCount != 0) ? upVoteCount * 100 / (upVoteCount + downVoteCount) : 0,
                percentDown: (upVoteCount + downVoteCount != 0) ? downVoteCount * 100 / (upVoteCount + downVoteCount) : 0,
                amount: parseInt(resFromSC[4].toString())
            });
            
        }catch(e){
            console.log(e);
            
        }
    }

    useEffect(() => {
        console.log(votingInfo);
    },[votingInfo]);

    const castVote = async (isTrue) => {
        try{
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
            resFromSC = await contractInstance.vote(creatorInfo.walletAddress, isTrue);
            resFromSC = await resFromSC.wait();
            console.log(resFromSC);
            getVoteDetails(creatorInfo.walletAddress);
        }catch(e){
            console.log(e);
            
        }
        
    }

    const closeCreateProjectModal = () => {
        setIsCreateProjectModalOpen(false);
    }

    const openCreateProjectModal = () => {
        setIsCreateProjectModalOpen(true);
    }

    const closeBecomeMemberModal = () => {
        setIsBecomeMemberModalOpen(false);
    }

    const openBecomeMemberModal = () => {
        setIsBecomeMemberModalOpen(true);
    }

    const closeVoteModal = () => {
        setIsVoteModalOpen(false);
    }

    const openVoteModal = () => {
        
        setIsVoteModalOpen(true);
    }


    return (
        <OuterFrameContainer>
            <Modal
                isOpen={isBecomeMemberModalOpen}
                onRequestClose={closeBecomeMemberModal}
                style={createProjectModalStyles}
            >
                <CreateProjModalContainer>
                    <ModalHeader>Become Member</ModalHeader>
                    <TextInputGroup>
                        <span>Number of Crypts?</span>
                        <CustomInput
                            value={becomeMemberValue}
                            onChange={(e) => {setBecomeMemberValue(e.target.value)}}
                            type="number"
                            name=""
                            id=""
                            placeholder="1 Crypt = 10₹"
                        />
                    </TextInputGroup>
                    <CreateProjModalBottom>
                        <BecomeMemberBtn onClick={handleBecomeMember}>Join</BecomeMemberBtn>
                    </CreateProjModalBottom>
                </CreateProjModalContainer>
            </Modal>
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
                                <VoteBarFilled percent={votingInfo.percentUp}></VoteBarFilled>
                            </VoteBarContainer>
                            <VoteBarLabel>No</VoteBarLabel>
                            <VoteBarContainer>
                                <VoteBarFilled percent={votingInfo.percentDown}></VoteBarFilled>
                            </VoteBarContainer>
                        </VoteBarView>
                    </VoteViewContainer>
                    {
                        !votingInfo.hasVoted && <VotingModalActions>
                            <BecomeMemberBtn onClick={() => {castVote(true)}}>Vote Yes</BecomeMemberBtn>
                            <BecomeMemberBtn onClick={() => {castVote(false)}}>Vote No</BecomeMemberBtn>
                        </VotingModalActions>
                    }
                    
                </CreateProjModalContainer>
            </Modal>
            <Modal
                isOpen={isCreateProjectModalOpen}
                onRequestClose={closeCreateProjectModal}
                style={createProjectModalStyles}
            >
                <CreateProjModalContainer>
                    <ModalHeader>Create Project</ModalHeader>
                    <TextInputGroup>
                        <span>Project Name</span>
                        <CustomInput
                            type="text"
                            name=""
                            id=""
                            placeholder="What are you creating?"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Project Description</span>
                        <CustomInput
                            type="text"
                            name=""
                            id=""
                            placeholder="Describe your project mentioning amount breakdown"
                        />
                    </TextInputGroup>
                    <TextInputGroup>
                        <span>Project Cover Image</span>
                        <CustomInput
                            type="text"
                            name=""
                            id=""
                            placeholder=""
                        />
                    </TextInputGroup>
                    <CreateProjModalBottom>
                        <FullFlexDiv>
                            <TextInputGroup>
                                <span>Required Amount</span>
                                <CustomInput
                                    type="text"
                                    name=""
                                    id=""
                                    placeholder="₹"
                                />
                            </TextInputGroup>
                        </FullFlexDiv>
                        <BecomeMemberBtn>Create</BecomeMemberBtn>
                    </CreateProjModalBottom>
                </CreateProjModalContainer>
            </Modal>
            <Sidebar />
            <CreatorPageContainer>
                <CoverImageContainer>
                    <CoverTopActions></CoverTopActions>
                    <CoverCreatorInfoContainer>
                        <ProfilePicContainer>
                            <ProfilePic src={creatorInfo.profilePic} />
                        </ProfilePicContainer>
                        <InfoContainer>
                            <CoverCreatorName>{creatorInfo.fullName}</CoverCreatorName>
                            <CoverStatsContainer>
                                <CoverStat>612 members</CoverStat>
                                <CoverStat>1.5K followers</CoverStat>
                            </CoverStatsContainer>
                        </InfoContainer>
                        {
                            milestoneInfo.goal && <CoverMilestoneStat>
                            <MilestoneMeter>
                                <FilledMeter percent={parseInt(milestoneInfo.fundsRaised) * 100 / parseInt(milestoneInfo.goal)}></FilledMeter>
                            </MilestoneMeter>
                            Milestone: {milestoneInfo.milestoneNum}
                        </CoverMilestoneStat>
                        }
                        
                    </CoverCreatorInfoContainer>
                </CoverImageContainer>
                <FeedContainer>
                    <TopFeedActionsContainer>
                        <BlankSpace></BlankSpace>
                        {
                            isMember ? <></> : 
                            <BecomeMemberBtn onClick={openBecomeMemberModal}>Become a Member</BecomeMemberBtn>
                        }
                        {
                            votingInfo.isLive && <FollowBtn onClick={openVoteModal}>Vote</FollowBtn>
                        }
                        
                    </TopFeedActionsContainer>
                    <FeedSection>
                        <SectionHeader>MY STORY</SectionHeader>
                        <StoryText>
                            {creatorInfo.description}
                        </StoryText>
                    </FeedSection>
                    <FeedSection>
                        <SectionHeader>MY WORK</SectionHeader>
                        <WorkListContainer>
                            <a href={creatorInfo.socialUrl} target="_blank" rel="noopener noreferrer">
                                <WorkCard>
                                    <img src={spotify} alt="" />
                                    Website
                                </WorkCard>
                            </a>
                        </WorkListContainer>
                    </FeedSection>
                    <FeedSection>
                        <SectionHeader>
                            <span>PROJECTS</span>
                            <SectionHeaderActionBtn onClick={openCreateProjectModal}><Add /> Create Project</SectionHeaderActionBtn>
                        </SectionHeader>
                        <WorkListContainer>
                            <ProjectsCard>
                                <img src={music} alt="" />
                                <span>My 9th Single: Untitled</span>
                            </ProjectsCard>
                            <ProjectsCard>
                                <img src={music} alt="" />
                                <span>8th Single: A song</span>
                            </ProjectsCard>
                        </WorkListContainer>
                    </FeedSection>
                </FeedContainer>
            </CreatorPageContainer>
        </OuterFrameContainer>
    );
};

export default CreatorFeed;
