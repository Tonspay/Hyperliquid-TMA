'use client';
import { RiArrowDropDownLine } from "react-icons/ri";
import Card from 'components/card';
import {
  Flex,
  useDisclosure,
} from '@chakra-ui/react'
import { config, getChain, getKeys } from "../../../core/config";
import { useEffect, useRef, useState } from "react";
import { formatTime, search_token_by_id, sleep, toNoBounceAddress } from "core/utils";
import { generateQRCodeBase64 } from "utils/qr";
import { cancelOrder, closePosition, getAccountInfo, getAccountOpenOrders, getFutureTokenList, limitPriceOrder, marketPriceOrder } from "core/hyperLiquid";
import { getWallet } from "core/web3";
const Dashboard = () => {
  const { open, onOpen, onClose } = useDisclosure()

  const [from, setFrom] = useState(0);

  const [to, setTo] = useState(1);

  const [price , setPrice] = useState(0)

  const [fromAmount , setFromAmount] = useState(0)

  const [isMarket , setIsMarket] = useState(true)

  const [miniFrom , setMiniFrom] = useState("")
  const [maxFrom , setMaxFrom] = useState("")

  const [initLock , setInitLock] = useState(false)

  const [positions, setPositions] = useState(
    []
  )

  const [orders, setOrders] = useState(
    []
  )

  const [tokens, setTokens] = useState(
    []
  )

  const [address , setAddress] = useState("")
  const [addressQR , setAddressQR] = useState("")

  const [accountInfo, setAccountInfo] = useState(
    {
        accountValue: "0.0",
        totalNtlPos: "0.0",
        totalRawUsd: "0.0",
        totalMarginUsed: "0.0",
        withdrawable:"0.0"
    }
  );
  const wallet = getWallet();
  if(!wallet)
  {
    window.location.href = "/"
  }
  useEffect(() => {
    const init = async () => {
      if(!wallet)
      {
        console.log("wallet not exsit")
        return false;
      }
      setAddress(wallet.address);
      setAddressQR(
        await generateQRCodeBase64(
          wallet.address
        )
      )
      let preps = await getFutureTokenList();
      if(!preps)
      {
        return false;
      }
      // console.log(preps)
      setTokens(preps)

      await updateProfile();
      await updateOrders()
    };

    if(!initLock)
    {
      setInitLock(true);
      init();
    }
    
  }, [from,to]);

  const updateProfile = async()=>
  {
      const bal = await getAccountInfo((wallet as any).address)
      if(bal)
      {
        let sum = JSON.parse(JSON.stringify(bal.marginSummary))
        sum['withdrawable'] = bal.withdrawable
        setAccountInfo(sum)
        console.log(bal)
        if(bal?.assetPositions && bal.assetPositions.length>0)
        {
          setPositions(
            bal.assetPositions
          )
        }else
        {
          setPositions([])
        }
      }else{
        setPositions([])
      }
  }

  const updateOrders = async()=>
  {
      const orders = await getAccountOpenOrders((wallet as any).address);
      console.log(orders)
      if(orders.length>0)
      {
        setOrders(orders)
      }else{
        setOrders([])
      }
  }
  const [copiedIndex, setCopiedIndex] = useState<number>(0);

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(1), 2000);
  };


  const placeOrder = async (type:boolean)=>
  {
    let isBuy = type;
    const tk = tokens[from]
    if(isMarket)
    {
      const order = await marketPriceOrder(
        getWallet(),
        {
          symbol:tk.name,
          amount:(fromAmount/Number(tk.market.markPx)).toFixed(Number(tk.info.szDecimals)),
          isBuy
        }
      )

      console.log("order",order)
    }else{
      const order = await limitPriceOrder(
        getWallet(),
        {
          symbol:tk.name,
          amount:fromAmount,
          isBuy,
          price:price.toString()
        }
      )

      console.log("order",order)
    }
    await updateProfile()
    await updateOrders()
  }
  return (
      <div className="p-5 space-y-5 mt-5 block w-full justify-items-center">

        <div className="w-full max-w-md mx-auto">

<div className="fixed inset-0 z-50 flex items-center justify-center bg-gray" style={{
  display: open ? "block" : "none",
  backgroundColor: "transparent"
}}>
  <div className="bg-gray-300/70 p-6 rounded-xl shadow-lg h-full flex items-center justify-center" onClick={onClose}>
    <div style={{ maxWidth: "800px", minWidth: "400px" }}>
      <Card extra="rounded-[20px] p-3" onClick={(e: any) => e.stopPropagation()}>
        <section className="flex items-center py-2">
          <p className="grow text-center font-bold">Select Asserts</p>
        </section>
        <section className="flex flex-col gap-2">
          <div
            className="search-items flex flex-wrap gap-2"
            style={{ maxHeight: "500px", overflowY: "auto" }}
          >
            {tokens.map((item, index) => (
              <div
                key={"token_" + index}
                className="flex items-center border border-gray-300 rounded-full px-3 py-1 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => {
                  setFrom(item.id)
                  onClose();
                }}
              >
                <span className="text-sm font-medium">{item.info.name}</span>
              </div>
            ))}
          </div>
        </section>
      </Card>
    </div>
  </div>
