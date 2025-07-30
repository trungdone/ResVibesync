"use client";

import Link from "next/link";
import { SiVisa, SiMastercard, SiAmericanexpress } from "react-icons/si";

export default function PremiumPage() {
  return (
    <main className="text-white bg-black">
      {/* Hero Section */}
      <section className="min-h-[70vh] bg-gradient-to-r from-purple-800 to-blue-800 flex flex-col items-center justify-center text-center px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Listen without limits. Try 2 months of Premium for <span className="text-white">₫59,000</span>.
        </h1>
        <p className="text-lg mb-6">
          Only ₫59,000/month after. Cancel anytime.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition">
            Try 2 months for ₫59,000
          </button>
          <Link
            href="#plans"
            className="px-6 py-3 border border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition"
          >
            View all plans
          </Link>
        </div>
        <p className="text-xs text-white/80 mt-4 max-w-xl">
          ₫59,000 for 2 months, then ₫59,000 per month after. Offer only available if you haven't tried Premium before. <Link href="#" className="underline">Terms apply</Link>.
        </p>
      </section>

      {/* All Premium Plans Include */}
      <section className="py-12 px-6 text-center bg-black">
        <h2 className="text-3xl font-bold mb-6">All Premium plans include</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-lg max-w-6xl mx-auto">
          {[
            "Ad-free music listening",
            "Download to listen offline",
            "Play songs in any order",
            "High audio quality",
            "Listen with friends in real time",
            "Organize listening queue",
          ].map((feature) => (
            <li key={feature} className="bg-white/5 py-4 px-6 rounded-lg">
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Premium Plans */}
      <section id="plans" className="py-12 px-6 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Individual Plan */}
          <div className="border border-gray-700 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-2">Premium Individual</h3>
            <p className="text-xl mb-4">₫59,000 for 2 months</p>
            <p className="text-gray-400 mb-4">₫59,000 / month after</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>1 Premium account</li>
              <li>Cancel anytime</li>
              <li>Subscribe or one‑time payment</li>
            </ul>
            <p className="text-xs text-gray-500 mb-4">
              ₫59,000 for 2 months, then ₫59,000 per month after. Offer only available if you haven't tried Premium before. <Link href="#" className="underline">Terms apply</Link>.
            </p>
            <button className="w-full bg-purple-600 py-2 rounded-full font-bold hover:bg-purple-700 transition">
              Try Individual
            </button>
          </div>

          {/* Student Plan */}
          <div className="border border-gray-700 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-2">Premium Student</h3>
            <p className="text-xl mb-4">₫29,500 for 2 months</p>
            <p className="text-gray-400 mb-4">₫29,500 / month after</p>
            <ul className="list-disc list-inside mb-4 space-y-1">
              <li>1 verified Premium account</li>
              <li>Discount for eligible students</li>
              <li>Cancel anytime</li>
            </ul>
            <p className="text-xs text-gray-500 mb-4">
              ₫29,500 for 2 months, then ₫29,500 per month after. Offer available only to students at an accredited higher education institution and if you haven't tried Premium before. <Link href="#" className="underline">Terms apply</Link>.
            </p>
            <button className="w-full bg-purple-600 py-2 rounded-full font-bold hover:bg-purple-700 transition">
              Try Student
            </button>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      {/* Affordable Plans Section */}
      <section className="py-12 px-6 bg-[#121212] text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Affordable plans for any situation</h2>
        <p className="text-lg mb-8 max-w-3xl mx-auto">
          Choose a Premium plan and listen to ad-free music without limits on your phone,
          speaker, and other devices. Pay in various ways. Cancel anytime.
        </p>

        {/* ✅ Payment icons via react-icons */}
        <div className="flex justify-center flex-wrap gap-6 mb-4">
        <div className="bg-white rounded-md p-2 w-14 h-10 flex items-center justify-center">
        <SiVisa size={28} color="#1a1f71" />
        </div>
        <div className="bg-white rounded-md p-2 w-14 h-10 flex items-center justify-center">
        <SiMastercard size={28} color="#eb001b" />
         </div>
        <div className="bg-white rounded-md p-2 w-14 h-10 flex items-center justify-center">
        <SiAmericanexpress size={28} color="#2e77bb" />
        </div>
        </div>

        <p className="text-sm underline text-white cursor-pointer hover:text-purple-400 transition">
          + 2 more
        </p>
      </section>

      <section className="py-12 px-6 bg-black text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">Experience the difference</h2>
        <p className="text-center mb-8">Go Premium and enjoy full control of your listening. Cancel anytime.</p>
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto table-auto border border-gray-700">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-3">What you'll get</th>
                <th className="p-3 text-center">Free</th>
                <th className="p-3 text-center">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                "Ad-free music listening",
                "Download songs",
                "Play songs in any order",
                "High quality audio",
                "Listen with friends in real time",
                "Organize listening queue",
              ].map((feature) => (
                <tr key={feature} className="border-t border-gray-700">
                  <td className="p-3">{feature}</td>
                  <td className="text-center text-gray-500">—</td>
                  <td className="text-center text-green-500 font-bold">✓</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
