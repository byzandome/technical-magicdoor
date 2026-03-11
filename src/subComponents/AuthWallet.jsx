
import { useCallback, useEffect, useMemo, useState } from "react";
import { getProvider, isMetaMaskInstalled, ofuscateAddress } from "../utils/web3";
import Balance from "./Balance";

export default function AuthWallet() {
    const [account, setAccount] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [needToInstallMetaMask, setNeedToInstallMetaMask] = useState(false);
    const ofuscateAddress = useMemo(() => ofuscateAddress(account), [account]);

    // On component mount, check if MetaMask is installed and if there are any connected accounts
    useEffect(() => {
        if (!isMetaMaskInstalled()) return () => { };

        const getConnectedAccounts = async () => {
            const provider = getProvider();
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                setAccount(accounts[0].address);
            }
        };

        getConnectedAccounts();

    }, []);

    // Listen for account changes and update state accordingly
    useEffect(() => {
        if (!isMetaMaskInstalled()) return () => { };

        const handleAccountsChanged = (accounts) => {
            const account = accounts.length > 0 ? accounts[0].address : null;
            setAccount(account);
        };

        window.ethereum?.on('accountsChanged', handleAccountsChanged);

        return () => {
            window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        };
    }, []);


    // Connect wallet handler with error handling for pending connection requests
    const connectWalletHandler = useCallback(async () => {
        if (!isMetaMaskInstalled()) {
            setNeedToInstallMetaMask(true);
            return;
        }

        setIsConnecting(true);
        try {
            const provider = getProvider();
            await provider.getSigner();
            setIsConnecting(false);

        } catch (err) {
            if (err.error?.code === -32002) {
                console.warn("Connection request already pending. Please check MetaMask.");
                return
            }
            setIsConnecting(false);
        }
    }, [isMetaMaskInstalled, getProvider]);


    const renderInstallMetaMaskMessage = () => {
        if (!needToInstallMetaMask) return null;
        return (
            <div className="install-metamask-message">
                Please install MetaMask to connect your wallet.
            </div>
        );
    };

    return (
        <div className="auth-wallet">
            <Balance account={account} />
            <button className="connect-wallet-button"
                disabled={!isMetaMaskInstalled || isConnecting}
                onClick={connectWalletHandler}
            >
                {isConnecting ? "Please check your wallet..." : (account ? ofuscateAddress : "Connect Wallet")}
            </button>
            {renderInstallMetaMaskMessage()}
        </div>
    );
}