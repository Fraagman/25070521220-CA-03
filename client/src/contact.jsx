import { useState } from 'react';
import { Flame, CheckCircle, ShieldAlert, Send } from 'lucide-react';
import { submitInquiry } from './services/api';
import './App.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('O-Negative');
  const [frameStyle, setFrameStyle] = useState('Cyber-Visor');
  const [tintColor, setTintColor] = useState('Arterial Red Mirror');
  const [visionNotes, setVisionNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !visionNotes.trim()) {
      setErrorMsg('Name, email, and optical vision notes are mandatory.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await submitInquiry({
        name: name.trim(),
        email: email.trim(),
        bloodType,
        frameStyle,
        tintColor,
        visionNotes: visionNotes.trim(),
      });
      setSuccessMsg(res.message);
      setName('');
      setEmail('');
      setVisionNotes('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to register blood oath inquiry in MongoDB');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-cont min-h-screen bg-[#070406] text-white py-16 px-4 font-mono">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="border-b-4 border-[#ff0033] pb-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-black border border-red-800 px-3 py-1 text-xs uppercase text-red-500 font-bold mb-3">
            <Flame className="w-4 h-4" />
            <span>CUSTOM CARNAGE LAB & BESPOKE OPTICS</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            CONTACT THE FORGE
          </h2>
          <p className="max-w-2xl mx-auto text-xs md:text-sm text-zinc-400 mt-3">
            Require custom prescription optics, titanium reinforced brow bars, or personalized blood splatter enamel?
            Enter your parameters below. Our master smiths catalogue every request in our MongoDB database.
          </p>
        </div>

        {successMsg ? (
          <div className="bg-[#0e0a0d] border-4 border-emerald-500 p-8 text-center space-y-4 shadow-[8px_8px_0px_#064e3b]">
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black uppercase text-white font-mono">
              BLOOD OATH CATALOGUED IN MONGODB
            </h3>
            <p className="text-sm text-zinc-300 max-w-lg mx-auto">
              {successMsg}
            </p>
            <p className="text-xs text-zinc-500">
              Open MongoDB Compass at <code className="text-emerald-400">carnage_optix.inquiries</code> to view this record.
            </p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="mt-4 bg-[#ff0033] text-black font-black uppercase px-6 py-2.5 text-xs shadow-[3px_3px_0px_#fff]"
            >
              FORGE ANOTHER SPECIMEN
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#0e0a0d] border-4 border-black shadow-[8px_8px_0px_#180306] p-6 md:p-8 space-y-6 text-xs"
          >
            {errorMsg && (
              <div className="p-3 bg-red-950 border-2 border-red-600 text-red-200 flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-zinc-400 uppercase font-bold mb-1">
                  PATRON CODENAME / MONIKER *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Commander Vane"
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-bold mb-1">
                  COMMUNICATION DISPATCH EMAIL *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vane@darksector.com"
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-bold mb-1">
                  BLOOD TYPE CLASSIFICATION
                </label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                >
                  <option value="O-Negative">O-Negative (Universal Donor)</option>
                  <option value="O-Positive">O-Positive</option>
                  <option value="A-Negative">A-Negative</option>
                  <option value="A-Positive">A-Positive</option>
                  <option value="B-Negative">B-Negative</option>
                  <option value="B-Positive">B-Positive</option>
                  <option value="AB-Negative">AB-Negative</option>
                  <option value="AB-Positive">AB-Positive (Universal Recipient)</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 uppercase font-bold mb-1">
                  BASE FRAME ARCHITECTURE
                </label>
                <select
                  value={frameStyle}
                  onChange={(e) => setFrameStyle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                >
                  <option value="Cyber-Visor">Cyber-Visor (Single piece wrap)</option>
                  <option value="Razor-Edge">Razor-Edge (Polygonal steel)</option>
                  <option value="Brutal Acetate">Brutal Acetate (10mm thick oxblood)</option>
                  <option value="Necrotic Aviator">Necrotic Aviator (Barbed bridge)</option>
                  <option value="Spiked Cat-Eye">Spiked Cat-Eye (Fang tips)</option>
                  <option value="Mortuary Hex">Mortuary Hex (Side mesh shields)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-zinc-400 uppercase font-bold mb-1">
                  LENS COATING & CHROMATIC TINT
                </label>
                <select
                  value={tintColor}
                  onChange={(e) => setTintColor(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] px-3 py-2 text-white outline-none"
                >
                  <option value="Arterial Red Mirror">Arterial Red Mirror (100% UV400, 12% VLT)</option>
                  <option value="Coagulated Charcoal Polarized">Coagulated Charcoal Polarized (Total Glare Elimination)</option>
                  <option value="Radioactive Toxic Crimson">Radioactive Toxic Crimson Iridescent</option>
                  <option value="Blood Amber Photochromic">Blood Amber Photochromic (Day-to-Dusk Adaptive)</option>
                  <option value="Smoked Obsidian 99%">Smoked Obsidian 99% Blindness Defense</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-zinc-400 uppercase font-bold mb-1">
                  VISION REQUIREMENTS / PRESCRIPTION / SPECIAL SPECS *
                </label>
                <textarea
                  value={visionNotes}
                  onChange={(e) => setVisionNotes(e.target.value)}
                  rows={4}
                  placeholder="Provide pupillary distance, sphere/cylinder values, photophobia requirements, or custom blood splatter requests..."
                  className="w-full bg-black border border-zinc-800 focus:border-[#ff0033] p-3 text-white outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff0033] text-black hover:bg-red-600 disabled:bg-zinc-800 font-black uppercase text-sm py-4 tracking-wider flex items-center justify-center space-x-2 shadow-[6px_6px_0px_#fff] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'STORING SPECIFICATIONS IN MONGODB...' : 'SUBMIT BESPOKE SPECIFICATIONS'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;

