import React from 'react'
import logo from '../assets/logo.png';
import { Search, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';


function AuthPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className='grid sm:grid-cols-2 grid-cols-2 md:p-6 p-4 sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60'>
        <div className='flex m-2'>
          <img src={logo} alt="logo" className='max-w-[35px] max-h-[35px]' />
          <h1 className='font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent'>killHub</h1>
        </div>
        <div className='hidden md:flex md:justify-end items-center gap-2'>
          <Button variant="ghost">
            Sign In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Admin
          </Button>
        </div>
        <Button
          variant="ghost"
          className="md:hidden flex justify-end"
          onClick={() => setIsAuthPanelOpen(true)}
        >
          Sign In
        </Button>
      </div>
      <div className='flex sm:flex-col flex-col items-center text-center md:mt-24 mt-20'>
        <h1 className='text-6xl! md:text-7xl! font-bold! mb-8 bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent leading-tight'>Hire skills near you, anytime!</h1>
        <p className='text-2xl! text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed'>Connect with skilled professionals in your area for any service you need. Fast, reliable, and trusted by thousands.</p>
        <div className='flex flex-col sm:flex-row gap-3 max-w-3xl mx-auto mb-12'>
          <div className='flex-1 relative'>
            <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground'></Search>
            <Input type="text" placeholder='Search skill or service, e.g. Electrician' className='pl-12 h-14 text-lg bg-card border-2 border-border/60 shadow-lg focus:shadow-xl focus:border-(--primary-gradient-start) transition-all duration-200' />
          </div>
          <Button className='h-14 px-10 text-lg bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'>Find Skills</Button>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span>10,000+ Happy Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            <span>24/7 Support</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-(--primary-gradient-start)" />
            <span>50+ Cities</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
