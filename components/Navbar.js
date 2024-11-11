"use client";
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import logo from '@/assets/logo.png'
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { logout, checkAuth } from '@/redux/features/auth';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const error = useSelector(state => state.auth.error);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isAuthenticated);
  }, [isAuthenticated]);

  // Check authentication status on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className='border flex items-center justify-between py-2 sm:py-0 px-2'>
      <Link href='/' className='flex items-center'>
        <Image src={logo} alt="logo" height={80} className='hidden sm:inline' />
        <Image src={logo} alt="logo" height={50} className='sm:hidden' />
        <p className='text-[#2b7137] text-xl sm:text-3xl mt-2 sm:mt-4' style={{ fontFamily: "fantasy" }}>Tracking</p>
      </Link>
      <div className='mx-4'>
        {loggedIn ?
          <button
            className="bg-[#2b7137] hover:bg-[#20522b] text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded"
            onClick={handleLogout}
          >
            Sign Out
          </button> :
          <></>
          // <button
          //   className="bg-[#2b7137] hover:bg-[#20522b] text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded"
          //   onClick={() => { router.push('/login') }}
          // >
          //   Login
          // </button>
        }
      </div>
    </div>
  )
}

export default Navbar
