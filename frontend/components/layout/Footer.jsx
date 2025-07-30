"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 px-6 py-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
        {/* Column 1: Company */}
        <div>
          <h3 className="text-white font-bold mb-3">Company</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
            <li><Link href="/record" className="hover:text-white">For the Record</Link></li>
          </ul>
        </div>

        {/* Column 2: Community */}
        <div>
          <h3 className="text-white font-bold mb-3">Community</h3>
          <ul className="space-y-2">
            <li><Link href="/artists" className="hover:text-white">For Artists</Link></li>
            <li><Link href="/developers" className="hover:text-white">Developers</Link></li>
            <li><Link href="/ads" className="hover:text-white">Advertising</Link></li>
            <li><Link href="/investors" className="hover:text-white">Investors</Link></li>
            <li><Link href="/suppliers" className="hover:text-white">Suppliers</Link></li>
          </ul>
        </div>

        {/* Column 3: Useful Links */}
        <div>
          <h3 className="text-white font-bold mb-3">Useful Links</h3>
          <ul className="space-y-2">
            <li><Link href="/support" className="hover:text-white">Support</Link></li>
            <li><Link href="/app" className="hover:text-white">Free Mobile App</Link></li>
            <li><Link href="/regions" className="hover:text-white">Global Access</Link></li>
          </ul>
        </div>

        {/* Column 4: VibeSync Plans */}
        <div>
          <h3 className="text-white font-bold mb-3">VibeSync Plans</h3>
          <ul className="space-y-2">
            <li><Link href="/plans/individual" className="hover:text-white">Premium Individual</Link></li>
            <li><Link href="/plans/student" className="hover:text-white">Premium Student</Link></li>
            <li><Link href="/plans/free" className="hover:text-white">VibeSync Free</Link></li>
          </ul>
        </div>

        {/* Column 5: Social Media */}
        <div className="flex md:justify-end gap-4 items-start">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700"
          >
            <Twitter size={20} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center hover:bg-neutral-700"
          >
            <Facebook size={20} />
          </a>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-neutral-800 mt-8 pt-4 text-xs text-center text-neutral-500">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <Link href="/legal" className="hover:underline">Legal</Link>
          <Link href="/safety" className="hover:underline">Safety & Privacy Center</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/cookies" className="hover:underline">Cookies</Link>
          <Link href="/ads-info" className="hover:underline">About Ads</Link>
          <Link href="/accessibility" className="hover:underline">Accessibility</Link>
        </div>
        &copy; {new Date().getFullYear()} VibeSync AB. All rights reserved.
      </div>
    </footer>
  );
}
