"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "How does MediAgent's AI technology work?",
    answer: "MediAgent uses advanced natural language processing and machine learning to analyze medical device markets, identify potential leads, and generate personalized outreach. Our AI continuously learns from interactions to improve targeting and messaging effectiveness."
  },
  {
    question: "Is MediAgent compliant with healthcare regulations?",
    answer: "Yes, MediAgent is fully HIPAA compliant and designed with healthcare industry regulations in mind. We implement enterprise-grade security measures to protect sensitive data and maintain compliance with relevant standards."
  },
  {
    question: "Can MediAgent integrate with our existing CRM?",
    answer: "Absolutely. MediAgent seamlessly integrates with popular CRM systems including Salesforce, HubSpot, and Microsoft Dynamics. We also offer custom API integrations for proprietary systems."
  },
  {
    question: "How long does it take to set up and see results?",
    answer: "Most customers are fully operational within 1-2 weeks. The setup process includes integrating your data sources, configuring your AI agents, and training the system on your specific products and target markets. Many clients start seeing qualified leads within the first month."
  },
  {
    question: "Do we need technical expertise to use MediAgent?",
    answer: "No technical expertise is required. Our platform is designed with a user-friendly interface that sales professionals can easily navigate. We also provide comprehensive onboarding and ongoing support to ensure your team gets maximum value."
  },
  {
    question: "What kind of ROI can we expect?",
    answer: "Our clients typically see a 3-5x return on investment within the first six months. This comes from increased lead volume, higher conversion rates, and reduced time spent on manual prospecting and follow-up tasks."
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div id="faq" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">FAQ</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Everything you need to know about MediAgent and how it can transform your medical device sales.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl divide-y divide-gray-200 dark:divide-gray-800">
          {faqs.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleFaq(index)}
                className="flex w-full items-start justify-between text-left"
              >
                <span className="text-lg font-semibold leading-7">{faq.question}</span>
                <span className="ml-6 flex h-7 items-center">
                  {openIndex === index ? (
                    <ChevronUp className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-2 pr-12">
                  <p className="text-base leading-7 text-gray-600 dark:text-gray-400">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}