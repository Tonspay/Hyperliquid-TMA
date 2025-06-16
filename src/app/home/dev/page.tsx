'use client';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import Card from 'components/card';
import {
  useDisclosure,
} from '@chakra-ui/react'
import { config } from "../../../core/config";
import { useEffect, useState } from "react";
import { search_token_by_id } from "core/utils";
const Dashboard = () => {

  useEffect(() => {

  }, []);

  return (
      <div className="p-5 space-y-5 mt-5 block w-full justify-items-center">

        <div className="w-full max-w-md mx-auto">
        <Card extra="rounded-[20px] p-3">
          <div className="flex gap-2.5 justify-center">
                    <div className="flex flex-col border-dashed border-2 border-divider py-2 px-6 rounded-xl">
                      <span className="text-default-900 text-xl font-semibold">
                        👷 Page Building 👷
                      </span>
                    </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
