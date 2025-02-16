'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Lexend_Deca } from 'next/font/google';
import { useEffect, useRef, useState } from 'react';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '700'], // Regular and Bold
  display: 'swap',
});

export default function Home() {
  const container = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lastSlideChange, setLastSlideChange] = useState(Date.now());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeSinceLastChange = Date.now() - lastSlideChange;
      if (timeSinceLastChange >= 5000) {
        setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
        setLastSlideChange(Date.now());
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [lastSlideChange]);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      setIsMenuOpen(false);
    }, 500);
  };

  const handleSlideChange = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
    setLastSlideChange(Date.now());
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleSlideChange(currentSlide === 0 ? 1 : 0);
    } else if (isRightSwipe) {
      handleSlideChange(currentSlide === 1 ? 0 : 1);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setMouseStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStart !== null && isDragging) {
      setMouseEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (mouseStart === null || mouseEnd === null || !isDragging) return;

    const distance = mouseStart - mouseEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleSlideChange(currentSlide === 0 ? 1 : 0);
    } else if (isRightSwipe) {
      handleSlideChange(currentSlide === 1 ? 0 : 1);
    }

    setMouseStart(null);
    setMouseEnd(null);
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setMouseStart(null);
    setMouseEnd(null);
    setIsDragging(false);
  };

  return (
    <main className={`${lexendDeca.className} text-white min-h-screen`}>
      {/* Header */}
      <motion.header
        ref={container}
        className='px-4 bg-secondary shadow-lg fixed w-full top-0 z-50'
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollY > 50 ? 0.6 : 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <div className='flex justify-between items-center'>
          <div className='text-3xl font-bold text-primary flex items-center gap-2'>
            <Image
              src='/safu_ubg.png'
              alt='SAFU Logo'
              width={96}
              height={96}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden text-primary p-2'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className='hidden md:block'>
            <ul className='flex space-x-6'>
              <li>
                <Link
                  href='#about'
                  className='hover:text-primary'
                  onClick={(e) => scrollToSection(e, 'about')}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href='#tokenomics'
                  className='hover:text-primary'
                  onClick={(e) => scrollToSection(e, 'tokenomics')}
                >
                  Tokenomics
                </Link>
              </li>
              <li>
                <Link
                  href='#roadmap'
                  className='hover:text-primary'
                  onClick={(e) => scrollToSection(e, 'roadmap')}
                >
                  Roadmap
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className='md:hidden'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className='py-4 space-y-4'>
                <li>
                  <Link
                    href='#about'
                    className='block hover:text-primary'
                    onClick={(e) => scrollToSection(e, 'about')}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href='#tokenomics'
                    className='block hover:text-primary'
                    onClick={(e) => scrollToSection(e, 'tokenomics')}
                  >
                    Tokenomics
                  </Link>
                </li>
                <li>
                  <Link
                    href='#roadmap'
                    className='block hover:text-primary'
                    onClick={(e) => scrollToSection(e, 'roadmap')}
                  >
                    Roadmap
                  </Link>
                </li>
              </ul>
            </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero SAFU */}
      <motion.div
        className='relative h-screen shadow-2xl rounded-b-lg'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          userSelect: isDragging ? 'none' : 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div className='absolute inset-0'>
          <AnimatePresence mode='wait'>
            <motion.section
              key='slide1'
              className='absolute inset-0 flex flex-col items-center justify-center text-center p-6'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src='/hero1.png'
                alt='Astronaut Placeholder'
                className='absolute inset-0 w-full h-full object-cover opacity-50 rounded-b-lg shadow-2xl'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                draggable={false}
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className='relative z-10'
              >
                <h1 className='text-[3rem] font-[800] text-primary'>
                  SAFU ON BSC
                </h1>
                <p
                  className={`${lexendDeca.className} mt-4 text-[1.875rem]  text-white max-w-xl mx-auto font-extrabold leading-relaxed`}
                >
                  The most SAFU meme token on Binance Smart Chain.
                </p>
                <div className='mt-6 flex space-x-4 justify-center'>
                  <a
                    href='https://meta.impact.fun/share/pot/0x6f20235345f3385FB761F46Be0F324046CdA79B9'
                    target='_blank'
                    className='px-6 py-3 text-lg font-bold bg-primary text-secondary rounded-lg shadow-lg hover:scale-105 transition'
                  >
                    Buy Now
                  </a>
                  <a
                    href='https://t.me/safu_0x'
                    target='_blank'
                    className='px-6 py-3 text-lg font-bold bg-gray text-white rounded-lg shadow-lg hover:scale-105 transition'
                  >
                    Join Telegram
                  </a>
                </div>
              </motion.div>
            </motion.section>
          </AnimatePresence>
        </div>

        {/* Slider Dots */}
        <div className='absolute bottom-8 left-0 right-0 flex justify-center space-x-2'>
          <button
            onClick={() => handleSlideChange(0)}
            className={`w-3 h-3 rounded-full bg-primary transition-opacity cursor-pointer ${
              currentSlide === 0 ? 'opacity-100' : 'opacity-50 hover:opacity-75'
            }`}
            aria-label='Go to slide 1'
          />
        </div>
      </motion.div>
      {/* About Section */}
      <motion.section
        id='about'
        className='p-12'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className='text-[2rem] font-[800] text-secondary text-center mb-12'>
          About SAFU
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {/* Who We Are */}
          <div className='bg-secondary p-6 rounded-lg shadow-lg shadow-black/25'>
            <div className='text-primary text-4xl mb-4 flex justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-primary mb-4'>Who We Are</h3>
            <p className='text-gray-300'>
              A community-driven project focused on bringing safety and security
              to the BSC ecosystem through innovative tokenomics and strong
              community governance.
            </p>
          </div>

          {/* Why SAFU */}
          <div className='bg-secondary p-6 rounded-lg shadow-lg shadow-black/25'>
            <div className='text-primary text-4xl mb-4 flex justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-primary mb-4'>Why SAFU</h3>
            <p className='text-gray-300'>
              Built with security at its core, SAFU implements rigorous safety
              measures including locked liquidity, audited smart contracts, and
              transparent team operations.
            </p>
          </div>

          {/* Community Benefits */}
          <div className='bg-secondary p-6 rounded-lg shadow-lg shadow-black/25'>
            <div className='text-primary text-4xl mb-4 flex justify-center'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-16 w-16'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-2xl font-bold text-primary mb-4'>
              Community Benefits
            </h3>
            <p className='text-gray-300'>
              Join a thriving ecosystem with regular rewards, community events,
              and the opportunity to participate in key project decisions
              through our governance system.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Tokenomics Section */}
      <motion.section
        id='tokenomics'
        className='p-12 bg-secondary'
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <h2 className='text-[2rem] font-[800] text-primary text-center'>
          Tokenomics
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto'>
          {/* Left Column - Tokenomics Chart */}
          <div className='bg-[#1a1a1a] p-8 rounded-lg shadow-lg flex items-center justify-center'>
            <Image
              src='/safu_ubg.png'
              alt='Tokenomics Distribution'
              width={400}
              height={400}
              className='rounded-lg w-[100px] md:w-[400px]'
              draggable={false}
            />
          </div>

          {/* Right Column - Tokenomics Details */}
          <div className='bg-[#1a1a1a] p-8 rounded-lg shadow-lg space-y-6 flex flex-col justify-center'>
            <div className='flex items-center space-x-4'>
              <svg
                className='h-8 w-8 text-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              <div>
                <h3 className='text-xl font-bold text-primary'>Total Supply</h3>
                <p className='text-gray-300'>- SAFU</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <svg
                className='h-8 w-8 text-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
              <div>
                <h3 className='text-xl font-bold text-primary'>
                  Token Allocation:
                </h3>
                <p className='text-gray-300'>
                  🎯 Creator - 50%, Participants - 49%, Liquidity - 1%
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <svg
                className='h-8 w-8 text-primary'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
              <div>
                <h3 className='text-xl font-bold text-primary'>
                  Community Driven
                </h3>
                <p className='text-gray-300'>
                  Fair launch with community governance
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className='p-6 bg-secondary text-center mt-auto'>
        <h3 className='text-xl font-bold text-primary'>Follow Us</h3>
        <div className='flex justify-center space-x-6 mt-4'>
          <a
            href='https://x.com/safu_0x'
            target='_blank'
            className='text-gray-300 hover:text-primary'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' />
            </svg>
            <span className='sr-only'>Twitter</span>
          </a>
          <a
            href='https://t.me/safu_0x'
            target='_blank'
            className='text-gray-300 hover:text-primary'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path d='M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z' />
            </svg>
            <span className='sr-only'>Telegram</span>
          </a>
        </div>
        <p className='mt-4 text-gray-500'>
          © {new Date().getFullYear()} SAFU. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
