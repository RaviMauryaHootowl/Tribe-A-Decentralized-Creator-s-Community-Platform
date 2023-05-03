import { createClient, configureChains, defaultChains, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const WagmiProvider = ({ children }) => {

    const { provider, webSocketProvider } = configureChains(defaultChains, [publicProvider()]);

    const client = createClient({
        provider,
        webSocketProvider,
        autoConnect: true,
    });
    
    return (
        <WagmiConfig client={client}>
            {children}
        </WagmiConfig >
    );
};

export default WagmiProvider;
