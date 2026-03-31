declare module "mammoth" {
  interface ExtractRawTextResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export function extractRawText(input: {
    buffer: Buffer;
  }): Promise<ExtractRawTextResult>;

  const mammoth: {
    extractRawText: typeof extractRawText;
  };

  export default mammoth;
}

declare module "pdf-parse" {
  interface PdfParseResult {
    text: string;
    numpages: number;
    numrender: number;
    info?: unknown;
    metadata?: unknown;
    version?: string;
  }

  export default function pdfParse(dataBuffer: Buffer): Promise<PdfParseResult>;
}
