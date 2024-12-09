"use client";

import { ImageSequence } from "@/components/ImageSequence";
import { TextSpinner } from "@/components/TextSpinner";
import { useState } from "react";

export default function Home() {
  const items = ["Developers", "Designers", "Marketers"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <main className="relative bg-black">
      <TextSpinner
        items={items}
        interval={3000}
        hideAtIndex={21}
        currentImageIndex={currentImageIndex}
      />
      <ImageSequence onImageChange={setCurrentImageIndex} />
    </main>
  );
}
