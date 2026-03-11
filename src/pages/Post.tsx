import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import api from '../api';
import { FileUpload } from '@/components/ui/file-upload';

// THE INJECTION: 3D Floating Shape Logic
function FloatingShape({
  className,
  delay = 0,
  duration = 15,
  yOffset = "20px",
  xOffset = "20px",
  rotation = 45,
}: {
  className: string;
  delay?: number;
  duration?: number;
  yOffset?: string;
  xOffset?: string;
  rotation?: number;
}) {
  return (
    <motion.div
      initial={{ y: 0, x: 0, rotate: 0 }}
      animate={{
        y: ["0px", yOffset, `-${yOffset}`, "0px"],
        x: ["0px", xOffset, `-${xOffset}`, "0px"],
        rotate: [0, rotation, -rotation, 0],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn("absolute", className)}
    />
  );
}

export default function CreatePost() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageString, setImageString] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setImageString(typeof result === 'string' ? result : null);
    };
    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    if (!content.trim() && !imageString) return;
    
    setIsSubmitting(true);
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      await api.post('/posts', { userId: Number(userId), content, imageUrl: imageString ?? undefined });
      navigate('/feed');
    } catch (error) {
      console.error("Failed to broadcast signal", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-transparent flex flex-col overflow-hidden">
      
      {/* BACKGROUND: GLOWS & 3D FLOATING SHAPES */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-600/20 blur-[100px]" />

       
      </div>

      {/* FOREGROUND: FORM CONTENT */}
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 w-full flex-grow">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
          <div className="h-1 w-8 bg-blue-600" /> Comm_Link_Active
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl drop-shadow-lg">Broadcast Signal</h1>
        <p className="mt-4 text-lg font-medium text-slate-400 leading-relaxed drop-shadow-md">
          Transmit updates, milestones, or strategic requests to the NEFRA ecosystem.
        </p>

        <div className="mt-10 relative">
          
          {/* THE FIX: Ultra-Clear Glassmorphic Card */}
          <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.03] backdrop-blur-md p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.3)]">
            
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What strategic maneuver are you executing today?"
              className="w-full min-h-[160px] rounded-3xl border border-white/10 bg-black/20 px-6 py-5 text-lg text-white placeholder-slate-500 focus:border-blue-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all resize-y mb-6"
            />

            {/* THE ACETERNITY UPLOAD INJECTION */}
            <FileUpload 
              onChange={handleFileChange}
              imagePreview={imageString}
              onRemove={() => setImageString(null)}
            />

            <div className="mt-10 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-white/10 pt-8">
              <button
                type="button"
                onClick={() => navigate('/feed')}
                disabled={isSubmitting}
                className="w-full sm:w-auto rounded-xl border border-white/10 px-8 py-3.5 font-bold tracking-widest text-xs uppercase text-slate-300 hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
              >
                Abort
              </button>
              <button
                onClick={submitPost}
                disabled={isSubmitting || (!content.trim() && !imageString)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 font-black tracking-widest text-xs uppercase text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 hover:scale-105 transition-all disabled:opacity-90 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <>Transmitting...</>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Deploy to Network
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}