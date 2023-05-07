import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { StoreContext } from "../../utils/Store";
import { magicLogin } from "../../utils/user";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CircularProgress } from "@mui/material";

const RedirectPageContainer = styled.div`
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    span{
        margin-top: 1rem;
        color: white;
        font-size: 1.1rem;
    }
`;

const Redirect = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(StoreContext);
    const [userInfo, setUserInfo] = useState(null);
    const [did, setDid] = useState(null);


    useEffect(() => {
        const getRedirectResult = async () => {
            console.log('getting redirect')
            try {
                const result = await state.magic.oauth.getRedirectResult();
                console.log(result)
                const idToken = await state.magic.user.getIdToken();
                setUserInfo(result.oauth.userInfo);
                setDid(idToken);
            } catch (error) {
                console.log(error)
            }
        }
        if (!state.magic) return;
        getRedirectResult();
    }, [state.magic])

    useEffect(() => {
        login()
    }, [did])

    const login = async () => {
        if (!did) return;
        const loginSuccess = await magicLogin(state, dispatch, did, userInfo, false);
        if (loginSuccess) {
            navigate('/home');
        } else {
            console.log('login failed')
            navigate('/');
        }
    }

    return (
        <RedirectPageContainer>
            <CircularProgress size={90} thickness={2} style={{color: "#F423BA"}}/>
            <span>Creating a secure Web3 wallet...</span>
        </RedirectPageContainer>
    )
}

export default Redirect;
