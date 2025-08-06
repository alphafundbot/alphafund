import { defineConfig } from 'genkit';
import { genkit } from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

export const config = defineConfig({
  serve: {
    host: '127.0.0.1',
    port: 9001
  }
});