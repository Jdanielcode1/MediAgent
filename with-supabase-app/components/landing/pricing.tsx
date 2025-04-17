import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: 'Starter',
    id: 'tier-starter',
    price: '$299',
    description: 'Perfect for small medical device companies just getting started.',
    features: [
      '1 AI Sales Agent',
      '500 leads per month',
      'Email outreach',
      'Basic analytics',
      'Email support',
    ],
    cta: 'Get started',
    mostPopular: false,
  },
  {
    name: 'Professional',
    id: 'tier-professional',
    price: '$599',
    description: 'Ideal for growing teams with established sales processes.',
    features: [
      '3 AI Sales Agents',
      '2,000 leads per month',
      'Email and LinkedIn outreach',
      'Advanced analytics',
      'CRM integration',
      'Priority support',
    ],
    cta: 'Get started',
    mostPopular: true,
  },
  {
    name: 'Enterprise',
    id: 'tier-enterprise',
    price: 'Custom',
    description: 'Dedicated solution for large medical device organizations.',
    features: [
      'Unlimited AI Sales Agents',
      'Unlimited leads',
      'Multi-channel outreach',
      'Custom integrations',
      'Dedicated account manager',
      'SLA and compliance guarantees',
    ],
    cta: 'Contact sales',
    mostPopular: false,
  },
];

export default function Pricing() {
  return (
    <div id="pricing" className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">Pricing</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Plans for teams of all sizes
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Choose the perfect plan to scale your medical device sales with AI-powered agents.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`${
                tier.mostPopular
                  ? 'relative bg-white dark:bg-gray-800 shadow-2xl ring-2 ring-primary sm:mx-8 lg:mx-0 rounded-3xl'
                  : 'bg-white/60 dark:bg-gray-800/60 sm:mx-8 lg:mx-0 rounded-3xl ring-1 ring-gray-200 dark:ring-gray-700'
              } p-8 xl:p-10`}
            >
              <div className="flex items-center justify-between gap-x-4">
                <h3
                  id={tier.id}
                  className={`text-lg font-semibold leading-8 ${
                    tier.mostPopular ? 'text-primary' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {tier.name}
                </h3>
                {tier.mostPopular ? (
                  <p className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold leading-5 text-primary">
                    Most popular
                  </p>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">{tier.description}</p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{tier.price}</span>
                {tier.id !== 'tier-enterprise' && (
                  <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">/month</span>
                )}
              </p>
              <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.id === 'tier-enterprise' ? '/contact' : '/sign-up'}
                aria-describedby={tier.id}
                className={`${
                  tier.mostPopular
                    ? 'mt-8 block w-full'
                    : 'mt-8 block w-full'
                }`}
              >
                <Button
                  variant={tier.mostPopular ? 'default' : 'outline'}
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}