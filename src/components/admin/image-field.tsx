import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { imageUrl, uploadImage } from "@/lib/cms";

const MAX_BYTES = 5 * 1024 * 1024;

/** Uploads a single image to the private admin bucket and reports its path. */
export function ImageField({
  label,
  folder,
  value,
  onChange,
  className = "h-32 w-full",
}: {
  label: string;
  folder: string;
  value: string | null;
  onChange: (path: string | null) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const src = imageUrl(value);

  const pick = async (file?: File) => {
    if (!file) return;
    if (file.size > MAX_BYTES) return toast.error("Please choose an image under 5 MB");
    setBusy(true);
    try {
      onChange(await uploadImage(folder, file));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className={`relative mt-2 overflow-hidden rounded-xl border border-dashed border-border bg-muted/40 ${className}`}>
        {src ? (
          <img src={src} alt={label} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-background/70">
            <Loader2 className="h-5 w-5 animate-spin text-gold" />
          </div>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={() => inputRef.current?.click()}>
          <ImagePlus className="h-3.5 w-3.5" /> {value ? "Replace" : "Upload"}
        </Button>
        {value && (
          <Button type="button" size="sm" variant="ghost" className="gap-1.5" onClick={() => onChange(null)}>
            <X className="h-3.5 w-3.5" /> Remove
          </Button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}

/** Manages an ordered list of gallery image paths. */
export function GalleryField({
  folder,
  value,
  onChange,
}: {
  folder: string;
  value: string[];
  onChange: (paths: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > MAX_BYTES) {
          toast.error(`${file.name} is larger than 5 MB`);
          continue;
        }
        uploaded.push(await uploadImage(folder, file));
      }
      onChange([...value, ...uploaded]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Gallery (first three also become the Normal, Deluxe and Suite room photos)
      </p>
      <div className="mt-2 flex flex-wrap gap-3">
        {value.map((p) => (
          <div key={p} className="group relative h-20 w-28 overflow-hidden rounded-lg ring-1 ring-border">
            <img src={imageUrl(p) ?? ""} alt="Gallery item" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => onChange(value.filter((x) => x !== p))}
              className="absolute right-1 top-1 rounded-full bg-background/90 p-1 text-foreground opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="grid h-20 w-28 place-items-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => add(e.target.files)}
      />
    </div>
  );
}
