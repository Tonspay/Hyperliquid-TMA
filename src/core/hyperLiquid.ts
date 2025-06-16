import { ExchangeClient,InfoClient,HttpTransport } from "@nktkas/hyperliquid";

const transport = new HttpTransport();

const infoClient = new InfoClient({ transport });

const getAccountInfo = async (address:string) =>
{
    return  await infoClient.clearinghouseState({ user:(address as any) });
}

export {
    getAccountInfo
}