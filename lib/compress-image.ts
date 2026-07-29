// Browser-side image compression. Resizes large photos down to a sensible
// web dimension and re-encodes as JPEG so uploads are fast and Blob storage
// stays small. Runs entirely in the browser before the file is sent.

const MAX_DIMENSION = 2200 // px on the longest edge
const QUALITY = 0.82

export async function compressImage(file: File): Promise<File> {
  // Only attempt to compress raster images. SVGs/others pass through.
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return file
  }

  try {
    const bitmap = await loadBitmap(file)
    const { width, height } = bitmap

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
    const targetW = Math.round(width * scale)
    const targetH = Math.round(height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    ctx.drawImage(bitmap, 0, 0, targetW, targetH)
    if ('close' in bitmap && typeof bitmap.close === 'function') bitmap.close()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', QUALITY),
    )
    if (!blob) return file

    // If compression somehow produced a larger file, keep the original.
    if (blob.size >= file.size) return file

    const newName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
    return new File([blob], newName, { type: 'image/jpeg' })
  } catch {
    // Any failure: fall back to the original file so uploads never break.
    return file
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    return await createImageBitmap(file)
  }
  // Fallback for browsers without createImageBitmap.
  return await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}
