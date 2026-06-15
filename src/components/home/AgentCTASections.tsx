import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Shield, Star, MessageCircle, ArrowRight, Home, Calculator, Bell } from 'lucide-react';
import { agents } from '../../data/properties';

/* ── AGENT SECTION ── */
export function AgentSection() {
  return (
    <section className="py-24 bg-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-brand-600 text-sm font-semibold tracking-widest uppercase mb-3">
              Verified Professionals
            </p>
            <h2 className="font-display font-semibold text-ink-900 leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Meet Our Top Agents
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md">
              Every agent is background-checked, licensed, and reviewed by real clients. No middlemen. No surprises.
            </p>
          </div>
          <Link to="/agents" className="flex items-center gap-2 text-brand-700 font-semibold text-sm hover:gap-3 transition-all">
            All Agents <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-100 hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className="relative w-16 h-16 mx-auto mb-4">
                <img
                  src={agent.photo}
                  alt={agent.name}
                  className="w-full h-full rounded-full object-cover bg-brand-100"
                />
                {agent.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand-700 rounded-full flex items-center justify-center">
                    <Shield size={11} className="text-white" />
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{agent.name}</h3>
              <p className="text-xs text-gray-400 mb-3">{agent.agency}</p>

              <div className="flex items-center justify-center gap-3 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Star size={11} className="text-amber-500 fill-amber-500" />
                  {agent.rating}
                </span>
                <span className="text-gray-200">|</span>
                <span>{agent.deals} deals</span>
              </div>

              <a
                href={`https://wa.me/${agent.phone.replace(/\D/g, '')}?text=Hello ${encodeURIComponent(agent.name)}, I found you on NestHaven and I'd like to enquire about a property.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA SECTION ── */
export function CTASection() {
  const actions = [
    {
      icon: Home,
      title: 'List Your Property',
      desc: 'Reach thousands of verified buyers and tenants. Free listing, maximum exposure.',
      href: '/list-property',
      cta: 'List for Free',
      color: 'bg-brand-700',
    },
    {
      icon: Calculator,
      title: 'Move-In Cost Calculator',
      desc: 'Calculate rent, agency fee, legal fee, and caution deposit before you commit.',
      href: '/calculator',
      cta: 'Calculate Now',
      color: 'bg-amber-500',
    },
    {
      icon: Bell,
      title: 'Get Property Alerts',
      desc: "Tell us what you want. We'll notify you the moment a matching property is listed.",
      href: '/alerts',
      cta: 'Set Up Alerts',
      color: 'bg-sky-600',
    },
  ];

  return (
    <section className="py-24 bg-forest-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display font-semibold text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Everything You Need,<br />
            <span className="text-amber-400">Right Here</span>
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">
            Whether you're buying, renting, or selling — NestHaven has every tool you need to make confident property decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {actions.map(({ icon: Icon, title, desc, href, cta, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:bg-white/8 hover:border-white/20 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={22} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-6">{desc}</p>
              <Link
                to={href}
                className={`inline-flex items-center gap-2 px-5 py-2.5 ${color} text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity`}
              >
                {cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
