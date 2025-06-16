import { ExchangeClient,InfoClient,HttpTransport } from "@nktkas/hyperliquid";
import { address } from "@ton/core";

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
        destination: address as any,
        amount: Number(amount).toFixed(2),
      }
    )
}
export {
    getAccountInfo,
    getAccountOpenOrders
}