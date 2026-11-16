// Prepares a receipt file for upload to the parse-receipt function.
//
// Phone camera photos are often 4-15 MB (HEIC on iPhones, orientation stored in EXIF).
// Sending them raw as one giant base64 string is slow, memory-hungry on mobile browsers
// and needlessly large for the AI model. Images are therefore decoded, rotated upright,
// downscaled and re-encoded as JPEG (~200-600 KB). PDFs are passed through unchanged.

const MAX_IMAGE_SIDE = 1800;
const JPEG_QUALITY = 0.85;
const MAX_PDF_BYTES = 15 * 1024 * 1024;

const EXT_TO_MIME: Record<string, string> = {
  pdf: "application/pdf",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
};

export interface PreparedReceipt {
  fileBase64: string;
  mimeType: string;
}

/** Some phones/browsers report an empty file.type, so fall back to the extension. */
export function detectMimeType(file: File): string | null {
  if (file.type) return file.type.toLowerCase();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_MIME[ext] ?? null;
}

export function isSupportedReceipt(file: File): boolean {
  const mime = detectMimeType(file);
  return !!mime && (mime === "application/pdf" || mime.startsWith("image/"));
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Faili lugemine ebaõnnestus"));
    reader.onload = () => {
      const result = String(reader.result);
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.readAsDataURL(blob);
  });
}

async function decodeImage(file: File): Promise<{ source: CanvasImageSource; width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    try {
      // "from-image" applies the EXIF orientation so portrait phone photos are not sideways.
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      return { source: bmp, width: bmp.width, height: bmp.height };
    } catch {
      // fall through to <img> decoding
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return { source: img, width: img.naturalWidth, height: img.naturalHeight };
  } finally {
    // revoke after decode; the decoded bitmap stays valid
    URL.revokeObjectURL(url);
  }
}

async function compressImage(file: File): Promise<Blob> {
  let decoded;
  try {
    decoded = await decodeImage(file);
  } catch {
    throw new Error("Pilti ei õnnestunud avada. Proovi teha uus foto või lae üles PDF.");
  }
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(decoded.width, decoded.height));
  const w = Math.max(1, Math.round(decoded.width * scale));
  const h = Math.max(1, Math.round(decoded.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Pildi töötlemine ebaõnnestus");
  // White background so transparent PNGs do not turn black.
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(decoded.source, 0, 0, w, h);
  if ("close" in decoded.source) (decoded.source as ImageBitmap).close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
  if (!blob) throw new Error("Pildi töötlemine ebaõnnestus");
  return blob;
}

export async function prepareReceiptFile(file: File): Promise<PreparedReceipt> {
  const mime = detectMimeType(file);
  if (!mime) throw new Error("Toetatud on ainult PDF ja pildifailid");

  if (mime === "application/pdf") {
    if (file.size > MAX_PDF_BYTES) throw new Error("PDF on liiga suur (max 15 MB)");
    return { fileBase64: await blobToBase64(file), mimeType: mime };
  }
  if (!mime.startsWith("image/")) throw new Error("Toetatud on ainult PDF ja pildifailid");

  const jpeg = await compressImage(file);
  return { fileBase64: await blobToBase64(jpeg), mimeType: "image/jpeg" };
}
