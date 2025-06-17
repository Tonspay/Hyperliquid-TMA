"use client";
import { redirect } from 'next/navigation';
import { useEffect, useRef, useState } from "react";

const Dashboard = () => {
  useEffect(() => {
    redirect('/home/wallet');
    }, []);
  return (
      <div className="p-5 space-y-5 mt-5 block w-full justify-items-center">
    </div>
  );
};

export default Dashboard;
