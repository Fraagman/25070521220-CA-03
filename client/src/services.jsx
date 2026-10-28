import { Link } from 'react-router-dom';
import { Wrench, Shield, Eye, Flame, Hammer, ArrowRight } from 'lucide-react';
import './App.css';

const Services = () => {
  const serviceList = [
    {
      icon: <Eye className="w-8 h-8 text-[#ff0033]" />,
      title: "ARTERIAL VAPOR COATING",
      subtitle: "Multi-layer infrared & UV400 deposition",
      desc: "Our proprietary vacuum-chamber process bonds an arterial scarlet reflective titanium layer directly to optical-grade polycarbonate, neutralizing blinding glare while amplifying contrast in harsh lighting."
    },
    {
      icon: <Shield className="w-8 h-8 text-[#ff0033]" />,
      title: "BALLISTIC CERTIFICATION",
      subtitle: "ANSI Z87.1 high-velocity impact grading",
      desc: "Every custom specimen undergoes kinetic shock tests and steel-ball projectile impacts to certify that lenses will not shatter even when subjected to extreme mechanical trauma."
    },
    {
      icon: <Hammer className="w-8 h-8 text-[#ff0033]" />,
      title: "SURGICAL STEEL RESIZING",
      subtitle: "Cold-rolled 316L custom fitment",
      desc: "Our smiths heat-bend, chamfer, and calibrate bridge angles and temple lengths to fit your cranium with zero slippage during high-speed nocturnal escapades."
    },
    {
      icon: <Wrench className="w-8 h-8 text-[#ff0033]" />,
      title: "PRESCRIPTION BLOOD GRINDING",
      subtitle: "High-index corrective gore optics",
      desc: "Custom digital surfacing for astigmatism, myopia, and photophobia. We convert any brutal silhouette into your personalized daily prescription eyewear."
    },
    {
      icon: <Flame className="w-8 h-8 text-[#ff0033]" />,
      title: "10MM ACETATE POLISHING",
      subtitle: "Viscera restoration & scratch eradication",
      desc: "Milled 10mm acetate frames can be re-beveled, hand-buffed, and treated with fresh enamel blood splatter drops to restore showroom brutality."
    }
  ];

  return (
    <div className="services-cont min-h-screen bg-[#070406] text-white py-16 px-4 font-mono">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b-4 border-[#ff0033] pb-6 text-center">
          <span className="text-xs text-red-500 font-bold uppercase tracking-widest block mb-1">
            LAB CAPABILITIES & WORKSHOP
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            CARNAGE FORGE SERVICES
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-zinc-400 mt-3">
            Bespoke engineering for eyewear that defies mortality. All consultations recorded directly into our MongoDB archives.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceList.map((srv, idx) => (
            <div
              key={idx}
              className="bg-[#0e0a0d] border-2 border-zinc-800 p-6 flex flex-col justify-between shadow-[4px_4px_0px_#180306] hover:border-[#ff0033] hover:shadow-[6px_6px_0px_#ff0033] transition-all"
            >
              <div>
                <div className="mb-4">{srv.icon}</div>
                <h3 className="text-lg font-black uppercase text-white mb-1">
                  {srv.title}
                </h3>
                <span className="text-xs text-red-400 font-bold uppercase block mb-3">
                  {srv.subtitle}
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-900">
                <Link
                  to="/contact"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#ff0033] font-bold uppercase hover:underline"
                >
                  <span>REQUEST INQUIRY</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="bg-black border-4 border-[#ff0033] p-8 text-center space-y-4 shadow-[8px_8px_0px_#fff]">
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white">
            READY TO FORGE A CUSTOM BLOOD OATH?
          </h3>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto">
            Submit your prescription parameters, frame choices, and tint requirements directly to MongoDB Compass through our contact forge.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-[#ff0033] text-black font-black uppercase px-8 py-3 text-sm shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-decoration-none"
          >
            <span>COMMENCE CONSULTATION</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;

