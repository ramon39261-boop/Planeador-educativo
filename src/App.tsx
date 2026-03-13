import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Download, 
  Share2, 
  Printer, 
  ChevronRight, 
  GraduationCap, 
  Layout, 
  Target,
  FileText,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { generatePlanning } from './services/geminiService';
import { Grade, CampoFormativo, Metodologia, PlanningData } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GRADES: Grade[] = ['1°', '2°', '3°', '4°', '5°', '6°'];
const CAMPOS: CampoFormativo[] = [
  'Lenguajes',
  'Saberes y Pensamiento Científico',
  'Ética, Naturaleza y Sociedades',
  'De lo Humano y lo Comunitario'
];
const METODOLOGIAS: Metodologia[] = [
  'Aprendizaje basado en proyectos comunitarios',
  'Aprendizaje basado en indagación (STEAM)',
  'Aprendizaje basado en problemas (ABP)',
  'Aprendizaje servicio (AS)'
];
const EJES = [
  'Inclusión',
  'Pensamiento crítico',
  'Interculturalidad crítica',
  'Igualdad de género',
  'Vida saludable',
  'Apropiación de las culturas a través de la lectura y la escritura',
  'Artes y experiencias estéticas'
];

export default function App() {
  const [formData, setFormData] = useState<PlanningData>({
    grade: '1°',
    campoFormativo: 'Lenguajes',
    metodologia: 'Aprendizaje basado en proyectos comunitarios',
    contenido: '',
    pda: '',
    ejesArticuladores: []
  });

  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!formData.contenido || !formData.pda) {
      setError('Por favor completa el Contenido y el PDA.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const planning = await generatePlanning(formData);
      setResult(planning);
    } catch (err) {
      setError('Error al generar la planeación. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleEje = (eje: string) => {
    setFormData(prev => ({
      ...prev,
      ejesArticuladores: prev.ejesArticuladores.includes(eje)
        ? prev.ejesArticuladores.filter(e => e !== eje)
        : [...prev.ejesArticuladores, eje]
    }));
  };

  const handleReset = () => {
    setFormData({
      grade: '1°',
      campoFormativo: 'Lenguajes',
      metodologia: 'Aprendizaje basado en proyectos comunitarios',
      contenido: '',
      pda: '',
      ejesArticuladores: []
    });
    setResult(null);
    setError(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && result) {
      try {
        await navigator.share({
          title: `Planeación NEM - ${formData.grade}`,
          text: result,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(result || '');
      alert('Planeación copiada al portapapeles.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#13322B] text-white py-6 px-4 shadow-lg no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-lg">
              <GraduationCap className="text-[#13322B] w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight">Planeador Educativo NEM</h1>
              <p className="text-xs text-[#D4C19C] font-heading uppercase tracking-widest">Nueva Escuela Mexicana • SEP</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm opacity-80">Ciclo Escolar 2025-2026</p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <section className="sep-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <Layout className="text-[#691C32] w-5 h-5" />
                <h2 className="text-lg font-bold font-heading text-[#13322B]">Estructura Pedagógica</h2>
              </div>
              <button 
                onClick={handleReset}
                className="text-xs font-medium text-gray-400 hover:text-[#691C32] transition-colors"
              >
                Limpiar Formulario
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="sep-label">Grado Escolar</label>
                <select 
                  className="sep-input"
                  value={formData.grade}
                  onChange={e => setFormData({...formData, grade: e.target.value as Grade})}
                >
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="sep-label">Campo Formativo</label>
                <select 
                  className="sep-input"
                  value={formData.campoFormativo}
                  onChange={e => setFormData({...formData, campoFormativo: e.target.value as CampoFormativo})}
                >
                  {CAMPOS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="sep-label">Metodología Sociocrítica</label>
              <select 
                className="sep-input"
                value={formData.metodologia}
                onChange={e => setFormData({...formData, metodologia: e.target.value as Metodologia})}
              >
                {METODOLOGIAS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="sep-label">Contenido (Programa Sintético)</label>
              <textarea 
                className="sep-input min-h-[100px] resize-none"
                placeholder="Ej. Escritura de nombres en la lengua materna..."
                value={formData.contenido}
                onChange={e => setFormData({...formData, contenido: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="sep-label">PDA (Proceso de Desarrollo)</label>
              <textarea 
                className="sep-input min-h-[100px] resize-none"
                placeholder="Ej. Escribe su nombre y lo compara con los nombres de sus compañeros..."
                value={formData.pda}
                onChange={e => setFormData({...formData, pda: e.target.value})}
              />
            </div>

            <div className="space-y-3">
              <label className="sep-label">Ejes Articuladores</label>
              <div className="flex flex-wrap gap-2">
                {EJES.map(eje => (
                  <button
                    key={eje}
                    onClick={() => toggleEje(eje)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                      formData.ejesArticuladores.includes(eje)
                        ? "bg-[#13322B] text-white border-[#13322B]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#D4C19C]"
                    )}
                  >
                    {eje}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-[#691C32] hover:bg-[#4a1323] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generando planeación...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generar Planeación con IA
                </>
              )}
            </button>
          </section>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!result && !loading ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 sep-card border-dashed border-2 border-gray-200 bg-gray-50/50 no-print"
              >
                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                  <FileText className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 font-display">Tu planeación aparecerá aquí</h3>
                <p className="text-gray-400 mt-2 max-w-xs">Completa el formulario de la izquierda para generar una propuesta pedagógica completa.</p>
              </motion.div>
            ) : loading ? (
              <div className="h-full flex flex-col items-center justify-center p-12 no-print">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-[#D4C19C]/20 border-t-[#13322B] rounded-full animate-spin"></div>
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D4C19C] w-8 h-8" />
                </div>
                <p className="mt-6 text-[#13322B] font-medium animate-pulse">Diseñando secuencia didáctica...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {/* Actions Toolbar */}
                <div className="flex items-center justify-end gap-2 no-print">
                  <button 
                    onClick={handleShare}
                    className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-[#13322B] hover:border-[#13322B] transition-all shadow-sm flex items-center gap-2 text-sm font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    Compartir
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2.5 bg-[#13322B] text-white rounded-lg hover:bg-[#0d241f] transition-all shadow-md flex items-center gap-2 text-sm font-medium"
                  >
                    <Printer className="w-4 h-4" />
                    Imprimir
                  </button>
                </div>

                {/* Document Preview */}
                <div className="sep-card overflow-hidden relative">
                  {/* Official Header Decoration */}
                  <div className="h-2 bg-gradient-to-r from-[#13322B] via-[#D4C19C] to-[#691C32]"></div>
                  
                  <div className="p-8 md:p-12 bg-white min-h-[800px] relative">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                      <GraduationCap className="w-[500px] h-[500px] -rotate-12" />
                    </div>

                    <div className="relative z-10">
                      {/* Document Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-[#D4C19C] pb-6 mb-8 gap-4">
                        <div className="space-y-1">
                          <h4 className="text-[#13322B] font-bold text-xl font-display">Planeación Didáctica</h4>
                          <p className="text-sm text-gray-500 font-medium">Nueva Escuela Mexicana • Programa Analítico</p>
                        </div>
                        <div className="text-right text-xs font-heading space-y-1">
                          <p><span className="text-[#691C32] font-bold">GRADO:</span> {formData.grade}</p>
                          <p><span className="text-[#691C32] font-bold">CAMPO:</span> {formData.campoFormativo}</p>
                          <p><span className="text-[#691C32] font-bold">FECHA:</span> {new Date().toLocaleDateString('es-MX')}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose-official max-w-none">
                        <ReactMarkdown>{result || ''}</ReactMarkdown>
                      </div>

                      {/* Document Footer */}
                      <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-end">
                        <div className="space-y-4">
                          <div className="w-48 h-px bg-gray-300"></div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Firma del Docente</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-medium italic">Generado por Planeador NEM AI</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <GraduationCap className="w-5 h-5" />
            <span className="text-sm font-medium">Planeador Educativo NEM v1.0</span>
          </div>
          <p className="text-xs text-gray-400 text-center md:text-right">
            Esta herramienta utiliza IA para apoyar la labor docente. <br className="hidden md:block" />
            Valida siempre los contenidos según tu contexto escolar.
          </p>
        </div>
      </footer>
    </div>
  );
}
