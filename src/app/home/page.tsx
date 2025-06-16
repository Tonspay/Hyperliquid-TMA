'use client';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import Card from 'components/card';
import {
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { config, getChain, getKeys } from "../../core/config";
import { useEffect, useRef, useState } from "react";
import { formatTime, search_token_by_id, sleep, toNoBounceAddress } from "core/utils";

import { bridge } from "@frogmixer/bridge";
import { generateQRCodeBase64 } from "utils/qr";
import { SendTransactionRequest, useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import {TonConnectButton} from "@tonconnect/ui-react";
import TonWeb from 'tonweb';
import { api_deposite, api_deposite_check } from "core/api";
import { address } from "@ton/core";
const Dashboard = () => {
  const { open, onOpen, onClose } = useDisclosure()

  const { open: orderOpen, onOpen: onOrderOpen, onClose: onOrderClose } = useDisclosure();

  const [from, setFrom] = useState("TON");

  const [to, setTo] = useState("USDCARBITRUM");

  const [select, setSelect] = useState(true) // True : from /  False : false

  const [fromAmount , setFromAmount] = useState(0)

  const [toAmount , setToAmount] = useState(0)

  const [toAddress , setToAddress] = useState("")

  const [invoiceId , setInvoiceId] = useState("")
  const [invoiceToken , setInvoiceToken] = useState("")
  const [invoiceMemo , setInvoiceMemo] = useState("")
  const [invoiceAddress , setInvoiceAddress] = useState("")
  const [invoiceAmount , setInvoiceAmount] = useState(0)
  const [invoiceImg , setInvoiceImg] = useState("")

  const [miniFrom , setMiniFrom] = useState("")
  const [maxFrom , setMaxFrom] = useState("")
  const [toFee , setToFee] = useState("0")
  
  const [tonConnectUi] = useTonConnectUI();

  const [initLock , setInitLock] = useState(false)

  const bRef = useRef<any>(null);

  const [secondsLeft, setSecondsLeft] = useState(15 * 60);


  const wallet = useTonWallet();

  useEffect(() => {
    const init = async () => {

      // setInvoiceAddress("UQAI9ack-mbNMw2oQEuiB6899ZZ1gdDAZXWzv_oIz_N7j9-0")
      // setInvoiceAmount(1);
      // setInvoiceMemo("hello")
      // onOrderOpen();
      // timer()
      // setInvoiceImg(
      //   await generateQRCodeBase64("hello")
      // )


      const inst = new bridge({
        keys: getKeys(),
        baseUrl: "https://proxy.frogmixer.autos",
      });
      await inst.init();
      bRef.current = inst;
    };

    if(!initLock)
    {
      setInitLock(true);
      init();
    }
    
    if(invoiceId)
    {
      transactionPending()
    }

    if(wallet && to =="TON")
    {
      setToAddress(toNoBounceAddress(wallet.account.address))
    }

    if(fromAmount>0)
    {
      estimatePrice(fromAmount)
    }
  }, [invoiceId,wallet,from,to]);

  const timer = ()=>
  {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }

  const estimatePrice = (e: number) => {
    let amount = Number(e);
    console.log(
      {
        from: from,
        to: to,
        amount,
      }
    )
    const inst = bRef.current;
    if (!inst) {
      return;
    }

    const result = inst
      .estimate({
        from: from,
        to: to,
        amount,
      });
    console.log(result)
    setMiniFrom(result.minamount)
    setMaxFrom(result.maxamount)
    setToFee(result.tofee)
    if(Number(result.minamount)>amount)
    {
      return setToAmount(0);
    }
    if(amount>Number(result.maxamount))
      {
        amount = Number(result.maxamount);
        setFromAmount(Number(result.maxamount));
      }
    setToAmount(
      Number(
        (result.out*amount*0.995 - 1).toFixed(3)));
  };

  const confirm = async ()=>
  {
    const inst = bRef.current;
    if (!inst) {
      return;
    }
    const result = await api_deposite(
      {
        address:"0xB3EEd3791DC4Ef67e8123c85ba8414eAB4F8bA38",
        amount:fromAmount
      }
    )
    // if(!res || res?.code != 200)
    // {
    //   console.log(res)
    //   return false;
    // }
    // const result = res.data;
    console.log(result)
    if(result && result?.data && result.data?.from && result.data.from?.address)
    {
      setInvoiceId(result.data.id);
      setInvoiceToken(result.data.token);
      setInvoiceAddress(result.data.from.address)
      setInvoiceAmount(
        Number(result.data.from.amount)
      )
      const qr = await generateQRCodeBase64(result.data.from.address);
      console.log(qr)
      setInvoiceImg(
        qr
      )
      if(from == "TON" || result.data.from?.tag)
      {
        setInvoiceMemo(result.data.from.tag)
      }
      onOrderOpen()

      timer()
      transactionPending(result.data.oid)

    }
  }

  const send = async ()=>
  {
    if(from == "TON")
    {
      //Send out TON Amount
      if(!wallet)
        {
          return tonConnectUi.openModal()
        }else{
          const cell = new TonWeb.boc.Cell();
          cell.bits.writeUint(0, 32);
          cell.bits.writeString(invoiceMemo);
          const boc = await cell.toBoc(false);
          const payload = TonWeb.utils.bytesToBase64(boc);
          const tx: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + 600,
            messages: [
              {
                address: invoiceAddress,
                amount: Number(invoiceAmount*1e9).toFixed(0),
                payload: payload
              },
            ],
          };
          return tonConnectUi.sendTransaction(tx)
        }
    }
  }

  const transactionPending = async(orderId:string)=>
  {
    console.log(orderId)
      while(true)
      {
          await sleep(10000);
          const check = await api_deposite_check(orderId);
          console.log("check",check)
          if(check.data)
          {
              location.href="/home"
          }
          if(secondsLeft == 0 )
          {
              location.href="/home"
          }
      }
  }
  const [copiedIndex, setCopiedIndex] = useState<number>(0);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(1), 2000);
  };


  return (
      <div className="p-5 space-y-5 mt-5 block w-full justify-items-center">

        <div className="w-full max-w-md mx-auto">

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray" style={{
        display : open?"block":"none",
        backgroundColor:"transparent"
      }}>
        <div className="bg-gray-300/70 p-6 rounded-xl shadow-lg h-full flex items-center justify-center" onClick={onClose}>
            <div style={{maxWidth:"600px" , minWidth:"400px"}}>
            <Card extra="rounded-[20px] p-3"  onClick={(e:any) => e.stopPropagation()}>
            <section className="flex items-center py-2">
                    <p className="grow text-center font-bold">Select Asserts</p>
                  </section>
                  <section className="flex flex-col gap-2">
                    <div className="search-items flex flex-wrap gap-2">
                      {config.chains.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center border border-gray-300 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-100 transition"
                          onClick={
                            ()=>
                            {
                              if(select)
                              {
                                //From
                                if(to == item.id)
                                {
                                  setTo(from)
                                }
                                setFrom(item.id)
                              }else{
                                //To
                                if(from==item.id)
                                {
                                  setFrom(to);
                                }
                                setTo(item.id)
                              }
                              onClose();
                            }
                          }
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                      ))}
                    </div>

                  </section>
                  
            </Card>
            </div>

          </div>
      </div>

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray" style={{
            display : orderOpen?"block":"none",
            backgroundColor:"transparent"
        }}>
            <div className="bg-gray-300/70 p-6 rounded-xl shadow-lg h-full flex items-center justify-center">
              <div style={{maxWidth:"600px" , minWidth:"400px"}}>
            <Card extra="rounded-[20px] p-3"  onClick={(e:any) => e.stopPropagation()}>
            <section className="flex items-center py-2">
                    <p className="grow text-center font-bold">Transfer {invoiceAmount} {from} to</p>
                  </section>
                  <section className="flex flex-col gap-2">
                    <div className="search-items flex flex-wrap gap-2">
                      <div className="w-full flex justify-center items-center">
                        <div className="flex w-full">
                          <pre className="w-full text-center text-sm bg-gray-200 p-2 rounded">{invoiceAddress}</pre>
                        </div>
                      </div>
                        <div className="w-full flex justify-center items-center">
                          <button
                            onClick={() => handleCopy(invoiceAddress, 0)}
                            className="w-3/5 text-xs px-2 py-1 rounded-xl bg-gray-200 hover:bg-gray-100 transition text-center"
                          >
                            {copiedIndex === 1 ? 'Copied!' : 'Copy'}
                          </button>

                        </div>
                        {
                          invoiceMemo?
                          <div className="w-full flex justify-center items-center" style={{color:"red"}}>
                            ⚠ Copy memo and send with funds ⚠
                          </div>
                          :null
                        }
                        {
                          invoiceMemo?
                          <div className="w-full flex justify-center items-center">
                            <pre className="text-sm bg-gray-100 p-2 rounded">{invoiceMemo}
                            <button
                              onClick={async() => {await navigator.clipboard.writeText(invoiceMemo);}}
                              className="w-3/5 text-xs px-2 py-1 rounded-xl bg-gray-300 hover:bg-gray-400 transition text-center"
                            >
                              { 'Copy'}
                            </button>
                            </pre>
                        </div>
                        :
                        null
                        }
                      <div className="w-full flex justify-center items-center">
                          <img
                          src={invoiceImg?invoiceImg:"/img/logo.png"}
                          style={{
                            width:"50%",
                            height:"50%",
                            minWidth:"256px",
                            minHeight:"256px"
                          }}
                          />
                        </div>


                        <div className="w-full flex justify-center items-center">
                          <div className="text-6xl font-bold text-gray-300">
                            {formatTime(secondsLeft)}
                          </div>
                        </div>

                          {
                            from=="TON"?
                            <div className="w-full flex justify-center items-center bg-white">
                            <button
                              className="w-full min-h-[50px] rounded-xl bg-[#e6ddc0] text-white text-lg font-semibold hover:bg-[#614c38] transition duration-200 shadow-md"
                              onClick={send}
                            >
                              Connect And Send
                            </button>
                          </div>
                          :
                          null
                          }
                    </div>
                        <div className="w-full flex justify-center items-center text-sm">
                         {/* {tips} */}
                        </div>
                  </section>
                  
            </Card>
              </div>
            </div>
        </div>

        <Card extra="rounded-[20px] p-3">
          <div className="flex gap-2.5 justify-center">
                    <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                      <span className="text-default-900 text-xl font-semibold">
                        Deposit Asserts
                      </span>
                    </div>
          </div>
          <div  style={{ justifyItems:"center", width: "100%" }}>
              <div className="flex flex-col gap-6" style={{ width: "100%" }}>
                <div className="flex flex-col justify-center gap-1 relative">
                  <div className="card_head flex justify-between">
                    <p>From</p>
                  </div> 
                  <div className="card_body flex justify-between items-center text-white">

                      {
                        search_token_by_id(from) ? 
                        <button
                        className="flex items-center gap-2 rounded-xl p-2 cursor-pointer bg-[#e6ddc0] hover:bg-black"
                        style={{ minWidth: "15%" }}
                        onClick={
                          ()=>
                          {
                            setSelect(true);
                            onOpen()
                          }
                        }
                      >
  
                        <img src={(search_token_by_id(from) as any).img} style={{
                          width:"30px"
                        }}></img>
                        <span className="text-medium ">{(search_token_by_id(from) as any).name}</span>
                        <RiArrowDropDownLine size={24} />
                      </button>
                      :
                      null
                      }


                    <input
                      className=" text-3xl "
                      style={{
                        width: "70%",
                        textAlign: "right",
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                      min={3}
                      step="0.1"
                      placeholder="Min 3 TON"
                      
                      onChange={(e: any) => {
                        setFromAmount(e.target.value)
                        if(Number(e.target.value)>0)
                        {
                          estimatePrice(e.target.value)
                        }
                      }}
                    
                      key="payinput"
                      type="number"
                    ></input>
                  </div>
                  <div className="card_foot flex justify-between">
                    <p></p>
                    <p>
                      <span className="text-sm" style={{ color: "gray" }}>
                        {miniFrom} ~ {maxFrom}
                      </span>
                    </p>
                  </div>
                  <div className="trans-icon rounded-full h-6 w-full flex justify-center">
                    <div className="w-6 h-6 flex justify-center bg-white items-center rounded-full shadow-md" onClick={
                      ()=>
                      {
                        let _to = to;
                        setTo(from);
                        setFrom(_to);
                      }
                    }>
                      <FaArrowDown color="[#e6ddc0]" />
                    </div>
                  </div>
                  <div className="w-full">
                    <input className=" w-full h-[50px]  text-center  text-3xl font-bold" disabled={true} value={toAmount+" $"}>
                    </input>
                  </div>
                  <div className="card_foot flex justify-between  text-xs">
                    {/* <p>{selectedTokenInfo.info.name}</p> */}
                    <p></p>
                    <p>
                      <span className="text-sm" style={{ color: "gray" }}>
                        Network Fee :~ {toFee?toFee:0}
                      </span>
                    </p>
                  </div>

                  <div className="text-center text-gray-500 text-xs">
                    Deposit Fee : 1 $
                  </div>
                  <div className="bottom-14 right-0 w-full p-4">

                <button
                  className="w-full min-h-[50px] rounded-xl bg-[#e6ddc0] text-white text-lg font-semibold hover:bg-[#614c38] transition duration-200 shadow-md"
                  onClick={confirm}
                >
                  Deposit Now
                </button>
                  </div>
                    </div>
                </div>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
