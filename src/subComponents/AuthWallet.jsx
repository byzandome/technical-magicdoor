
import { useEffect, useMemo, useState } from 'react'
import { useBalance, useConnect, useConnection, useConnectors, useDisconnect } from 'wagmi'
import { ofuscateAddress } from '../utils/web3'
import Balance from './Balance'


export default function AuthWallet() {
    const { connect } = useConnect()
    const connectors = useConnectors()

    return connectors.map((connector) => (
        <WalletOption
            key={connector.uid}
            connector={connector}
            onClick={() => connect({ connector })}
        />

    ))
}

function WalletOption({
    connector,
    onClick,
}) {
    const [ready, setReady] = useState(false)
    const { address } = useConnection()
    const { disconnect } = useDisconnect()



    const formatAddress = useMemo(() => ofuscateAddress(address), [address])


    useEffect(() => {
        ; (async () => {
            const provider = await connector.getProvider()
            setReady(!!provider)
        })()
    }, [connector])

    return (
        <div className='auth-wallet'>
            <Balance address={address} />
            <button className='connect-wallet-button' disabled={!ready} onClick={formatAddress ? disconnect : onClick} title={formatAddress ? "Disconnect" : "Connect Wallet"}>
                {formatAddress || connector.name}
            </button>
        </div>
    )
}