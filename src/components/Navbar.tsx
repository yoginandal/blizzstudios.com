"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from "./HamburgerMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 w-full fixed top-0 z-[1000]">
      {/* Logo on the left */}
      <Link href="/" className="text-xl font-bold">
        <Image
          src="https://blizzstudios.com/wp-content/uploads/2024/03/logo_HorWB.svg"
          alt="Logo"
          width={96}
          height={24}
          className="w-60"
        />
      </Link>

      {/* Navigation and Hamburger on the right */}
      <div className="flex items-center h-full">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 mr-16 mt-[-10px] font-montserrat">
          <Link href="/" className="text-gray-800 font-semibold">
            Home
          </Link>
          <Link href="/services" className="text-gray-800 font-semibold">
            Services
          </Link>
          <Link href="/about-us" className="text-gray-800 font-semibold">
            About Us
          </Link>
          <Link href="/contact-us" className="text-gray-800 font-semibold">
            Contact Us
          </Link>
        </div>

        <div className="h-full flex items-center">
          <HamburgerMenu toggleMenu={toggleMenu} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <nav
        className={`absolute top-16 left-0 w-full bg-gray-100 py-6 flex flex-col items-center space-y-4 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <Link href="/" className="text-gray-800">
          Home
        </Link>
        <Link href="/services" className="text-gray-800">
          Services
        </Link>
        <Link href="/about-us" className="text-gray-800">
          About Us
        </Link>
        <Link href="/contact-us" className="text-gray-800">
          Contact Us
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;
