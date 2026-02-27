'use client';

import { useState } from 'react';
import { Plus, Minus } from "@phosphor-icons/react/dist/ssr";

interface FAQItem {
    question: string;
    answer: React.ReactNode;
}

const faqs: FAQItem[] = [
    {
        question: "Who is required to pay tuition fees at Kestora College?",
        answer: (
            <div className="space-y-4">
                <p>
                    In accordance with Finnish legislation, tuition fees are mandatory for students who are
                    <strong> not citizens</strong> of the European Union (EU), European Economic Area (EEA),
                    or Switzerland, and who are enrolled in English-taught Bachelor's or Master's degree programmes.
                </p>
                <p>
                    <strong>Exemptions apply if you hold:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>A permanent Finnish residence permit (P)</li>
                    <li>A long-term resident's EU residence permit (P-EU)</li>
                    <li>A continuous residence permit (A) issued on grounds other than study</li>
                    <li>An EU Blue Card issued in Finland</li>
                    <li>An EU Family Member's Residence Card</li>
                </ul>
                <p>
                    Status is verified during the application process. You must upload a copy of your residence permit card
                    or passport to the application portal for verification by our admissions team.
                </p>
            </div>
        )
    },
    {
        question: "How do I pay my tuition fees?",
        answer: (
            <div className="space-y-4">
                <p>
                    Kestora College partners with <strong>Paygowire</strong> to process tuition payments securely and efficiently
                    for international students.
                </p>
                <p>
                    <strong>Steps to complete your payment:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>Log in to your <strong>Kestora Applicant Portal</strong>.</li>
                    <li>Navigate to the 'Payment' section of your accepted application.</li>
                    <li>Click 'Proceed to Payment' to be redirected to the secure <strong>Paygowire gateway</strong>.</li>
                    <li>Select your country and preferred payment method (Bank Transfer, Credit Card, etc.).</li>
                    <li>Follow the on-screen instructions to finalize your payment.</li>
                </ol>
                <p>
                    Once the payment is completed, your status will clear automatically, and you will receive an official
                    receipt for your residence permit application.
                </p>
            </div>
        )
    },
    {
        question: "What are the specific requirements for the Early Payment Discount?",
        answer: (
            <div className="space-y-4">
                <p>
                    To encourage early enrolment, we offer a <strong>25% reduction</strong> on the first year's tuition fee.
                    This is a significant saving and is highly recommended for all international students.
                </p>
                <p>
                    <strong>Eligibility Criteria:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>You must accept your study offer within <strong>14 days</strong> of receiving the admission letter.</li>
                    <li>The full (discounted) payment must reach Kestora College's account within <strong>21 days</strong> of the admission offer.</li>
                    <li>This discount applies ONLY to the first academic year and cannot be combined with other tuition fee waivers.</li>
                </ul>
                <p>
                    If the payment is not received by the 21st day, the discount is voided, and the full standard fee will be
                    required to confirm your enrolment.
                </p>
            </div>
        )
    },
    {
        question: "Detailed Refund Policy: When can I get my money back?",
        answer: (
            <div className="space-y-4">
                <p>
                    We understand that circumstances change. Our refund policy is designed to be fair while ensuring
                    administrative costs are covered.
                </p>
                <p>
                    <strong>100% Refund (minus €100 admin fee):</strong>
                </p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Negative residence permit decision (must provide official Migri document).</li>
                    <li>Failure to meet conditional admission requirements (e.g., failed to graduate on time).</li>
                    <li>Cancellation of the degree program by the College.</li>
                </ul>
                <p>
                    <strong>Partial Refund:</strong> If you withdraw after the semester has started but before the
                    'Add/Drop' deadline, you may be eligible for a 50% refund. No refunds are issued for the current
                    semester after the 4th week of classes.
                </p>
                <p>
                    <em>Note: Refunds are always paid back to the original source/account that made the payment.</em>
                </p>
            </div>
        )
    },
    {
        question: "Can I pay in instalments?",
        answer: (
            <div className="space-y-4">
                <p>
                    For the <strong>first academic year</strong>, the tuition fee must be paid in <strong>one full
                        instalment</strong> to facilitate the residence permit process. The Finnish Immigration Service (Migri)
                    generally requires proof of full payment for the first year before granting a permit.
                </p>
                <p>
                    For <strong>subsequent years</strong>, you may choose to pay in two instalments (per semester).
                    However, please be aware that paying in instalments may incur a small administrative surcharge of
                    €50 per instalment.
                </p>
            </div>
        )
    },
    {
        question: "How do I maintain my scholarship eligibility?",
        answer: (
            <div className="space-y-4">
                <p>
                    Kestora College rewards academic dedication. Our continuing scholarships (available from the 2nd year onwards)
                    are based on your performance during the previous academic year.
                </p>
                <p>
                    <strong>To qualify for a 50% waiver on the next year's fee:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>You must complete at least <strong>55 ECTS credits</strong> within the academic year (Sept 1 – July 31).</li>
                    <li>You must maintain a minimum weighted GPA of 3.5 / 5.0.</li>
                    <li>You must not have any disciplinary actions on your record.</li>
                </ul>
                <p>
                    Scholarships are automatically reviewed every August, and eligible students are notified before the
                    Autumn semester tuition deadline.
                </p>
            </div>
        )
    }
];

export default function TuitionFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="space-y-0">
            {faqs.map((faq, index) => (
                <div key={index} className="bg-white transition-all">
                    <button
                        onClick={() => toggle(index)}
                        className="w-full flex items-center justify-between py-6 text-left hover:text-neutral-600 transition-colors focus:outline-none group"
                    >
                        <span className="text-lg font-bold text-black pl-2">{faq.question}</span>
                        {openIndex === index ? (
                            <Minus className="text-black shrink-0" size={20} weight="bold" />
                        ) : (
                            <Plus className="text-black shrink-0 group-hover:scale-110 transition-transform" size={20} weight="bold" />
                        )}
                    </button>
                    <div
                        className={`transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0'
                            } overflow-hidden`}
                    >
                        <div className="text-black leading-relaxed pl-2 pr-4">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
