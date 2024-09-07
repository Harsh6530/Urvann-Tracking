"use client";
import Image from 'next/image'
import React, { useEffect } from 'react'
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

  // Check authentication status on component mount
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className='border flex items-center justify-between px-2'>
      <Link href='/' className='flex items-center'>
        <Image src={logo} alt="logo" height={80} />
        <p className='text-[#2b7137] text-3xl mt-4' style={{ fontFamily: "fantasy" }}>Tracking</p>
      </Link>
      <div className='mx-4'>
        {isAuthenticated ?
          <button
            className="bg-[#2b7137] hover:bg-[#20522b] text-white font-bold py-2 px-4 rounded"
            onClick={handleLogout}
          >
            Sign Out
          </button> :
          <button
            className="bg-[#2b7137] hover:bg-[#20522b] text-white font-bold py-2 px-4 rounded"
            onClick={() => { router.push('/login') }}
          >
            Login
          </button>
        }
      </div>
    </div>
  )
}

export default Navbar
