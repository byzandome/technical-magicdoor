import { ethers } from "ethers";

export function ofuscateAddress(address) {
    if (!address) return null;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}