"use client";
import Image from 'next/image'
import React, { useState } from 'react'
import logo from '@/assets/logo.png'
import Link from 'next/link';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className='border flex items-center justify-between px-2'>
      <Link href='/' className='flex items-center'>
        <Image src={logo} alt="logo" height={80} />
        <p className='text-[#2b7137] text-3xl mt-4' style={{ fontFamily: "fantasy" }}>Tracking</p>
      </Link>
      <div className='mx-4'>
        <button
          className="bg-[#2b7137] hover:bg-[#20522b] text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          {isLoggedIn ? 'Sign Out' : 'Login'}
        </button>
      </div>
    </div>
  )
}

export default Navbar
