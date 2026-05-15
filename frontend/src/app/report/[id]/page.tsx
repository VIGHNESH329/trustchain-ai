"use client";

import { useEffect, useState, use } from "react";
import { getInvestigation, getReport } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Download, AlertTriangle, Info, CheckSquare, BrainCircuit } from "lucide-react";

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const [inv, setInv] = useState<any>(null);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invData = await getInvestigation(id);
        setInv(invData);
        
        if (invData.status === "completed") {
          const reportData = await getReport(id);
          setReport(reportData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!inv || (inv.status === "completed" && !report)) {
    return <div className="flex h-screen items-center justify-center">Loading Report...</div>;
  }

  const result = inv.results || {};
  const intel = result.intelligence_data || {};
  
  return (
    <div className="flex flex-col min-h-screen p-8 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Incident Response Report</h1>
          <p className="text-muted-foreground mt-1">Investigation #{id} • Generated automatically by Trust Chain AI</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Export PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Threat Classification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{result.threat_type || "Unknown"}</div>
            <Badge variant={result.severity === "High" ? "destructive" : "secondary"} className="mt-2">
              Severity: {result.severity || "Unknown"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{result.risk_score || 0}/100</div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Info className="w-4 h-4" /> Target Identity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-mono truncate">{inv.target}</div>
            <div className="text-xs text-muted-foreground mt-2 uppercase">{inv.type}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-purple-500" /> AI Reasoning
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            {result.reasoning || "No reasoning available."}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" /> External Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Domain Age:</strong> {intel.domain_age || "N/A"}</li>
              <li><strong className="text-foreground">Blacklisted:</strong> {intel.blacklisted ? "Yes" : "No"}</li>
              <li><strong className="text-foreground">Risk Level:</strong> {intel.risk || "N/A"}</li>
              <li><strong className="text-foreground">Details:</strong> {intel.details || "N/A"}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {report && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" /> Remediation Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4 leading-relaxed">{report.summary}</p>
            <h4 className="font-semibold mb-2">Recommended Actions:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              {report.remediation_actions?.map((action: string, i: number) => (
                <li key={i}>{action}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
