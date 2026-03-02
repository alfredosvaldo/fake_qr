
import React, { useState, useCallback } from 'react';
import { generateRandomRUN, generateRandomSerial, generateRandomMRZ, buildUrl } from './utils/generator.ts';
import QRCode from './components/QRCode.tsx';
import { GeneratedData } from './types.ts';

const App: React.FC = () => {
  const [data, setData] = useState<GeneratedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleGenerate = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const run = generateRandomRUN();
      const serial = generateRandomSerial();
      const mrz = generateRandomMRZ();
      const url = buildUrl(run, serial, mrz);
      
      setData({ run, serial, mrz, url });
      setLoading(false);
      setCopied(false);
    }, 400);
  }, []);

  const copyToClipboard = () => {
    if (data?.url) {
      navigator.clipboard.writeText(data.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRun = e.target.value;
    if (data) {
      const newUrl = buildUrl(newRun, data.serial, data.mrz);
      setData({ ...data, run: newRun, url: newUrl });
    } else {
      const serial = generateRandomSerial();
      const mrz = generateRandomMRZ();
      const url = buildUrl(newRun, serial, mrz);
      setData({ run: newRun, serial, mrz, url });
    }
  };

  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSerial = e.target.value;
    if (data) {
      const newUrl = buildUrl(data.run, newSerial, data.mrz);
      setData({ ...data, serial: newSerial, url: newUrl });
    }
  };

  const handleMRZChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMRZ = e.target.value;
    if (data) {
      const newUrl = buildUrl(data.run, data.serial, newMRZ);
      setData({ ...data, mrz: newMRZ, url: newUrl });
    }
  };

  const handleAdminFill = () => {
    const adminRun = "9107723-K";
    if (data) {
      const newUrl = buildUrl(adminRun, data.serial, data.mrz);
      setData({ ...data, run: adminRun, url: newUrl });
    } else {
      const serial = generateRandomSerial();
      const mrz = generateRandomMRZ();
      const url = buildUrl(adminRun, serial, mrz);
      setData({ run: adminRun, serial, mrz, url });
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`w-full px-6 py-4 border-b flex items-center justify-between transition-colors sticky top-0 z-20 ${isDarkMode ? 'bg-slate-900/80 border-slate-800 backdrop-blur-md' : 'bg-white/80 border-slate-200 backdrop-blur-md'}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-qrcode text-white"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Fake QR Chile</h1>
            <p className={`text-[10px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Dejenme piola</p>
          </div>
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${isDarkMode ? 'bg-slate-800 text-yellow-400 border border-slate-700' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}
          aria-label="Toggle Dark Mode"
        >
          <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="flex flex-col space-y-8">
            <div className={`rounded-3xl p-8 shadow-xl transition-all ${isDarkMode ? 'bg-blue-700 shadow-blue-900/20' : 'bg-blue-600 shadow-blue-200'}`}>
              <h2 className="text-2xl font-bold text-white mb-2">Controles</h2>
              <p className={`mb-6 transition-colors ${isDarkMode ? 'text-blue-100' : 'text-blue-50'}`}>
                Genera una nueva identidad digital aleatoria o ingresa los datos manualmente.
              </p>
              
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-blue-100 uppercase mb-1 ml-1">RUN Manual</label>
                  <input 
                    type="text" 
                    value={data?.run || ''} 
                    onChange={handleRunChange}
                    placeholder="12.345.678-9"
                    className={`w-full px-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-white/50 outline-none transition-all text-sm font-mono ${isDarkMode ? 'bg-slate-950/50 text-white placeholder:text-slate-600' : 'bg-white/20 text-white placeholder:text-blue-200'}`}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`flex-1 py-4 px-6 font-bold rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center text-lg ${loading ? 'opacity-70' : ''} ${isDarkMode ? 'bg-slate-950 text-blue-400' : 'bg-white text-blue-600'}`}
                >
                  {loading ? (
                    <i className="fas fa-circle-notch animate-spin mr-3"></i>
                  ) : (
                    <i className="fas fa-magic mr-3"></i>
                  )}
                  {loading ? 'Simulando...' : 'Generar Identidad'}
                </button>
                
                <button
                  onClick={handleAdminFill}
                  className={`py-4 px-8 font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center text-lg ${isDarkMode ? 'bg-blue-900/50 text-white border border-blue-400/30' : 'bg-blue-500 text-white border border-blue-400'}`}
                >
                  <i className="fas fa-user-shield mr-3"></i>
                  Admin
                </button>
              </div>
            </div>

            <section className="flex flex-col items-center justify-center">
              {data ? (
                <div className="w-full space-y-6">
                  <div className={`p-6 rounded-3xl border flex flex-col items-center transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                    <div className="bg-white p-4 rounded-2xl shadow-inner border border-slate-100">
                      <QRCode value={data.url} size={250} />
                    </div>
                    <p className={`mt-4 text-xs font-medium text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Escanea para validar identidad
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`w-full aspect-square max-h-[300px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${isDarkMode ? 'border-slate-800 text-slate-800' : 'border-slate-200 text-slate-300'}`}>
                  <i className="fas fa-qrcode text-7xl mb-4 opacity-20"></i>
                  <p className="text-sm font-medium">QR pendiente</p>
                </div>
              )}
            </section>
          </div>

          <div className="space-y-6">
            {data && (
              <div className="relative">
                <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-tighter">URL de Validación</label>
                <div className={`rounded-2xl border p-4 pr-14 relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <p className={`text-xs font-mono truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {data.url}
                  </p>
                  <button 
                    onClick={copyToClipboard}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-blue-400' : 'bg-slate-100 text-slate-500 hover:text-blue-600'}`}
                  >
                    <i className={`fas ${copied ? 'fa-check text-green-500' : 'fa-copy'}`}></i>
                  </button>
                </div>
              </div>
            )}

            {data ? (
              <div className={`rounded-3xl p-6 border transition-colors ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Información Extraída</h3>
                <div className="space-y-4">
                  <div className={`flex justify-between items-center p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <span className="text-sm font-medium text-slate-500">RUN</span>
                    <input 
                      type="text"
                      value={data.run}
                      onChange={handleRunChange}
                      className="bg-transparent text-right font-mono font-bold outline-none border-b border-transparent focus:border-blue-500 w-1/2"
                    />
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <span className="text-sm font-medium text-slate-500">Nº Serie</span>
                    <input 
                      type="text"
                      value={data.serial}
                      onChange={handleSerialChange}
                      className="bg-transparent text-right font-mono font-bold outline-none border-b border-transparent focus:border-blue-500 w-1/2"
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-slate-500">Código MRZ</span>
                    <textarea 
                      value={data.mrz}
                      onChange={handleMRZChange}
                      rows={2}
                      className={`w-full p-3 rounded-xl font-mono text-[11px] break-all border outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none ${isDarkMode ? 'bg-slate-950 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className={`h-full min-h-[400px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-colors ${isDarkMode ? 'border-slate-800 text-slate-800' : 'border-slate-200 text-slate-300'}`}>
                <i className="fas fa-id-card text-6xl mb-4 opacity-10"></i>
                <p className="text-sm font-medium">Información no generada</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className={`w-full py-8 mt-auto border-t transition-colors ${isDarkMode ? 'bg-slate-950 border-slate-900 text-slate-600' : 'bg-white border-slate-100 text-slate-400'}`}>
        <div className="max-w-4xl mx-auto px-6 text-center text-xs space-y-2">
          <p>© 2026 Fake QR Chile Simulator • Entorno de Pruebas • </p>
          <p>Contacto: <a href="mailto:jefazo@ainiguez.com" className="hover:text-blue-500 underline transition-colors">jefazo@ainiguez.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default App;
