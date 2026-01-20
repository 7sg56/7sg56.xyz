"use client";

import React from "react";
import Image from "next/image";

type DesktopBackgroundProps = {
  backgroundImage?: string;
  backgroundColor?: string;
  overlay?: boolean;
};

export default function DesktopBackground({ 
  backgroundImage = "/bg.jpg", 
  backgroundColor,
  overlay = true 
}: DesktopBackgroundProps) {
  return (
    <>
      {/* Desktop Background */}
      {backgroundColor ? (
        <div className="absolute inset-0" style={{ backgroundColor }} />
      ) : (
        <div className="absolute inset-0 w-full h-full">
           <Image
            src={backgroundImage}
            alt="Desktop Background"
            fill
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
            className="object-cover object-center"
            quality={90}
          />
        </div>
      )}
      
      {/* Background Overlay */}
      {overlay && <div className="absolute inset-0 bg-black/20" />}
    </>
  );
}
