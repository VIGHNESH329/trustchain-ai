"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Activity, Search, BrainCircuit, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(0,0,0,0))]" />

      {/* Navbar */}
      <header className="flex h-20 items-center px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Trust Chain AI</span>
        </div>
        <nav className="ml-auto flex gap-8 items-center">
          <Link href="#features" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Platform</Link>
          <Link href="#workflow" className="text-sm font-medium text-white/60 hover:text-white transition-colors">Technology</Link>
          <Link href="/dashboard">
            <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/10 text-white bg-transparent">
              Access Dashboard
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col relative z-10">
        {/* Hero Section */}
        <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 max-w-5xl"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400 mb-8 backdrop-blur-md"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
              Event-Driven Autonomous Security
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/30">
              Trust Chain <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">AI</span>
            </h1>
            <p className="text-xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Trust Chain AI is an enterprise-grade autonomous threat intelligence platform. It deploys continuous monitoring agents that instantly detect, reason about, and neutralize phishing, scams, and malware in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/investigate">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg group bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)]">
                  Launch Investigation
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">The Neural Architecture</h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">Six specialized AI agents working synchronously to dissect threats with military-grade precision.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Event Monitoring", desc: "Listens to webhooks and API events in real-time, instantly capturing suspicious activity.", icon: Activity, color: "from-blue-500 to-cyan-500" },
                { title: "OCR / Image Parsing", desc: "Extracts text and visual scam indicators from uploaded screenshots and attachments.", icon: Search, color: "from-purple-500 to-pink-500" },
                { title: "Detection Engine", desc: "Classifies payload intents, determining threat types and calculating initial risk scores.", icon: ShieldAlert, color: "from-red-500 to-orange-500" },
                { title: "Threat Intelligence", desc: "Cross-references VirusTotal, WHOIS, and global blacklists to verify domain reputation.", icon: BrainCircuit, color: "from-green-500 to-emerald-500" },
                { title: "Deep Reasoning", desc: "Applies cognitive logic to understand social engineering tactics, urgency, and fear language.", icon: Search, color: "from-indigo-500 to-blue-500" },
                { title: "Autonomous Response", desc: "Fires webhooks to update SOC dashboards, notify guardians, and generate remediation plans.", icon: Activity, color: "from-yellow-500 to-orange-500" }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group relative p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`} />
                  <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-gradient-to-br ${feature.color} bg-opacity-10 border border-white/10`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white/90">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
