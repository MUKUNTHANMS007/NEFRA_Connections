import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// THE FIX: Removed UploadCloud, added Plus
import { Plus, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// The animated background grid from Aceternity
function GridPattern() {
  return (
    <div className="pointer-events-none absolute inset-0 left-0 top-0 flex h-full w-full items-center justify-center bg-slate-950/20 [mask-image:linear-gradient(to_bottom,white,transparent)]">
      <motion.div
        variants={{
          initial: { backgroundPosition: "0 0" },
          animate: { backgroundPosition: "30px 30px" },
        }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]"
      />
    </div>
  );
}

interface FileUploadProps {
  onChange: (file: File) => void;
  imagePreview: string | null;
  onRemove: () => void;
}

export function FileUpload({ onChange, imagePreview, onRemove }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!imagePreview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            whileHover="animate"
            className={cn(
              "group relative block w-full cursor-pointer overflow-hidden rounded-[2rem] border-2 border-dashed transition-colors duration-300",
              isDragging ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-950/40 hover:border-blue-500/50 hover:bg-slate-900/60"
            )}
          >
            <GridPattern />
            <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
              {/* THE FIX: The floating Aceternity container now holds the Plus icon */}
              <motion.div
                variants={{
                  initial: { y: 0, scale: 1, rotate: 0 },
                  animate: { y: -10, scale: 1.05, rotate: 90 }, // Rotates the plus slightly for cool effect
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-white/5 group-hover:bg-blue-600 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all"
              >
                {/* Plus symbol injected */}
                <Plus className="h-8 w-8 text-slate-400 group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors">
                Initialize Asset Upload
              </h3>
              <p className="mt-2 text-xs font-medium text-slate-500">
                Click or drag & drop. JPEG, PNG, GIF up to 5MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-4 shadow-2xl"
          >
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600/20 to-emerald-600/20 opacity-50 blur-xl pointer-events-none" />
            
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/5 bg-black">
              <img
                src={imagePreview}
                alt="Upload preview"
                className="max-h-80 w-full object-contain"
              />
              
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 to-transparent p-4 flex items-center gap-3">
                <ImageIcon className="h-5 w-5 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-white">Asset Attached</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onRemove}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-slate-400 hover:text-red-400 hover:border-red-500/50 hover:bg-slate-950 shadow-2xl transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}