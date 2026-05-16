"use client";

import { useEffect, useState } from "react";
import { getHistory } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Database, Search, Filter, ShieldCheck, Skull, ArrowLeft, ExternalLink, Calendar, Server } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserButton } from "@clerk/nextjs";

export default function ThreatHistory() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory();
        setHistory(data || []);
      } catch (err) {
        console.error("Failed to load history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.target.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.results?.threat_type || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";

// ... existing code ...

  return (
    <>
      <SignedIn>
        <div className="flex flex-col min-h-screen bg-[#030303] text-white relative overflow-hidden">
          {/* Background styling */}
          <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
          <div className="fixed top-0 right-1/4 w-[800px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />

          <header className="flex h-16 items-center px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50 sticky top-0 gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to SOC</span>
            </Link>
            <div className="h-6 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Database className="w-4 h-4 text-indigo-400" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Threat Database</span>
            </div>
            <div className="ml-auto">
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>

          <div className="relative z-10 p-6 max-w-[1400px] mx-auto w-full">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Historical Incident Logs</h1>
                <p className="text-white/40 text-sm">Persistent records from the Neon PostgreSQL cloud database.</p>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <Input 
                    placeholder="Search threats..." 
                    className="bg-white/5 border-white/10 pl-9 text-white placeholder:text-white/30 focus-visible:ring-indigo-500/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-sm font-medium transition-colors">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/30">
                <Server className="w-12 h-12 mb-4 animate-pulse opacity-50" />
                <p>Querying Neon Database...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {filteredHistory.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card className="border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors overflow-hidden backdrop-blur-md relative group">
                        {/* Status Indicator Bar */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.results?.severity === 'Critical' ? 'bg-red-500' : item.results?.severity === 'High' ? 'bg-orange-500' : item.results?.severity === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                        
                        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center gap-6">
                          
                          {/* Left: Core Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider ${item.results?.severity === 'Critical' || item.results?.severity === 'High' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'}`}>
                                {item.results?.severity || 'Low'} Risk
                              </Badge>
                              <span className="text-sm font-semibold text-white/90 truncate">
                                {item.results?.threat_type || 'Suspicious Content'}
                              </span>
                            </div>
                            <p className="text-white/60 text-sm truncate font-mono bg-black/30 px-2 py-1 rounded inline-block w-full">
                              {item.target}
                            </p>
                          </div>

                          {/* Middle: Metadata */}
                          <div className="flex flex-col gap-2 min-w-[200px]">
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(item.created_at).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-white/40">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Score: <span className="text-white/80 font-mono">{item.results?.risk_score || 0}/100</span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex gap-3">
                            <Link href={`/investigate/${item.id}`}>
                              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-md text-sm font-medium transition-colors">
                                <ExternalLink className="w-4 h-4" /> View Report
                              </button>
                            </Link>
                          </div>

                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredHistory.length === 0 && !loading && (
                  <div className="text-center py-20 text-white/40">
                    <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No threats found in the database.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
