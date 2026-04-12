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
        question: "What are the English language requirements?",
        answer: (
            <div className="space-y-4">
                <p>
                    If English is not your official language, you must prove your proficiency. We accept official tests such as <strong>IELTS, TOEFL</strong>, or equivalent.
                </p>
                <p>
                    Alternatively, a high school or previous degree taught fully in English, or a Grade C or above in English from recognised high school equivalents, can satisfy the requirement.
                </p>
            </div>
        )
    },
    {
        question: "Can I apply to more than one programme?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, you can include up to <strong>two programmes</strong> in a single application form. You will need to rank them by preference. You only need to submit <strong>one</strong> application form.
                </p>
            </div>
        )
    },
    {
        question: "When will I receive my admission decision?",
        answer: (
            <div className="space-y-4">
                <p>
                    Admission results will be published <strong>within less than a week of submitting application</strong>. You will be notified via email and can check your official Admission Letter in the Kestora Applicant Portal.
                </p>
            </div>
        )
    },
    {
        question: "Is there a waiting list?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes. If you meet the criteria but a programme is full, you may be placed on a waiting list. Available places from the waiting list will be offered until <strong>26 June 2026</strong>.
                </p>
            </div>
        )
    }
];

export default function ApplicationFAQ() {
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
