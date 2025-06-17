const config = {
    api:{
        baseUrl:"https://dex-api.tonspay.top",
        router:{
            deposite:"/deposite",
            deposite_check:"/deposite"
        },
        hyperLiquidUrl:"https://api.hyperliquid.xyz",
        hyperLiquidRouter:{
            info:"/info"
        }
    },
    storage:{
        baseTag:"hyperliquid_",
        router:{
            key:"key",
        }
    },
    chains:[
        // {
        //     name:"SOL",
        //     id:"SOL",
        //     img:"/img/chains/sol.png",
        //     scan:{
        //         base:"https://solscan.io/",
        //         account:"account",
        //         tx:"tx"
        //     }
        // },
        {
            name:"TON",
            id:"TON",
            img:"/img/chains/ton.png",
            scan:{
                base:"https://tonscan.org/",
                account:"address",
                tx:"tx"
            }
        },
        // {
        //     name:"ETH",
        //     id:"ETH",
        //     img:"/img/chains/eth.png",
        //     scan:{
        //         base:"https://etherscan.io/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"BTC",
        //     id:"BTC",
        //     img:"/img/chains/btc.png",
        //     scan:{
        //         base:"https://mempool.space/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"LTC",
        //     id:"LTC",
        //     img:"/img/chains/ltc.png",
        //     scan:{
        //         base:"https://litecoinspace.org/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"BCH",
        //     id:"BCH",
        //     img:"/img/chains/bch.png",
        //     scan:{
        //         base:"https://explorer.bitcoinunlimited.info/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"ARB",
        //     id:"ARB",
        //     img:"/img/chains/arb.png",
        //     scan:{
        //         base:"https://arbiscan.io/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"BNB",
        //     id:"BNB",
        //     img:"/img/chains/bnb.png",
        //     scan:{
        //         base:"https://bscscan.com/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"TRX",
        //     id:"TRX",
        //     img:"/img/chains/trx.png",
        //     scan:{
        //         base:"https://tronscan.org/#/",
        //         account:"address",
        //         tx:"transaction"
        //     }
        // },
        // {
        //     name:"XMR",
        //     id:"XMR",
        //     img:"/img/chains/xmr.png",
        //     scan:{
        //         base:"https://xmrscan.org/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        // {
        //     name:"AVAX",
        //     id:"AVAX",
        //     img:"/img/chains/avax.png",
        //     scan:{
        //         base:"https://snowtrace.io/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
        {
            name:"USDCARBITRUM",
            id:"USDCARBITRUM",
            img:"/img/chains/usdt.png",
            scan:{
                base:"https://bscscan.com/",
                account:"address",
                tx:"tx"
            }
        },
        // {
        //     name:"TRXUSDT",
        //     id:"USDTTRX",
        //     img:"/img/chains/usdt.png",
        //     scan:{
        //         base:"https://tronscan.org/#/",
        //         account:"address",
        //         tx:"transaction"
        //     }
        // },
        // {
        //     name:"ETHDAI",
        //     id:"DAIETH",
        //     img:"/img/chains/dai.png",
        //     scan:{
        //         base:"https://etherscan.io/",
        //         account:"address",
        //         tx:"tx"
        //     }
        // },
    ]
}

const getChain = (id:string) =>
{
    for(let i in config.chains)
    {
        let e = config.chains[i];
        if(e.id.toUpperCase() == id.toUpperCase())
        {
            return e
        }
    }
    return false;
}
const getKeys = ()=>
{
    return JSON.parse(
        process.env.NEXT_PUBLIC_FFKEYS
    )
}
export {
    config,
    getKeys,
    getChain
}