"use client";

import { useState } from "react";
import { startInvestigation } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function Investigate() {
  const [target, setTarget] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async (type: string) => {
    if (!target) return;
    setLoading(true);
    try {
      const res = await startInvestigation({ target, type });
      router.push(`/investigate/${res.id}`);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <header className="flex h-20 items-center px-8 border-b border-white/5 bg-black/50 backdrop-blur-xl z-50 sticky top-0">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-blue-500" />
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Trust Chain SOC</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <Card className="w-full max-w-2xl border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(37,99,235,0.2)]">
          <CardHeader className="text-center pb-8 border-b border-white/5">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-6 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]">
              <ShieldAlert className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-white mb-2">Manual Override Scan</CardTitle>
            <CardDescription className="text-white/50 text-base">
              The Trust Chain neural engine automatically monitors device events. Use this module to manually inject payloads into the AI intelligence pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/50 p-1 rounded-xl border border-white/10">
                <TabsTrigger value="url" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">URL / Domain</TabsTrigger>
                <TabsTrigger value="email" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">Email Content</TabsTrigger>
                <TabsTrigger value="text" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white">Suspicious Text</TabsTrigger>
              </TabsList>
              
              <TabsContent value="url" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="url" className="text-white/70">Target URL</Label>
                    <Input 
                      id="url" 
                      className="bg-black/50 border-white/10 text-white h-12 focus-visible:ring-blue-500"
                      placeholder="https://example-phishing.com" 
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white text-lg shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]" onClick={() => handleStart("url")} disabled={loading || !target}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Inject Payload
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="email" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-white/70">Email Headers / Content</Label>
                    <Input 
                      id="email" 
                      className="bg-black/50 border-white/10 text-white h-12 focus-visible:ring-blue-500"
                      placeholder="URGENT: Your account has been suspended..." 
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white text-lg shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]" onClick={() => handleStart("email")} disabled={loading || !target}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Inject Payload
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-0">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="text" className="text-white/70">SMS / Raw Text</Label>
                    <Input 
                      id="text" 
                      className="bg-black/50 border-white/10 text-white h-12 focus-visible:ring-blue-500"
                      placeholder="Your package is delayed. Click here to update delivery info..." 
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                    />
                  </div>
                  <Button className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white text-lg shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)]" onClick={() => handleStart("text")} disabled={loading || !target}>
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Inject Payload
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
