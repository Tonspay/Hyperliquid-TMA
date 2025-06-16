import { ethers } from "ethers";
import { getKey } from "./storage";

const getWallet = () =>
{
    const key = getKey();
    // const key = "";
    if(!key)
    {
        return false;
    }else{
        return resotreWallet(key)
    }
}

const genWallet =() =>
{
    return ethers.Wallet.createRandom();
}

const resotreWallet = (key:string)=>
{
        try{
            return new ethers.Wallet(key);
        }catch(e)
        {
            return false;
        }  
}

export {
    getWallet,
    genWallet,
    resotreWallet
}