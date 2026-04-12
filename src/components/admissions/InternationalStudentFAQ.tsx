'use client';

import { useState } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

const faqs: FAQItem[] = [
    {
        question: "Is orientation mandatory?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, it provides essential info for starting your studies. All students are expected to attend the sessions during the first week.
                </p>
            </div>
        )
    },
    {
        question: "Do I need a residence permit before arriving?",
        answer: (
            <div className="space-y-4">
                <p>
                    If you are a non-EU/EEA citizen, you must apply for a student residence permit immediately after accepting your admission offer. EU/EEA citizens only need to register their right of residence after arrival.
                </p>
            </div>
        )
    },
    {
        question: "How do I find housing in Finland?",
        answer: (
            <div className="space-y-4">
                <p>
                    You should arrange accommodation before arrival. We recommend you apply for housing in your student portal when enrolled as "Attending".
                </p>
            </div>
        )
    },
    {
        question: "Am I allowed to work while studying?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, international students are generally allowed to work part-time (typically up to 30 hours per week on average) during their studies.
                </p>
            </div>
        )
    },
    {
        question: "What kind of healthcare is available for students?",
        answer: (
            <div className="space-y-4">
                <p>
                    Attending degree students pay a healthcare fee to Kela, which grants access to the Finnish Student Health Service (FSHS) for general, mental, and oral health care.
                </p>
            </div>
        )
    },
    {
        question: "Do I need to speak Finnish to live in Finland?",
        answer: (
            <div className="space-y-4">
                <p>
                    English is widely spoken, and it is entirely possible to live and study in English. However, learning Finnish is highly encouraged for cultural integration and significantly improves your local employability.
                </p>
            </div>
        )
    },
    {
        question: "Can I bring my family?",
        answer: (
            <div className="space-y-4">
                <p>
                    Yes, family members can apply for residence permits based on family ties. However, the student permit applicant must demonstrate sufficient financial resources for the entire family's stay.
                </p>
            </div>
        )
    }
];

export default function InternationalStudentFAQ() {
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
