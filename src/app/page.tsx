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
    console.log("Telegram init")
    try{
      const path = `hyperliquid_key`;
      const value =  resotreWallet(await cloudStorage.getItem(path));
      if(value)
      {
        //set key to localsotrage
        setKey(value as any);
        redirect('/home');
      }else{
        //set new key to cloudstorage .
        const sec = genWallet().privateKey;
        await cloudStorage.setItem(path,sec)
        window.location.reload();
      }
    }catch(e)
    {
      console.log(e)
      return false;
    }
    return false;
  }

  useEffect(() => {
    keygen()
    // redirect('/home');
    }, []);
}
