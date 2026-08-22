import { GoogleGenAI } from '@google/genai';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Static, TSchema } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const model = 'gemini-3.5-flash-lite';

export type AiInferParams<In, OutSchema extends TSchema> = {
  instruction: string;
  input: In;
  outputSchema: OutSchema;
};

@Injectable()
export class AiClient {
  private client: GoogleGenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ai.key');

    if (apiKey) {
      this.client = new GoogleGenAI({
        apiKey,
      });
    }
  }

  async infer<In, OutSchema extends TSchema, Out = Static<OutSchema>>({
    instruction,
    input,
    outputSchema,
  }: AiInferParams<In, OutSchema>): Promise<Out | null> {
    if (!this.client) {
      throw new Error('AI client not initialized');
    }

    try {
      const interaction = await this.client.interactions.create({
        model,
        system_instruction: instruction,
        input: JSON.stringify(input),
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: outputSchema,
        },
      });

      if (!interaction.output_text) {
        Logger.warn('AI client failed to infer');
        return null;
      }

      return Value.Parse(outputSchema, JSON.parse(interaction.output_text));
    } catch (err) {
      Logger.warn('Invalid response from AI client', err);
      return null;
    }
  }
}
