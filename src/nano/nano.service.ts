import { Injectable } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class NanoService {
  private ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });

  async generateImage(promptText: string): Promise<string> {
    const prompt = [
      { text: promptText },
    ];

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        const fileName = `generated-${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../public', fileName);
        
        // Ensure public directory exists
        const publicDir = path.dirname(filePath);
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        return `/public/${fileName}`;
      }
    }

    throw new Error('No image generated');
  }

  async generateImageFromImage(
    imagePath: string,
    promptText: string,
  ): Promise<string> {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    const prompt = [
      { text: promptText },
      {
        inlineData: {
          mimeType: 'image/png',
          data: base64Image,
        },
      },
    ];

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        const fileName = `generated-from-image-${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../public', fileName);
        
        // Ensure public directory exists
        const publicDir = path.dirname(filePath);
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        return `/public/${fileName}`;
      }
    }

    throw new Error('No image generated');
  }

  async generateImageFromBase64(
    base64Image: string,
    promptText: string,
  ): Promise<string> {
    // Remover el prefijo data:image/...;base64, si existe
    const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '');
    
    // Comprimir la imagen si es muy grande
    const compressedBase64 = await this.compressBase64Image(base64Data);

    const prompt = [
      { text: promptText },
      {
        inlineData: {
          mimeType: 'image/png',
          data: compressedBase64,
        },
      },
    ];

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        const fileName = `generated-from-base64-${Date.now()}.png`;
        const filePath = path.join(__dirname, '../../public', fileName);
        
        // Ensure public directory exists
        const publicDir = path.dirname(filePath);
        if (!fs.existsSync(publicDir)) {
          fs.mkdirSync(publicDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, buffer);
        return `/public/${fileName}`;
      }
    }

    throw new Error('No image generated');
  }

  private async compressBase64Image(base64Data: string): Promise<string> {
    try {
      // Convertir base64 a buffer
      const buffer = Buffer.from(base64Data, 'base64');
      
      // Si la imagen es menor a 1MB, no comprimir
      if (buffer.length < 1024 * 1024) {
        return base64Data;
      }

      // Redimensionar la imagen para reducir el tamaño
      const resizedBuffer = await this.resizeImage(buffer, 1024, 1024);
      
      // Convertir de vuelta a base64
      return resizedBuffer.toString('base64');
    } catch (error) {
      console.warn('Error compressing image, using original:', error.message);
      return base64Data;
    }
  }

  private async resizeImage(buffer: Buffer, maxWidth: number, maxHeight: number): Promise<Buffer> {
    // Implementación simple de redimensionamiento sin dependencias externas
    // Para una implementación más robusta, se recomienda usar sharp o jimp
    
    // Por ahora, retornamos el buffer original
    // En producción, deberías usar una librería como sharp
    return buffer;
  }
}
