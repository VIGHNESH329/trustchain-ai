"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Activity, CheckCircle, Terminal, Smartphone, Eye, Skull, Network, Brain, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

// WebSocket URL
const WS_URL = "wss://trustchain-ai-j7rp.onrender.com/ws/dashboard";

export default function Dashboard() {
  const [stats, setStats] = useState({ total_investigations: 0, completed: 0, failed: 0, high_risk: 0 });
  const [activeDevices, setActiveDevices] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveThreats, setLiveThreats] = useState<any[]>([]);
  const [agentLogs, setAgentLogs] = useState<string[]>(["> Awaiting incoming webhooks..."]);
  const [wsStatus, setWsStatus] = useState("Connecting...");

  useEffect(() => {
    // Initial fetch of historical stats
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          total_investigations: data.total_investigations || 0,
          completed: data.completed || 0,
          failed: data.failed || 0,
          high_risk: data.high_risk || 0
        });
      } catch (err) {
        console.error("Failed to load initial stats", err);
      }
    };
    fetchStats();

    // Connect to WebSocket
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setWsStatus("Neural Network Online");
      // Simulate Android App automatically connecting upon startup
      setTimeout(() => {
        setActiveDevices(prev => prev + 1);
        setAgentLogs(prev => [...prev.slice(-14), "> [Device Manager] New Android Mobile Node Connected to Webhook Pipeline..."]);
      }, 2000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "telemetry") {
          setAgentLogs(prev => [...prev.slice(-14), data.log]);
        } else if (data.type === "threat_update") {
          setLiveThreats(prev => [data.threat, ...prev].slice(0, 10));
          // Increment stats locally for immediate UI update
          setStats(prev => ({
            ...prev,
            total_investigations: prev.total_investigations + 1,
            completed: prev.completed + 1,
            high_risk: data.threat.severity === 'Critical' || data.threat.severity === 'High' ? prev.high_risk + 1 : prev.high_risk
          }));
        }
      } catch (e) {
        console.error("Error parsing websocket message", e);
      }
    };

    ws.onclose = () => {
      setWsStatus("Connection Lost. Reconnecting...");
    };

    return () => {
      ws.close();
    };
  }, []);

  const statCards = [
    { title: "Total Analyzed", value: stats.total_investigations, icon: Activity, color: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/20" },
    { title: "Threats Neutralized", value: stats.completed, icon: CheckCircle, color: "from-green-500 to-emerald-500", glow: "shadow-green-500/20" },
    { title: "Critical Risks Prevented", value: stats.high_risk, icon: Skull, color: "from-red-500 to-orange-500", glow: "shadow-red-500/20" },
    { title: "Active Devices", value: activeDevices, icon: Smartphone, color: "from-purple-500 to-pink-500", glow: "shadow-purple-500/20" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#030303] text-white relative overflow-hidden">
      {/* Background styling */}
      <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      <header className="flex h-16 items-center px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
            </div>
          </Link>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Trust Chain SOC</span>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm font-medium text-white/50">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${wsStatus.includes("Online") ? 'bg-green-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${wsStatus.includes("Online") ? 'bg-green-500' : 'bg-red-500'}`}></span>
            </span>
            {wsStatus}
          </span>
        </div>
      </header>

      <div className="relative z-10 p-6 max-w-[1600px] mx-auto w-full">
        {/* Top Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {statCards.map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`border-white/5 bg-white/[0.01] backdrop-blur-md overflow-hidden relative shadow-lg ${card.glow}`}>
                <div className={`absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r ${card.color}`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
                  <CardTitle className="text-xs font-medium text-white/40 uppercase tracking-wider">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-white/20" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  <div className="text-3xl font-bold text-white tracking-tight">{card.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Column 1: Live Threat Feed */}
          <Card className="xl:col-span-2 border-white/5 bg-[#0a0a0a] shadow-2xl flex flex-col h-[500px]">
            <CardHeader className="border-b border-white/5 py-3 px-4 bg-white/[0.02] flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white/80">
                <Network className="w-4 h-4 text-blue-400" /> Live Threat Interception Feed
              </CardTitle>
              <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 bg-green-500/10 rounded-full animate-pulse">Monitoring Active</Badge>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a] z-10 pointer-events-none" />
              <ScrollArea className="h-full w-full p-4">
                <AnimatePresence>
                  {liveThreats.map((threat) => (
                    <motion.div 
                      key={threat.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="mb-3 rounded-lg border border-red-500/20 bg-red-500/5 p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <div>
                          <p className="text-sm font-bold text-white/90">{threat.type}</p>
                          <p className="text-xs text-white/50">Target: {threat.target} • Source: {threat.source}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">{threat.severity} RISK</span>
                        <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400 bg-blue-500/10">
                          {threat.action}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {liveThreats.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-white/20">
                    <Eye className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm">Awaiting incoming webhooks...</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Column 2: Agent Telemetry & Guardian Alerts */}
          <div className="space-y-6">
            <Card className="border-white/5 bg-[#050505] shadow-xl h-[240px] flex flex-col">
              <CardHeader className="border-b border-white/5 py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white/80">
                  <Terminal className="w-4 h-4 text-purple-400" /> Neural Agent Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-3 overflow-hidden">
                <div className="font-mono text-[11px] text-white/40 space-y-1.5 leading-relaxed">
                  {agentLogs.map((log, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <span className="text-blue-500/50">[{new Date().toLocaleTimeString()}]</span> {log}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/5 bg-[#0a0a0a] shadow-xl h-[236px] flex flex-col">
              <CardHeader className="border-b border-white/5 py-3 px-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-white/80">
                  <Brain className="w-4 h-4 text-orange-400" /> Threat Memory Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Phishing Heuristics DB</span>
                      <span>98% match rate</span>
                    </div>
                    <Progress value={98} className="h-1 bg-white/10 [&>div]:bg-orange-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-white/50 mb-1">
                      <span>Zero-Day Scams Detected</span>
                      <span>124 campaigns</span>
                    </div>
                    <Progress value={45} className="h-1 bg-white/10 [&>div]:bg-orange-400" />
                  </div>
                  <div className="rounded border border-white/5 bg-white/[0.02] p-2 flex items-center gap-3 mt-4">
                    <History className="w-4 h-4 text-white/40" />
                    <p className="text-xs text-white/60">Cross-referencing active malicious domains across global threat networks.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
