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
export {
    getAccountInfo,
    getAccountOpenOrders
}