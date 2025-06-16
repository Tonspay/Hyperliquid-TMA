import React from 'react';

// Admin Imports

// Icon Imports
import { CgProfile } from "react-icons/cg";
import { RiStockLine } from "react-icons/ri";
import { AiOutlineStock } from "react-icons/ai";
import { MdContactSupport } from "react-icons/md";
import { TbBrandGithub } from "react-icons/tb";
const routes = [
  {
    name: 'My Wallet',
    layout: '/home',
    path: '/',
    icon: <CgProfile className="h-6 w-6" />,
  },
  {
    name: 'Trade',
    layout: '/home',
    path: 'dev',
    icon: <RiStockLine className="h-6 w-6" />,

    secondary: true,
  },
  // {
  //   name: 'Future Trading',
  //   layout: '/home',
  //   icon: <AiOutlineStock className="h-6 w-6" />,
  //   path: 'dev',
  // },
  {
    name: 'Support',
    layout: '/links',
    path: "http://t.me/TonspaySupport_bot",
    icon: <MdContactSupport className="h-6 w-6" />,
  },
  {
    name: 'Source-Code',
    layout: '/links',
    path: 'https://github.com/Tonspay',
    icon: <TbBrandGithub className="h-6 w-6" />,
  }
];
export default routes;
