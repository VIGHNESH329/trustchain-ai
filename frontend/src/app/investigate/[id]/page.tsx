"use client";

import { useEffect, useState, use } from "react";
import { getInvestigation, getAgentLogs } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, ShieldAlert, Activity, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function InvestigationStatus({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [inv, setInv] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invData = await getInvestigation(id);
        setInv(invData);
        
        const logsData = await getAgentLogs(id);
        setLogs(logsData);

        if (invData.status === "completed") {
          // Keep fetching logs once more then stop
          clearInterval(interval);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, [id]);

  if (!inv) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const progressMap: any = {
    "pending": 10,
    "running": 50,
    "completed": 100,
    "failed": 100
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="flex h-20 items-center px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Trust Chain SOC</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-8 max-w-6xl mx-auto w-full relative z-10 mt-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold tracking-tight text-white">Investigation #{id}</h1>
              {inv.status === "running" && <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse ml-2"></span>}
            </div>
            <p className="text-white/50 text-lg">Target Payload: <span className="text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">{inv.target}</span></p>
          </div>
          <Badge variant="outline" className={`text-sm px-4 py-1.5 uppercase border ${inv.status === "completed" ? "border-green-500 text-green-400 bg-green-500/10" : inv.status === "failed" ? "border-red-500 text-red-400 bg-red-500/10" : "border-blue-500 text-blue-400 bg-blue-500/10"}`}>
            {inv.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-lg">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-white/90">
                  <Activity className="w-5 h-5 text-blue-400" />
                  Neural Pipeline Status
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <Progress value={progressMap[inv.status] || 0} className="h-2 mb-6 bg-white/10 [&>div]:bg-blue-500" />
                <div className="flex justify-between text-sm font-medium text-white/40">
                  <span className={progressMap[inv.status] >= 10 ? "text-blue-400" : ""}>Payload Ingest</span>
                  <span className={progressMap[inv.status] >= 50 ? "text-blue-400" : ""}>AI Processing</span>
                  <span className={progressMap[inv.status] >= 100 ? "text-blue-400" : ""}>Final Verdict</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#050505] shadow-lg overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-white/[0.02] pb-4">
                <CardTitle className="text-xl flex items-center gap-2 text-white/90">
                  <ShieldAlert className="w-5 h-5 text-blue-400" />
                  Live Agent Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[450px] w-full p-6">
                  {logs.map((log, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="mb-4 text-sm font-mono tracking-tight"
                    >
                      <span className="text-white/30">[{new Date(log.created_at).toLocaleTimeString()}]</span>{" "}
                      <span className="text-blue-400 font-semibold">[{log.agent_name}]</span>{" "}
                      <span className="text-white/50">{log.action}:</span>{" "}
                      <span className={log.action === 'Failed' ? 'text-red-400' : 'text-white/80'}>{log.details}</span>
                    </motion.div>
                  ))}
                  {inv.status === "running" && (
                    <div className="flex items-center mt-6 text-sm text-blue-400/50 font-mono animate-pulse">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Awaiting neural response...
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {inv.status === "completed" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-green-500/30 bg-green-500/10 shadow-[0_0_30px_-5px_rgba(34,197,94,0.2)] backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl text-green-400 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" />
                      Analysis Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-white/70 mb-8 leading-relaxed">
                      The autonomous agents have finalized their intelligence gathering and generated a comprehensive threat report.
                    </p>
                    <Button className="w-full h-12 bg-green-600 hover:bg-green-500 text-white text-lg shadow-[0_0_20px_-5px_rgba(34,197,94,0.5)] border-0" onClick={() => router.push(`/report/${id}`)}>
                      View Intelligence Report <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
