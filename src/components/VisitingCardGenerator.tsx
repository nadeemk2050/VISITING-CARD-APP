import React, { useState, useRef, useEffect } from 'react';
import { Download, Upload, Paintbrush, Text, FileImage, FileText, Contact } from 'lucide-react';
import QRCode from 'qrcode';

const templates = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimalist' },
  { id: 'bold', label: 'Bold' },
  { id: 'dark', label: 'Dark' },
  { id: 'border', label: 'Bordered' },
  { id: 'shadow', label: 'Shadowed' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'circle', label: 'Circle Logo' },
  { id: 'serif', label: 'Serif' }
];

export default function VisitingCardGenerator() {
  const [details, setDetails] = useState({
    name: 'Jonathan Vane',
    title: 'Senior Architect',
    company: 'Studio Helix',
    phone: '+1 (555) 0123 4567',
    whatsapp: '+1 (555) 0123 4567',
    email: 'j.vane@studiohelix.com',
    website: 'www.studiohelix.com',
    address: '456 Design Plaza, New York'
  });

  const [style, setStyle] = useState({
    backgroundColor: '#ffffff',
    textColor: '#1A1A1A',
    fontFamily: 'sans-serif',
    template: 'classic',
    orientation: 'landscape'
  });

  const [logo, setLogo] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${details.name}
ORG:${details.company}
TITLE:${details.title}
TEL;TYPE=WORK,VOICE:${details.phone}
TEL;TYPE=CELL:${details.whatsapp}
EMAIL;TYPE=PREF,INTERNET:${details.email}
URL:${details.website}
ADR;TYPE=WORK:;;${details.address}
END:VCARD`;
      try {
        const url = await QRCode.toDataURL(vCard);
        setQrCode(url);
      } catch (err) {
        console.error(err);
      }
    };
    generateQRCode();
  }, [details]);

  const handleDownloadPNG = async () => {
    if (cardRef.current) {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        useCORS: false,
        allowTaint: true,
        // @ts-ignore
        fetch: window.fetch,
      });
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `visiting-card-${details.name.toLowerCase().replace(' ', '-')}.png`;
      link.click();
    }
  };

  const handleDownloadPDF = async () => {
    if (cardRef.current) {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        useCORS: false,
        allowTaint: true,
        // @ts-ignore
        fetch: window.fetch,
      });
      const dataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(dataURL, 'PNG', 10, 10, 180, 100);
      pdf.save(`visiting-card-${details.name.toLowerCase().replace(' ', '-')}.pdf`);
    }
  };

  const handleDownloadVCF = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${details.name}
ORG:${details.company}
TITLE:${details.title}
TEL;TYPE=WORK,VOICE:${details.phone}
TEL;TYPE=CELL:${details.whatsapp}
EMAIL;TYPE=PREF,INTERNET:${details.email}
URL:${details.website}
ADR;TYPE=WORK:;;${details.address}
END:VCARD`;
    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${details.name.toLowerCase().replace(' ', '-')}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getTemplateClasses = () => {
    switch (style.template) {
      case 'modern': return 'border-l-[16px] border-black';
      case 'minimal': return 'border-2 border-[rgb(229,231,235)]';
      case 'bold': return ''; // Colors handled in style
      case 'dark': return ''; // Colors handled in style
      case 'border': return 'border-8 border-double border-black';
      case 'shadow': return 'shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]';
      case 'gradient': return ''; // Colors handled in style
      case 'circle': return 'rounded-t-[100px] border-t-8 border-black';
      case 'serif': return 'font-serif border-4 border-black';
      default: return 'border border-[rgb(229,231,235)]';
    }
  };

  const getTemplateStyles = () => {
      switch (style.template) {
        case 'bold': return { backgroundColor: '#000000', color: '#ffffff' };
        case 'dark': return { backgroundColor: '#111827', color: '#f3f4f6' };
        case 'gradient': return { background: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)' };
        default: return {};
      }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 text-[#1A1A1A]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center justify-between bg-white border border-gray-200 px-8 py-5 shadow-sm rounded-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white rotate-45"></div>
            </div>
            <span className="font-bold text-2xl tracking-tight uppercase">Visto Studio</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200">
            <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-8">Card Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {Object.keys(details).map((key) => (
                <div key={key}>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">{key}</label>
                  <input
                    type="text"
                    value={details[key as keyof typeof details]}
                    onChange={(e) => setDetails({ ...details, [key]: e.target.value })}
                    className="w-full border-b border-gray-200 py-1 text-sm focus:border-black outline-none transition-colors"
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Template</label>
                  <select value={style.template} onChange={(e) => setStyle({...style, template: e.target.value})} className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50">
                    {templates.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                   <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Orientation</label>
                   <select value={style.orientation} onChange={(e) => setStyle({...style, orientation: e.target.value})} className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50">
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Background</label>
                  <input type="color" value={style.backgroundColor} onChange={(e) => setStyle({...style, backgroundColor: e.target.value})} className="w-10 h-10 rounded-full cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Text</label>
                  <input type="color" value={style.textColor} onChange={(e) => setStyle({...style, textColor: e.target.value})} className="w-10 h-10 rounded-full cursor-pointer" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3">Logo</label>
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-xs text-gray-500">Upload</span>
                    <input type="file" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mt-8">
              <button onClick={handleDownloadPNG} className="bg-black text-white py-2 rounded text-[10px] font-bold uppercase transition hover:bg-gray-800 flex items-center justify-center gap-1"><FileImage size={10} /> PNG</button>
              <button onClick={handleDownloadPDF} className="bg-black text-white py-2 rounded text-[10px] font-bold uppercase transition hover:bg-gray-800 flex items-center justify-center gap-1"><FileText size={10} /> PDF</button>
              <button onClick={handleDownloadVCF} className="bg-black text-white py-2 rounded text-[10px] font-bold uppercase transition hover:bg-gray-800 flex items-center justify-center gap-1"><Contact size={10} /> VCF</button>
              <button onClick={() => {
                const cardHtml = cardRef.current?.outerHTML;
                const blob = new Blob([`<html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="p-10">${cardHtml}</body></html>`], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${details.name.toLowerCase().replace(' ', '-')}.html`;
                link.click();
                URL.revokeObjectURL(url);
              }} className="bg-black text-white py-2 rounded text-[10px] font-bold uppercase transition hover:bg-gray-800 flex items-center justify-center gap-1">HTML</button>
            </div>
          </div>

          {/* Card Preview */}
          <div className="flex justify-center items-center lg:sticky lg:top-8 bg-gray-100 rounded-sm p-12 border border-gray-200">
            <div
              ref={cardRef}
              className={`p-10 shadow-2xl ${getTemplateClasses()} flex flex-col justify-between`}
              style={{
                backgroundColor: style.backgroundColor,
                color: style.textColor,
                fontFamily: style.fontFamily,
                width: style.orientation === 'landscape' ? '500px' : '280px',
                height: style.orientation === 'landscape' ? '280px' : '500px',
                ...getTemplateStyles()
              }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xl font-bold tracking-tight">{details.company}</p>
                  <div className="h-1 w-12 bg-black"></div>
                  <h3 className="text-sm font-light mt-2">{details.name}</h3>
                  <p className="text-xs opacity-70">{details.title}</p>
                </div>
                {logo && <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />}
              </div>
                            <div className="flex justify-between items-end text-xs mt-auto">
                <div className="space-y-1">
                  <a href={`tel:${details.phone.replace(/\D/g, '')}`} className="block transition-transform hover:-translate-y-0.5">
                    <span className="font-bold">T</span> {details.phone}
                  </a>
                  <a href={`https://wa.me/${details.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
                    <span className="font-bold">W</span> {details.whatsapp}
                  </a>
                  <p><span className="font-bold">A</span> {details.address}</p>
                </div>
                <div className="space-y-1 text-right">
                  <a href={`mailto:${details.email}`} target="_blank" rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
                    {details.email} <span className="font-bold">E</span>
                  </a>
                  <a href={details.website.startsWith('http') ? details.website : `https://${details.website}`} target="_blank" rel="noreferrer" className="block transition-transform hover:-translate-y-0.5">
                    {details.website} <span className="font-bold">W</span>
                  </a>
                  {/* QR code removed */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