</div>


        <div className="w-full p-1">
          <Card extra="rounded-[20px] p-3">
            <div className="flex gap-2.5 justify-center">
                      <div className={"flex flex-colpy-2 px-6" + (isMarket ? " rounded-xl border-dashed border-2 border-divider ":"")} onClick={
                        ()=>
                        {
                          console.log("click",isMarket)
                          setIsMarket(true)
                        }
                      }>
                        <span className="text-default-900 text-xl font-semibold">
                          Market
                        </span>
                      </div>
                     <div className={"flex flex-colpy-2 px-6" + (isMarket ? "":" rounded-xl border-dashed border-2 border-divider ")} onClick={
                        ()=>
                        {
                          setIsMarket(false)
                        }
                      }>
                        <span className="text-default-900 text-xl font-semibold">
                          Limit
                        </span>
                      </div>
            </div>
            <div  style={{ justifyItems:"center", width: "100%" }}>
                <div className="flex flex-col gap-6" style={{ width: "100%" }}>
                  <div className="flex flex-col justify-center gap-1 relative">
                    <div className="card_head flex justify-between">
                      <p></p>
                    </div> 
                    <div className="card_body flex justify-between items-center text-white">

                        {
                          tokens.length<1 ? 
                          null :
                          <button
                          className="flex items-center gap-2 rounded-xl p-2 cursor-pointer bg-gray-500 hover:bg-black"
                          style={{ minWidth: "15%" }}
                          onClick={
                            ()=>
                            {
                              onOpen()
                            }
                          }
                        >
    
                          {/* <img src={(search_token_by_id(from) as any).img} style={{
                            width:"30px"
                          }}></img> */}
                          <span className="text-medium ">{tokens[from].info.name}</span>
                          <RiArrowDropDownLine size={24} />
                        </button>
                        }


                      <input
                        className=" text-3xl "
                        style={{
                          width: "60%",
                          textAlign: "right",
                          backgroundColor: "transparent",
                          color: "black",
                        }}
                        min={3}
                        step="0.1"
                        placeholder="Min 10 USD"
                        
                        onChange={(e: any) => {
                          setFromAmount(e.target.value)
                          if(Number(e.target.value)>0)
                          {
                            // estimatePrice(e.target.value)
                          }
                        }}
                      
                        key="payinput"
                        type="number"
                      ></input>
                      <div className="text-2xl" style={{color:"black"}}>
                        {"$"}
                      </div>
                    </div>
                    <div className="card_foot flex justify-between">
                      <p></p>
                      <p>
                        <span className="text-sm" style={{ color: "gray" }}>
                          {miniFrom} ~ {maxFrom}
                        </span>
                      </p>
                    </div>
                    <div className="text-center text-gray-500 text-xs">
                      Slippage : 0.05%
                    </div>
                    {
                      isMarket?null:
                      <div className="card_body flex justify-between items-center text-black">
                      <div className="text-black text-xl">Limit Price : </div>  
                      <input
                        className=" text-xl "
                        style={{
                          width: "70%",
                          textAlign: "right",
                          backgroundColor: "transparent",
                          color: "black",
                        }}
                        min={3}
                        step="0.1"
                        placeholder={Number(tokens[from].market.markPx).toString()}
                        
                        onChange={(e: any) => {
                          setPrice(e.target.value)
                        }}
                      
                        key="payinput"
                        type="number"
                      />
                      </div>
                    }
                    <div className="w-full px-4 justify-center items-center flex">
                        <button
                          className="w-48 min-h-[50px] rounded-xl bg-green-500 text-white text-lg font-semibold hover:bg-green-200 transition duration-200 shadow-md"
                          onClick={
                            ()=>
                            {
                              placeOrder(true)
                            }
                          }
                        >
                          Long
                        </button>
                        <button
                          className="w-48 min-h-[50px] rounded-xl bg-red-500 text-white text-lg font-semibold hover:bg-red-200 transition duration-200 shadow-md"
                          onClick={
                            ()=>
                            {
                              placeOrder(false)
                            }
                          }
                        >
                          Short
                        </button>
                    </div>
                      </div>
                  </div>

            </div>
          </Card>
        </div>

        {
          (positions?.length>0) ?
          <div className="w-full p-1">
            <Card extra="rounded-[20px] p-3">
              <div className="flex gap-2.5 justify-center">
                        <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                          <span className="text-default-900 text-xl font-semibold">
                            My Positions
                          </span>
                        </div>
              </div>
              <div className="w-full">

                <div className="w-full flex flex-col">
                  {
                    positions.map((item, index) => (
                      <div className="flex w-full bg-gray-50 rounded-xl mb-3" key={"positions_"+index}>
                        <div className="w-[80%] flex flex-col items-center justify-center">
                          <div className="w-full text-center text-xl"><p> <a>{item.position.leverage.value}x</a> {item.position.coin} <a className={"text-sm " + (Number(item.position.unrealizedPnl)>0) ? "bg-red-300" : "bg-green-300"}>{(Number(item.position.unrealizedPnl)>0)?"+":null} {((Number(item.position.unrealizedPnl)*100/Number(item.position.positionValue)).toFixed(2))}%</a> </p></div>
                        
                          <div className="w-full text-center">
                            <p>
                                <a  className="bg-gray-200   font-bold ">{item.position.positionValue}$</a>  <a  className="bg-gray-200   font-bold ">{Number(item.position.unrealizedPnl)>0 ? "+"+item.position.unrealizedPnl : item.position.unrealizedPnl}$</a>
                            </p>
                          </div>
                        </div>
                        <div className="w-[20%]  font-bold flex flex-col items-center justify-center">
                          <button className="w-full text-xl rounded-xl w-24 bg-white hover:bg-gray-400 transition text-center py-2 rounded shadow-lg"
                          onClick={
                            async()=>
                            {
                              const cls = await closePosition(
                                getWallet(),
                                {
                                  symbol:item.position.coin,
                                  amount:item.position.szi
                                }
                              )
                              console.log(cls)
                              await updateProfile()
                            }
                          }
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    ))
                  }

                </div>
              </div>

            </Card>
          </div>
          :
          null
        }

        {
          (orders?.length>0) ?
          <div className="w-full p-1">
          <Card extra="rounded-[20px] p-3">
            <div className="flex gap-2.5 justify-center">
                      <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                        <span className="text-default-900 text-xl font-semibold">
                          My Orders
                        </span>
                      </div>
            </div>
            <div className="w-full">

              <div className="w-full flex flex-col">
                {
                  orders.map((item, index) => (
                    <div className="flex w-full bg-gray-50 rounded-xl mb-3" key={"orders_"+index}>
                      <div className="w-[80%] flex flex-col items-center justify-center">
                        <div className="w-full text-center text-xl"><p><a className={item.side=="A"?"text-red-500":"text-green-500"} >{item.side=="A"?"Short":"Long"}</a>  {item.coin} <a className={"text-sm bg-gray-200"}>{item.limitPx} $</a> </p></div>
                      
                        <div className="w-full text-center">
                          <p>
                              <a  className="bg-gray-200   font-bold ">{item.origSz} {item.coin}</a>  <a  className="bg-gray-200   font-bold ">{Number(item.limitPx)*Number(item.origSz)}$</a>
                          </p>
                        </div>

                        <div className="w-full text-center">
                          <p>
                              {(new Date(item.timestamp)).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="w-[20%]  font-bold flex flex-col items-center justify-center">
                        <button className="w-full text-xl rounded-xl w-24 bg-white hover:bg-gray-400 transition text-center py-2 rounded shadow-lg"
                        onClick={
                          async()=>
                          {
                            const cancel = await cancelOrder(
                              getWallet(),
                              {
                                symbol:item.coin,
                                id:item.oid
                              }
                            )
                            console.log(cancel)
                            await updateOrders()
                          }
                        }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>

          </Card>
        </div>
        :
        null
        }



      </div>
    </div>
  );
};

export default Dashboard;
