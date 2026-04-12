
'use client';

import { useState } from 'react';
import { CaretDown, CaretUp, Plus, Minus } from "@phosphor-icons/react/dist/ssr";
import Link from 'next/link';

interface Section {
    id: string;
    title: string;
    content: string;
    items?: { title: string; href: string }[];
}

interface Props {
    sections: Section[];
}

function CollapsibleSection({ section }: { section: Section }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasItems = section.items && section.items.length > 0;

    return (
        <div>
            <div className="flex items-center justify-between group cursor-pointer" onClick={() => hasItems && setIsExpanded(!isExpanded)}>
                <a
                    href={`#${section.id}`}
                    className="flex-1 text-base font-semibold text-neutral-600 hover:text-black transition-colors block py-2 border-l-2 border-transparent hover:border-black pl-3"
                    onClick={(e) => {
                        // Navigation happens automatically via href
                    }}
                >
                    {section.title}
                </a>
                {hasItems && (
                    <button
                        className="p-1 mr-[-8px] text-black hover:text-[#fd6402] transition-colors"
                    >
                        {isExpanded ? <Minus size={16} weight="bold" /> : <Plus size={16} weight="bold" />}
                    </button>
                )}
            </div>
            {hasItems && (
                <div
                    className={`ml-3 pl-3 border-l border-neutral-200 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100 mb-2' : 'max-h-0 opacity-0'
                        }`}
                >
                    {section.items!.map(item => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="block text-sm text-neutral-500 hover:text-[#fd6402] py-1"
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function TableOfContents({ sections }: Props) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-100 lg:sticky top-8 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neutral-900">Study at Kestora</h3>
                </div>
                {isOpen ? <Minus size={20} weight="bold" className="text-black" /> : <Plus size={20} weight="bold" className="text-black" />}
            </button>

            <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 pt-0">
                    <nav className="flex flex-col space-y-1 mt-2">
                        {sections.map((section) => (
                            <CollapsibleSection key={section.id} section={section} />
                        ))}
                    </nav>


                </div>
            </div>
        </div>
    );
}
