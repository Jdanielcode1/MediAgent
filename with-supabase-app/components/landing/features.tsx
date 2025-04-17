import { 
    Search, 
    MessageSquare, 
    BarChart, 
    Database, 
    Zap, 
    Shield,
    Stethoscope,
    Building,
    FileText
  } from "lucide-react";
  
  const features = [
    {
      name: 'AI Lead Generation',
      description: 'Automatically identify and qualify high-value prospects in the medical device industry, focusing on healthcare providers most likely to adopt your specific technology.',
      icon: Search,
    },
    {
      name: 'Personalized Outreach',
      description: 'Generate tailored emails and messages based on prospect data, clinical specialties, and regulatory requirements specific to medical devices.',
      icon: MessageSquare,
    },
    {
      name: 'Performance Analytics',
      description: 'Track conversion rates, engagement metrics, and ROI with detailed dashboards designed for medical device sales cycles.',
      icon: BarChart,
    },
    {
      name: 'CRM Integration',
      description: 'Seamlessly connect with your existing CRM systems for unified data management across your medical device sales pipeline.',
      icon: Database,
    },
    {
      name: 'Automated Follow-ups',
      description: 'Schedule and send intelligent follow-up messages at the optimal time for engagement with healthcare professionals and procurement teams.',
      icon: Zap,
    },
    {
      name: 'HIPAA Compliant',
      description: 'Enterprise-grade security and compliance for healthcare industry requirements, ensuring all communications meet strict medical data regulations.',
      icon: Shield,
    },
    {
      name: 'Clinical Knowledge Base',
      description: 'AI agents trained on medical terminology and clinical workflows to communicate effectively with healthcare professionals about your devices.',
      icon: Stethoscope,
    },
    {
      name: 'Hospital Procurement Expertise',
      description: 'Navigate complex hospital buying processes with AI that understands value analysis committees and procurement protocols.',
      icon: Building,
    },
    {
      name: 'Regulatory-Aware Messaging',
      description: 'Ensure all outreach complies with FDA and other regulatory guidelines for medical device marketing and sales communications.',
      icon: FileText,
    },
  ];
  
  export default function Features() {
    return (
      <div id="features" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary">Accelerate Medical Device Sales</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Purpose-built AI for medical device startups
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
              Unlike generic AI sales tools, MediAgent is specifically designed for the unique challenges of medical device sales—from regulatory compliance to complex hospital procurement processes.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
          
          <div className="mt-20 text-center">
            <div className="inline-flex items-center rounded-full px-6 py-3 bg-primary/10 text-primary">
              <span className="text-sm font-medium">Built by medical device industry veterans for medical device startups</span>
            </div>
          </div>
        </div>
      </div>
    );
  }