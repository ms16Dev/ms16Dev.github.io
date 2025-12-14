import { Download } from 'lucide-react';

const PrintButton = () => (
    <button
        onClick={() => window.print()}
        className="fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-xl hover:bg-primary/80 transition-colors print:hidden z-50"
        title="Download as PDF"
    >
        <Download />
    </button>
);

export default PrintButton;
