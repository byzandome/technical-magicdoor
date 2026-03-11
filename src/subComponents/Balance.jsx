
import { useBalance } from "wagmi";

export default function Balance({ address }) {
    const { data: balance } = useBalance({
        address,
    })

    if (!address) return null;
    if (!balance) return "...";
    return `Your Balance: ${balance.value} ${balance.symbol}`;
}