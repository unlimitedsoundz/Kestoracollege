'use client';

import { useState } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

const faqs: FAQItem[] = [
    {
        question: "When is the application period?",
        answer: (
            <div className="space-y-4">
                <p>
                    The main application period for studies starting in Autumn is from <strong>1 December 2025 until 31 March 2026</strong>. Late applications may be considered if study places remain available.
                </p>
            </div>
        )
    },
    {
        question: "What are the language requirements?",
        answer: (
            <div className="space-y-4">
                <p>
                    All Bachelor's programmes are actively taught in English. If English is not your official language, you must prove your proficiency through official tests like IELTS or TOEFL.
                </p>
            </div>
        )
    },
    {
        question: "How does the progression to a Master's degree work?",
        answer: (
            <div className="space-y-4">
                <p>
                    Completing a Bachelor's degree at Kestora University gives you a direct path to continue your studies in our Master's programmes, or apply to top partner universities worldwide.
                </p>
            </div>
        )
    },
    {
        question: "Is there an application fee?",
        answer: (
            <div className="space-y-4">
                <p>
                    No, there is <strong>no application fee</strong> to apply to Kestora University. Processing your application is completely free of charge.
                </p>
            </div>
        )
    },
    {
        question: "What are the eligibility criteria?",
        answer: (
            <div className="space-y-4">
                <p>
                    You must have a high school diploma or equivalent, strong mathematics and relevant records, along with a Motivation Letter and Personal Statement.
                </p>
            </div>
        )
    }
];

export default function BachelorFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-0">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all mb-4 overflow-hidden">
                    <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between py-6 px-6 text-left hover:bg-indigo-50/50 transition-colors focus:outline-none group"
                    >
                        <span className="text-lg font-bold text-indigo-950">{faq.question}</span>
                        {openIndex === index ? (
                            <div className="bg-indigo-100 text-indigo-700 p-1.5 rounded-full shrink-0">
                                <Minus size={20} weight="bold" />
                            </div>
                        ) : (
                            <div className="bg-indigo-50 text-indigo-600 p-1.5 rounded-full shrink-0 group-hover:bg-indigo-100 group-hover:text-indigo-800 transition-colors">
                                <Plus className="group-hover:scale-110 transition-transform" size={20} weight="bold" />
                            </div>
                        )}
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                    >
                        <div className="text-indigo-900 leading-relaxed px-6 border-t border-indigo-50 pt-6">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
