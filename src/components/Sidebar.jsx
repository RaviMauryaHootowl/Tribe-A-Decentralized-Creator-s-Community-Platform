import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../images/logo.svg";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import TravelExploreRoundedIcon from "@mui/icons-material/TravelExploreRounded";
import LocalFireDepartmentRoundedIcon from "@mui/icons-material/LocalFireDepartmentRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import { StoreContext } from "../utils/Store";

const SideBarMenu = styled.div`
    padding: 2rem;
    width: 400px;
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

const Sidebar = () => {
    const { state, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if(!state.user.emailId){
    //         navigate("/");
    //     }
    // }, [state.user])

    return (
        <SideBarMenu>
            <AppLogo src={logo} />
            {state.user.isCreator ? (
                <SideOptionCard
                    onClick={() => {
                        navigate("/dashboard");
                    }}
                >
                    <HomeRoundedIcon />
                    <span>Dashboard</span>
                </SideOptionCard>
            ) : (
                <SideOptionCard
                    onClick={() => {
                        navigate("/home");
                    }}
                >
                    <HomeRoundedIcon />
                    <span>Home</span>
                </SideOptionCard>
            )}
            <SideOptionCard
                onClick={() => {
                    navigate("/discover");
                }}
            >
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
    );
};

export default Sidebar;
