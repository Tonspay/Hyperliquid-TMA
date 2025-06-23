import { ExchangeClient,InfoClient,HttpTransport } from "@nktkas/hyperliquid";
import { api_hyper_liquid_info } from "./api";

const transport = new HttpTransport();

const infoClient = new InfoClient({ transport });

const getAccountInfo = async (address:string) =>
{
    return  await infoClient.clearinghouseState({ user:(address as any) });
}

const getAccountOpenOrders = async (address:string) =>
{
    return await infoClient.openOrders(
        { user:(address as any) }
    )
}

const sendFundToOthers = async (wallet:any,amount:number,to:string) =>
{
    const exchClient = new ExchangeClient({ wallet, transport });
    return await exchClient.usdSend(
      {
        destination: to as any,
        amount: Number(amount).toFixed(2),
      }
    )
}

const closePosition = async (wallet:any, {
    symbol,
    amount
}) =>
{
    const exchClient = new ExchangeClient({ wallet, transport });
    const info = await getFutureDetailsByName(symbol);
    if(!info)
    {
        return false;
    }

    return await exchClient.order(
        {
            orders: [{
                a: Number(info.id),
                b: !(Number(amount)>0),
                p: (Number(info.market.markPx)*(Number(amount)>0?0.99:1.01)).toFixed(5-Number(info.info.szDecimals)),
                s: Math.abs(Number(amount)).toString(),
                r: false,
                t:{
                    limit: {
                        tif: "FrontendMarket",
                    },
                }
                
            }],
            grouping: "na",
        }
    )
}

const marketPriceOrder = async (wallet:any, {
    symbol,
    amount,
    isBuy
}) =>
{
    const exchClient = new ExchangeClient({ wallet, transport });
    const info = await getFutureDetailsByName(symbol);
    if(!info)
    {
        return false;
    }
    // let _final = {
    //         orders: [{
    //             a: Number(info.id),
    //             b: isBuy,
    //             p:(Number(info.market.markPx)*(isBuy?0.999:1.001)).toFixed(5-Number(info.info.szDecimals)),
    //             s: amount,
    //             r: false,
    //             t:{
    //                 limit: {
    //                     tif: "Gtc",
    //                 },
    //             }
                
    //         }],
    //         grouping: "na",
    //     }

        let _final = {
            orders: [{
                a: (Number(info.market.markPx)*(isBuy?0.99:1.01)).toFixed(5-Number(info.info.szDecimals)),
                b: isBuy,
                p:info.market.markPx,
                s: amount,
                r: false,
                t:{
                    limit: {
                        tif: "FrontendMarket",
                    },
                }
                
            }],
            grouping: "na",
        }
    console.log("final ::",_final)
    return await exchClient.order(_final as any)
}
const limitPriceOrder = async (wallet:any, {
    symbol,
    amount,
    isBuy,
    price
}) =>
{
    const exchClient = new ExchangeClient({ wallet, transport });
    const info = await getFutureDetailsByName(symbol);
    if(!info)
    {
        return false;
    }

    return await exchClient.order(
        {
            orders: [{
                a: Number(info.id),
                b: isBuy,
                p: price,
                s: (Number(amount)/price).toFixed(Number(info.info.szDecimals)),
                r: false,
                t:{
                    limit: {
                        tif: "Gtc",
                    },
                }
                
            }],
            grouping: "na",
        }
    )
}

const cancelOrder = async(wallet:any , {
    symbol,
    id
})=>
{
    const exchClient = new ExchangeClient({ wallet, transport });
    const info = await getFutureDetailsByName(symbol);
    if(!info)
    {
        return false;
    }

    return await exchClient.cancel(
        {
            cancels: [{
                a: Number(info.id),
                o:id
                
            }],
        }
    )
}
const getFutureDetailsByName = async(name:string) =>
{
    const info = await api_hyper_liquid_info("metaAndAssetCtxs");
    if(info && info?.length >1)
    {
        //Request success
        for(let i in info[0].universe)
        {
            if((info[0].universe)[i]?.name == name)
            {
                const ret = {
                    name,
                    id:i,
                    info:(info[0].universe)[i],
                    market:info[1][i]
                }
                console.log(ret)
                return ret;
            }
        }
    }
}

const getFutureTokenList = async()=>
{
    const info = await api_hyper_liquid_info("metaAndAssetCtxs");
    if(!info || info?.length<1)
    {
        return false;
    }
    let ret = [];
    for(let i in info[0].universe)
        {
            ret.push(
                {
                    name:info[0].universe[i].name,
                    id:i,
                    info:(info[0].universe)[i],
                    market:info[1][i]
                }
            )
        }
    return ret;
}
export {
    getAccountInfo,
    getAccountOpenOrders,
    sendFundToOthers,
    closePosition,
    getFutureDetailsByName,
    getFutureTokenList,
    marketPriceOrder,
    limitPriceOrder,
    cancelOrder
}