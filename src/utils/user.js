import Cookies from 'js-cookie';
import axios from 'axios';
import notify from './notify';
import { notifyPromise, notifyResolve } from './notify';
import { ethers } from 'ethers';
import { validateEmail } from './utils';
import { Magic } from 'magic-sdk';
import { ContractABI, ContractAddress } from './constants';
import { OAuthExtension } from '@magic-ext/oauth';

export const logoutHandler = (dispatch) => {
    console.log('Loggin out');
    dispatch({ type: 'UNSET_USER' });
    Cookies.remove('user');
    dispatch({ type: 'UNSET_JWT' });
    Cookies.remove('jwt');
    // navigate('/');
    // console.log('user',state.user)
};

export const loginWithGoogle = async (dispatch, code) => {
    const notifyId = notifyPromise('Google Logging...', 'info');
    try {
        const response = await axios.post(`${process.env.REACT_APP_API}/user/googleLogin`, {
            code: code
        })
        console.log(response)
        var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);
        dispatch({
            type: 'SET_USER',
            payload: response.data.user_instance,
            time: inThirtyMins,
        });
        Cookies.set('user', JSON.stringify(response.data.user_instance));
        dispatch({
            type: 'SET_JWT',
            payload: response.data.token,
            time: inThirtyMins,
        });
        Cookies.set('jwt', response.data.token);
        response.data.isNewUser ? notifyResolve(notifyId, 'Signed Up', 'success') : notifyResolve(notifyId, 'Logged In', 'success');
        return true
    } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
            notifyResolve(notifyId, error?.response?.data?.message, 'error');
        } else {
            notifyResolve(notifyId, error.message, 'error');
        }
        return false
    }
}

export const connectToMetamask = async (dispatch) => {
 
    if (!window.ethereum || !window.ethereum.isMetaMask) {
        console.log('No metamask');
        notify('Please use a browser with Metamask', 'info');
        return;
    }

    const chainId = 137;
    const requrestNetworkSuccess = await requestNetwork(chainId);
    if (!requrestNetworkSuccess) {
        console.log("Not able to change network");
        return;
    }
    const notifyId = notifyPromise('Connecting to MetaMask...', 'info');
    try {
        const web3 = new ethers.providers.Web3Provider(window.ethereum, 'any');
        await web3.send('eth_requestAccounts', []);
        const signer = web3.getSigner();
        console.log('Account:', await signer.getAddress());
        const message = await axios
            .get(`${process.env.REACT_APP_API}/user/getToken`)
            .then((res) => {
                console.log(res);
                return res.data.message;
            });

        const verifiedMessage = await axios.post(
            `${process.env.REACT_APP_API}/user/verifyToken`,
            {
                address: await web3.getSigner().getAddress(),
                signature: await web3.getSigner().signMessage(message),
            }
        );

        const signerAddress = await web3.getSigner().getAddress();

        if (verifiedMessage.data.message === 'Token verified') {
            const userBackend = await axios
                .get(`${process.env.REACT_APP_API}/user/getUser/${signerAddress}`)
                .then((res) => {
                    console.log(res);
                    return res.data;
                })
                .catch((error) => {
                    console.log(error);
                });

            // add token to user object

            // console.log('user',userBackend);

            var inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);

            dispatch({
                type: 'SET_USER',
                payload: userBackend,
                time: inThirtyMins,
            });

            console.log("SETTING USER", userBackend)

            Cookies.set('user', JSON.stringify(userBackend));

            dispatch({
                type: 'SET_JWT',
                payload: verifiedMessage.data.token,
                time: inThirtyMins,
            });

            Cookies.set('jwt', verifiedMessage.data.token);
            notifyResolve(notifyId, 'Connected to Metamask', 'success');
            return true;
        }
    } catch (error) {
        if (error?.response?.data?.message) {
            notifyResolve(notifyId, error?.response?.data?.message, 'error');
        } else {
            notifyResolve(notifyId, error.message, 'error');
        }
        return false;
    }
};

export const magicLogin = async (state, dispatch, did, userInfo, isCreator) => {
    console.log('magic loggin in', did, userInfo);
    const notifyId = notifyPromise('Hashcase Wallet Logging in...', 'info');
    try {
        const API_URL_SUFFIX = isCreator ? 'magicLoginCreator' : 'magicLoginUser';
        const userBackend = await axios.post(`${process.env.REACT_APP_API}/user/${API_URL_SUFFIX}`, {
            didToken: did,
            userInfo
        });
        console.log(userBackend);
        let resFromSC;
        if(userBackend.data.isUserNew){
            // also register on smart contract
            console.log("Registering on SC");
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

            
            if(isCreator){
                resFromSC = await contractInstance.RegisterCreator("Creator name", "youtube", 1000);
            }else{
                resFromSC = await contractInstance.RegisterContributor("Contributor name");
            }
        }


        const inThirtyMins = new Date(new Date().getTime() + 30 * 60 * 1000);

        dispatch({
            type: 'SET_USER',
            payload: userBackend.data.user_instance,
            time: inThirtyMins,
        });
        Cookies.set('user', JSON.stringify(userBackend.data.user_instance));

        dispatch({
            type: 'SET_JWT',
            payload: userBackend.data.token,
            time: inThirtyMins,
        });
        Cookies.set('jwt', userBackend.data.token);
        if (userBackend.data.isNewUser) {
            notifyResolve(notifyId, 'Welcome to Creators Community!', 'success');
        } else {
            notifyResolve(notifyId, 'Logged in!', 'success');
        }
        return true;
    } catch (error) {
        if (error?.response?.data?.message) {
            notifyResolve(notifyId, error?.response?.data?.message, 'error');
        } else {
            notifyResolve(notifyId, error.message, 'error');
        }
        return false;
    }
}


const requestNetwork = async (chainId) => {
    console.log(window.ethereum.networkVersion);
    if (window.ethereum.networkVersion !== chainId) {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexValue(chainId) }]
            });
        } catch (error) {
            // This error code indicates that the chain has not been added to MetaMask
            console.log(error);
            if (error.code === 4902) {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainName: 'Polygon Mainnet',
                            chainId: ethers.utils.hexValue(chainId),
                            nativeCurrency: { name: 'MATIC', decimals: 18, symbol: 'MATIC' },
                            rpcUrls: ['https://polygon-rpc.com/']
                        }
                    ]
                });
            } else {
                notify(error.message, 'error');
                return false;
            }
        }
    }
    return true;
}
