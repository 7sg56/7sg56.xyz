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
    <div className="h-full flex flex-col bg-black/40 backdrop-blur-sm relative z-50">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6 mt-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Contact</h1>
            <p className="text-gray-300">Get in touch with me</p>
          </div>

          {/* Social Links */}
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-200 font-bold text-center mb-6">
              I&apos;m always ready to collaborate and build things together!
              <br />
              <span className="text-red-400">Let&apos;s connect and make it happen.</span>
            </p>
            <div className="rounded-lg p-6 border border-red-500/20 bg-black/30">
              <div className="space-y-4">
                {socialLinks.map((link) => (
                  <div key={link.name} className="space-y-1">
                    <div className="text-white font-medium">
                      {link.name} : <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 hover:underline transition-colors font-medium"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
