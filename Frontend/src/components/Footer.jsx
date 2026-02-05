import React from 'react'
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate()
  return (
    <footer className="py-12 px-6 border-t border-border bg-secondary/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3  gap-2 mb-4">
                <div className="w-10 h-10 bg-linear-to-br from-(--primary-gradient-start) to-(--primary-gradient-end) rounded-xl flex items-center justify-center text-white shadow-lg">
                  <span className="font-bold text-lg">S</span>
                </div>
                <h1 className="font-bold text-xl bg-linear-to-r from-(--primary-gradient-start) to-(--primary-gradient-end) bg-clip-text text-transparent">
                  SkillHub
                </h1>
              </div>
              <p className="text-muted-foreground">
                Connecting people with skilled professionals for all their service needs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li onClick={()=>navigate("/how-it-works")}>How it works</li>
                <li>Browse services</li>
                <li>Safety</li>
                <li>Support</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Providers</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>Become a provider</li>
                <li>Provider resources</li>
                <li>Community</li>
                <li>Tools</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>About us</li>
                <li>Careers</li>
                <li>Blog</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SkillHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
  )
}

export default Footer
