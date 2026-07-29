'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadPhoto } from '@/app/actions/admin'
import { compressImage } from '@/lib/compress-image'
import { CATEGORIES } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'

type Selected = { file: File; previewUrl: string }

export function PhotoUploader() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Selected[]>([])
  const [category, setCategory] = useState('lifestyle')
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)

  function addFiles(fileList: FileList | null) {
    if (!fileList) return
    const next = Array.from(fileList)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
    setSelected((prev) => [...prev, ...next])
    setMessage(null)
  }

  function removeAt(index: number) {
    setSelected((prev) => {
      URL.revokeObjectURL(prev[index]?.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  function clearAll() {
    selected.forEach((s) => URL.revokeObjectURL(s.previewUrl))
    setSelected([])
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleUpload() {
    if (selected.length === 0) return
    setBusy(true)
    setMessage(null)
    setProgress({ done: 0, total: selected.length })

    let ok = 0
    let failed = 0

    for (let i = 0; i < selected.length; i++) {
      try {
        const compressed = await compressImage(selected[i].file)
        const formData = new FormData()
        formData.append('file', compressed)
        formData.append('category', category)
        const res = await uploadPhoto(formData)
        if (res?.error) failed++
        else ok++
      } catch {
        failed++
      }
      setProgress({ done: i + 1, total: selected.length })
    }

    setBusy(false)
    setProgress(null)
    clearAll()
    router.refresh()

    if (failed === 0) {
      setMessage({ type: 'ok', text: `${ok} photo${ok === 1 ? '' : 's'} added to your gallery.` })
    } else if (ok === 0) {
      setMessage({ type: 'err', text: 'Upload failed. Please try again.' })
    } else {
      setMessage({ type: 'ok', text: `${ok} uploaded, ${failed} failed. You can retry the rest.` })
    }
  }

  return (
    <div className="flex flex-col gap-4 border border-border bg-card/40 p-6">
      <div>
        <h2 className="font-serif text-xl font-light text-foreground">Add photos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose one or many images. Large photos are automatically optimized for the web.
        </p>
      </div>

      <label
        htmlFor="file"
        className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border bg-background px-4 py-8 text-center transition-colors hover:border-primary"
      >
        <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
        <span className="text-sm text-foreground">
          {selected.length > 0
            ? `${selected.length} photo${selected.length === 1 ? '' : 's'} selected — click to add more`
            : 'Click to choose images'}
        </span>
        <span className="text-xs text-muted-foreground">JPG or PNG — select multiple at once</span>
        <input
          ref={inputRef}
          id="file"
          name="file"
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
      </label>

      {selected.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {selected.map((s, i) => (
            <div key={s.previewUrl} className="group relative aspect-square overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.previewUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                disabled={busy}
                aria-label="Remove photo"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-background/80 text-foreground opacity-0 transition-opacity hover:bg-background group-hover:opacity-100 disabled:cursor-not-allowed"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:max-w-xs">
        <label htmlFor="category" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Category for these photos
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={busy}
          className="border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:border-primary"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {message && (
        <p className={message.type === 'ok' ? 'text-sm text-primary' : 'text-sm text-red-400'}>
          {message.text}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="button" onClick={handleUpload} disabled={busy || selected.length === 0}>
          {busy && progress
            ? `Uploading ${progress.done}/${progress.total}…`
            : `Upload ${selected.length > 0 ? selected.length : ''} photo${selected.length === 1 ? '' : 's'}`.trim()}
        </Button>
        {selected.length > 0 && !busy && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
