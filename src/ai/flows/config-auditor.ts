// src/ai/flows/config-auditor.ts
'use server';

/**
 * @fileOverview An AI-powered tool that audits Firebase configurations.
 *
 * - auditConfig - A function that handles the configuration audit process.
 * - AuditConfigInput - The input type for the auditConfig function.
 * - AuditConfigOutput - The return type for the auditConfig function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AuditConfigInputSchema = z.object({
  config: z.record(z.any()).describe('The Firebase configuration to audit.'),
  securityRules: z
    .string()
    .optional()
    .describe('The Firestore security rules.'),
});
export type AuditConfigInput = z.infer<typeof AuditConfigInputSchema>;

const AuditConfigOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('Recommendations for improving the Firebase configuration.'),
  explanation: z
    .string()
    .describe('Explanation of the recommendations and their implications.'),
});
export type AuditConfigOutput = z.infer<typeof AuditConfigOutputSchema>;

export async function auditConfig(input: AuditConfigInput): Promise<AuditConfigOutput> {
  return auditConfigFlow(input);
}

const prompt = ai.definePrompt({
  name: 'auditConfigPrompt',
  input: {schema: AuditConfigInputSchema},
  output: {schema: AuditConfigOutputSchema},
  prompt: `You are an expert Firebase consultant. You will audit the provided Firebase configuration and provide recommendations for improvement, focusing on dependencies and security implications.

Here is the configuration:
{{{JSON.stringify config}}}

{% if securityRules %}Here are the Firestore security rules:
{{securityRules}}{% endif %}

Provide specific recommendations and explain the reasoning behind them. Be concise but thorough.
`,
});

const auditConfigFlow = ai.defineFlow(
  {
    name: 'auditConfigFlow',
    inputSchema: AuditConfigInputSchema,
    outputSchema: AuditConfigOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
