import type { Metadata } from "next";
import RearrangeTool from "@/app/components/RearrangeTool";

export const metadata: Metadata = {
  title: "Rotate / Rearrange PDF — Simple Toolkit",
  description: "Rotate pages and reorder them within a PDF locally in your browser — private, fast, and free.",
};

export default function RearrangePage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Rotate / Rearrange PDF</h1>
          <p className="text-muted">Rotate pages 90° at a time and drag to reorder — all processing is local.</p>
        </div>
        <RearrangeTool />
      </div>
    </div>
  );
}
