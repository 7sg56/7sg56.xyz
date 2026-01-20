"use client";

import { getProfile } from "@/lib/data";

export default function ContactWindow() {
  const profile = getProfile();

  const socialLinks = [
    { name: "GitHub", url: profile.socials.github },
    { name: "LinkedIn", url: profile.socials.linkedin },
    { name: "Twitter", url: profile.socials.twitter },
    { name: "Instagram", url: profile.socials.instagram },
    { name: "Email", url: `mailto:${profile.contact.email_masked}` },
    { name: "Phone", url: profile.contact.phone_masked }
  ];

  return (
    <div className="h-full flex flex-col relative z-50">
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide flex items-center justify-center">
        <div className="w-full max-w-3xl mx-auto space-y-6 bg-zinc-900 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-md">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Get in Touch</h1>
            <p className="text-zinc-400 text-base">I&apos;m always ready to collaborate and build things together!</p>
          </div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {socialLinks.map((link) => {
               // Easter Egg Logic
               const isPhone = link.name === "Phone";
               const isInsta = link.name === "Instagram";
               const rickRollUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

               // Phone specific render
               if (isPhone) {
                 return (
                  <button
                     key={link.name}
                     className="relative flex items-center justify-center w-full p-4 rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-red-500/30 group transition-all hover:-translate-y-0.5 cursor-help overflow-hidden h-[58px]"
                  >
                      {/* Default State: Label */}
                      <div className="flex items-center justify-between w-full transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-full absolute px-4">
                        <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{link.name}</span>
                        <span className="text-zinc-600 text-xs uppercase tracking-wider">Reveal</span>
                      </div>

                      {/* Hover State: Message */}
                      <span className="text-red-400 font-medium text-sm transition-all duration-300 opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 absolute">
                        Let&apos;s not rush, first a date :)
                      </span>
                  </button>
                 );
               }

               // Standard Link Render (with Instagram Easter Egg)
               const actualUrl = isInsta ? rickRollUrl : link.url;
               
               return (
                <a 
                   href={actualUrl}
                   key={link.name} 
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center justify-between p-4 rounded-xl bg-[#0d0d0d] border border-white/5 hover:border-red-500/30 group transition-all hover:-translate-y-0.5 h-[58px]"
                >
                    <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{link.name}</span>
                    <span className="text-red-500/50 group-hover:text-red-400 transition-colors">↗</span>
                </a>
               );
             })}
          </div>

           <div className="text-center pt-4">
               <p className="text-zinc-500 text-sm">
                   Prefer email? <a href={`mailto:${profile.contact.email_masked}`} className="text-red-400 hover:text-red-300 font-medium transition-colors">Send me a message</a>
               </p>
           </div>
        </div>
      </div>
    </div>
  );
}
