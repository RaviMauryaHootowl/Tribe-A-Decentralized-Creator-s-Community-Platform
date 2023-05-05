import { useContext, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { StoreContext } from "../../utils/Store";
import { notifyPromise, notifyResolve } from "../../utils/notify";
import { magicLogin } from "../../utils/user";
import { useNavigate } from "react-router-dom";


const RedirectCreator = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useContext(StoreContext);
    const [userInfo, setUserInfo] = useState(null);
    const [did, setDid] = useState(null);


    useEffect(() => {
        const getRedirectResult = async () => {
            console.log('getting redirect')
            const notifyId = notifyPromise('Verifying Credentials...', 'info');
            try {
                const result = await state.magic.oauth.getRedirectResult();
                console.log(result)
                const idToken = await state.magic.user.getIdToken();
                notifyResolve(notifyId, 'Credentials Verified', 'success');
                setUserInfo(result.oauth.userInfo);
                setDid(idToken);
            } catch (error) {
                console.log(error)
                notifyResolve(notifyId, 'Error verifying credentials', 'error');
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
        const loginSuccess = await magicLogin(state, dispatch, did, userInfo, true);
        if (loginSuccess) {
            navigate('/home');
        } else {
            console.log('login failed')
            navigate('/home');
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            {/* <LoadingModal showModal={true} /> */}
            <BeatLoader size={40} color="#04A6E7"/>
        </div>
    )
}

export default RedirectCreator;