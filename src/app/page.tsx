"use client";
import { redirect } from 'next/navigation';
import { useEffect } from 'react';
import { cloudStorage ,init } from "@telegram-apps/sdk-react";
import { genWallet, resotreWallet } from 'core/web3';
import { setKey } from 'core/storage';

export default function Home({}) {
  const keygen = async ()=>
  {
    //Check TMA cloudstorage status
    await init()
    console.log("Telegram init cache 001")
    try{
      const path = `hyperliquid_key`;
      // console.log("Cloudstorage::",await cloudStorage.getItem(path))
      const value =  resotreWallet(await cloudStorage.getItem(path));
      if(value)
      {
        //set key to localsotrage
        setKey((await cloudStorage.getItem(path)) as any);
        window.location.href = "/home/wallet"
      }else{
        //set new key to cloudstorage .
        const sec = genWallet().privateKey;
        await cloudStorage.setItem(path,sec)
        window.location.reload();
      }
    }catch(e)
    {
      console.log(e)
      //Not open in telegram
      window.location.href = "https://t.me/tonspay_bot/dex"
      return false;
    }
    return false;
  }

  useEffect(() => {
    // keygen()
    redirect('/home/wallet');
    }, []);
}
