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

const CreatorFeed = () => {
    const { state, dispatch } = useContext(StoreContext);

    useEffect(() => {
        console.log(state.user);
    }, [state.user]);

    const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] =
        useState(false);

    const closeCreateProjectModal = () => {
        setIsCreateProjectModalOpen(false);
    }

    const openCreateProjectModal = () => {
        setIsCreateProjectModalOpen(true);
    }

    return (
        <OuterFrameContainer>
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
            <SideBarMenu>
                <AppLogo src={logo} />
                <SideOptionCard>
                    <HomeRoundedIcon />
                    <span>Home</span>
                </SideOptionCard>
                <SideOptionCard>
                    <TravelExploreRoundedIcon />
                    <span>Discover</span>
                </SideOptionCard>
                <SideOptionCard>
                    <LocalFireDepartmentRoundedIcon />
                    <span>Crypts</span>
                </SideOptionCard>
                <SideOptionCard>
                    <AccountCircleRoundedIcon />
                    <span>Account</span>
                </SideOptionCard>
                <SideOptionCard>
                    <SettingsSuggestRoundedIcon />
                    <span>Settings</span>
                </SideOptionCard>
            </SideBarMenu>
            <CreatorPageContainer>
                <CoverImageContainer>
                    <CoverTopActions></CoverTopActions>
                    <CoverCreatorInfoContainer>
                        <ProfilePicContainer>
                            <ProfilePic src={dp} />
                        </ProfilePicContainer>
                        <InfoContainer>
                            <CoverCreatorName>Anuv Jain</CoverCreatorName>
                            <CoverStatsContainer>
                                <CoverStat>612 members</CoverStat>
                                <CoverStat>1.5K followers</CoverStat>
                            </CoverStatsContainer>
                        </InfoContainer>
                        <CoverMilestoneStat>
                            <MilestoneMeter>
                                <FilledMeter></FilledMeter>
                            </MilestoneMeter>
                            3rd Milestone
                        </CoverMilestoneStat>
                    </CoverCreatorInfoContainer>
                </CoverImageContainer>
                <FeedContainer>
                    <TopFeedActionsContainer>
                        <BlankSpace></BlankSpace>
                        <BecomeMemberBtn>Become a Member</BecomeMemberBtn>
                        <FollowBtn>Follow</FollowBtn>
                    </TopFeedActionsContainer>
                    <FeedSection>
                        <SectionHeader>MY STORY</SectionHeader>
                        <StoryText>
                            I released my first single, entitled "Baarishein" in
                            2016 on my own YouTube channel. The track has since
                            amassed over 38 million views on the platform. The
                            song later released officially on music streaming
                            platforms in 2018, since then I have released 8 more
                            singles, my latest being Meri Baaton Mein Tu
                            released in 2022 and has been dedicated by my close
                            friend Shlok to a special someone.
                        </StoryText>
                    </FeedSection>
                    <FeedSection>
                        <SectionHeader>MY WORK</SectionHeader>
                        <WorkListContainer>
                            <WorkCard>
                                <img src={spotify} alt="" />
                                Spotify
                            </WorkCard>
                            <WorkCard>
                                <img src={youtube} alt="" />
                                YouTube
                            </WorkCard>
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