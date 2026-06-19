import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function CalculatorPage() {
  const [rent, setRent] = useState<string>('3500000');
  const [agencyPct, setAgencyPct] = useState<string>('10');
  const [legalPct, setLegalPct] = useState<string>('5');
  const [cautionPct, setCautionPct] = useState<string>('10');

  const result = useMemo(() => {
    const r = parseFloat(rent) || 0;
    const agencyFee = r * (parseFloat(agencyPct) || 0) / 100;
    const legalFee = r * (parseFloat(legalPct) || 0) / 100;
    const cautionFee = r * (parseFloat(cautionPct) || 0) / 100;
    const total = r + agencyFee + legalFee + cautionFee;
    return { rent: r, agencyFee, legalFee, cautionFee, total };
  }, [rent, agencyPct, legalPct, cautionPct]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);

  const rows = [
    { label: 'Annual Rent', value: result.rent, note: 'Base figure' },
    { label: 'Agency Fee', value: result.agencyFee, note: `${agencyPct || 0}% of rent` },
    { label: 'Legal Fee', value: result.legalFee, note: `${legalPct || 0}% of rent` },
    { label: 'Caution Deposit', value: result.cautionFee, note: `${cautionPct || 0}% — refundable` },
  ];

  return (
    <main className="bg-[#F9F6F0] min-h-screen pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link to="/" className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-500 hover:text-amber-600 transition-colors mb-10">
          <ArrowLeft size={14} /> Back Home
        </Link>

        <div className="max-w-2xl mb-12 space-y-4">
          <p className="text-amber-600 text-xs font-bold tracking-[0.25em] uppercase">
            // MOVE-IN COST CALCULATOR
          </p>
          <h1
            className="font-serif font-light text-neutral-900 leading-[1.1] tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
          >
            Know Your <span className="font-serif italic text-neutral-700">Total Cost</span>
          </h1>
          <p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
            Calculate rent, agency fee, legal fee, and caution deposit before you commit to a property.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-5 bg-white border border-neutral-200 p-8 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Calculator size={16} className="text-amber-600" />
              <h2 className="font-sans font-black text-neutral-900 text-xs tracking-wider uppercase">Inputs</h2>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Annual Rent (₦)</label>
              <input
                type="number" value={rent} onChange={e => setRent(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Agency Fee (%)</label>
              <input
                type="number" value={agencyPct} onChange={e => setAgencyPct(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Legal Fee (%)</label>
              <input
                type="number" value={legalPct} onChange={e => setLegalPct(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1.5">Caution Deposit (%)</label>
              <input
                type="number" value={cautionPct} onChange={e => setCautionPct(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-amber-600 transition-colors font-mono"
              />
            </div>

            <p className="text-[10px] text-neutral-400 leading-relaxed pt-2">
              Default percentages reflect typical Port Harcourt market rates. Adjust to match your specific listing.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white border border-neutral-200 overflow-hidden">
              {rows.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-center justify-between px-6 py-4 ${i < rows.length - 1 ? 'border-b border-neutral-100' : ''}`}
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{row.label}</p>
                    <p className="text-[10px] font-mono text-neutral-400">{row.note}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold text-neutral-900">{fmt(row.value)}</p>
                </div>
              ))}

              <div className="bg-neutral-950 px-6 py-6 flex items-center justify-between">
                <p className="text-xs font-bold tracking-widest uppercase text-neutral-400">Total Move-In Cost</p>
                <p className="font-mono text-xl font-bold text-amber-400">{fmt(result.total)}</p>
              </div>
            </div>

            <Link
              to="/listings"
              className="mt-6 inline-flex items-center gap-3 text-xs font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-amber-600 px-6 py-3.5 transition-colors"
            >
              Browse Listings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
