import { ExchangeClient,InfoClient,HttpTransport } from "@nktkas/hyperliquid";

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
export {
    getAccountInfo,
    getAccountOpenOrders,
    sendFundToOthers,
    closePosition
}