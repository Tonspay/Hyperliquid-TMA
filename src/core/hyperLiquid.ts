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
    return await exchClient.order(
        {
            orders: [{
                a: symbol,
                b: false,
                p: "0",
                s: amount,
                r: false,
                t:{
                    trigger:{
                        isMarket:true,
                        triggerPx:"",
                        tpsl:"tp"
                    }
                }
                
            }],
            grouping: "na",
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
                    info:(info[0].universe)[i],
                    market:info[1][i]
                }
                console.log(ret)
                return ret;
            }
        }
    }
    console.log(info)
}
export {
    getAccountInfo,
    getAccountOpenOrders,
    sendFundToOthers,
    closePosition,
    getFutureDetailsByName
}