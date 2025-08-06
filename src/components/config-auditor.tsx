
'use client';

import React, from 'react';
import { Lightbulb, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { runConfigAudit } from '@/app/actions';
import type { FirebaseConfig } from '@/lib/types';
import type { AuditConfigOutput } from '@/ai/flows/config-auditor';

interface ConfigAuditorProps {
  currentConfig: FirebaseConfig;
}

export function ConfigAuditor({ currentConfig }: ConfigAuditorProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [auditResult, setAuditResult] = React.useState<AuditConfigOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleAudit = async () => {
    setIsLoading(true);
    setError(null);
    setAuditResult(null);
    const result = await runConfigAudit(currentConfig);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setAuditResult(result.data);
    }
    setIsLoading(false);
  };

  return (
    <Card className="mt-8 shadow-lg border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl font-headline">AI Configuration Auditor</CardTitle>
            <CardDescription>
              Get AI-powered recommendations to improve your Firebase setup.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-4">
          <p className="text-muted-foreground">
            Our AI will analyze your current configuration for security, performance, and best practices. It will provide a detailed explanation and actionable recommendations.
          </p>
          <Button onClick={handleAudit} disabled={isLoading} size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Auditing...
              </>
            ) : (
              'Run AI Audit'
            )}
          </Button>

          {error && (
            <div className="mt-4 w-full rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">Audit Failed</h3>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {auditResult && (
            <div className="mt-4 w-full space-y-6">
                <div>
                    <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Audit Complete
                    </h3>
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-semibold text-lg mb-2">Explanation</h4>
                        <p className="text-muted-foreground">{auditResult.explanation}</p>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-lg mb-2">Recommendations</h4>
                    <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                        {auditResult.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
