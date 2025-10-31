export default function PrivacyPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight">Privacy</h1>
            <p className="text-muted leading-relaxed">
              Simple Toolkit (simpletoolkit.app) is intentionally privacy-first. Most tools process files locally in your browser. 
              Files you select are not uploaded to our servers, stored, or logged unless a tool explicitly says otherwise.
            </p>
          </div>

          <div className="space-y-4 text-muted">
            <p className="leading-relaxed">
              We don't collect or store the files you process. The site may include minimal analytics to count visits 
              or clicks (privacy-first) but no file content is ever transmitted.
            </p>
            
            <p className="leading-relaxed">
              If you have questions, email me at{" "}
              <a href="mailto:simpletoolkitapp@gmail.com" className="text-primary hover:underline">
                simpletoolkitapp@gmail.com
              </a>
              .
            </p>
          </div>

          <div className="pt-4">
            <a href="/" className="text-sm text-muted hover:text-foreground transition-all relative link-underline">
              ← Back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}