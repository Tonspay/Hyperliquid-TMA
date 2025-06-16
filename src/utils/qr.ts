// utils/qrcode.ts
import QRCode from 'qrcode';

export async function generateQRCodeBase64(
  text: string,
  options?: QRCode.QRCodeToDataURLOptions
): Promise<string> {
  const opts: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: 'H',
    width: 256,
    ...options,
  };
  const dataUrl = await QRCode.toDataURL(text, opts);
//   const base64 = dataUrl.split(',')[1];
  return dataUrl;
}
