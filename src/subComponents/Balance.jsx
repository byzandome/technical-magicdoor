import { useEffect, useState } from "react";
import { getBalance, getProvider } from "../utils/web3";

export default function Balance({ account }) {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if (!account) return;

        const provider = getProvider();
        getBalance(provider, account).then(setBalance).catch((error) => {
            console.error("Failed to get balance:", error);
        });
    }, [account]);

    if (account === null) return null;
    if (balance === null) return "...";
    return `Your Balance: ${balance} ETH`;
}