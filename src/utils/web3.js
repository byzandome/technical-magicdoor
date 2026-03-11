import { ethers } from "ethers";

export function ofuscateAddress(address) {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isMetaMaskInstalled() {
    return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask;
}

export function getProvider() {
    if (!isMetaMaskInstalled()) {
        console.log("MetaMask not installed; using read-only defaults")
        return ethers.getDefaultProvider();
    }
    return new ethers.BrowserProvider(window.ethereum); 
}

export async function getBalance(provider, address) {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
}