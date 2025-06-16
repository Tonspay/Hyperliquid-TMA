import { ethers } from "ethers";
import { getKey } from "./storage";

const getWallet = () =>
{
    const key = getKey();
    if(!key)
    {
        return false;
    }else{
        try{
            return new ethers.Wallet(key);
        }catch(e)
        {
            return false;
        }
       
    }
}

export {
    getWallet
}