import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Smartphone } from 'lucide-react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:w-96"
        >
          <div className="glass p-6 rounded-[2.5rem] border border-brand/30 shadow-2xl relative overflow-hidden bg-black/80 backdrop-blur-2xl">
            <div className="absolute top-0 right-0 p-2">
              <button 
                onClick={() => setShowPrompt(false)}
                className="p-2 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-brand/20 flex items-center justify-center border border-brand/50">
                <Smartphone size={32} className="text-brand" />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight uppercase tracking-tight">تثبيت التطبيق</h3>
                <p className="text-white/60 text-xs">قم بتثبيت My Travel DZ على هاتفك للوصول السريع</p>
              </div>
            </div>

            <button
              onClick={handleInstall}
              className="w-full bg-brand text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-brand transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand/20"
            >
              <Download size={20} />
              تثبيت الآن
            </button>
            
            <p className="text-[9px] text-white/30 mt-4 text-center uppercase tracking-widest font-bold">
              يعمل على نظامي Android و iOS
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
