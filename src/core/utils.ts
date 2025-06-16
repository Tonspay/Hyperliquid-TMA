import { config } from "./config";
import { toUserFriendlyAddress  } from  "@tonconnect/ui-react";

const search_token_by_id = (id:string) =>
{
    for(const i in config.chains)
    {
        if(config.chains[i].id == id.toUpperCase())
        {
            return config.chains[i];
        }
    }
    return false
}

export function toNoBounceAddress(rawAddress: string): string {
    return toUserFriendlyAddress(rawAddress, false);
  }

export function formatTime  (totalSeconds: number)  {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
function sleep (ms:number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
export {
    search_token_by_id,
    sleep
}