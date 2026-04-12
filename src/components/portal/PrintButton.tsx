'use client';

import { Printer } from "@phosphor-icons/react/dist/ssr";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
        >
            <Printer size={16} weight="regular" />
            Print Letter
        </button>
    );
}
