import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";


// TODO: Add a video to the hero section
export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-950 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            AI Sales Agents for Medical Device Companies
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Supercharge your medical device sales with AI-powered agents that qualify leads, personalize outreach, and close more deals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#demo" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
              Watch demo <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        
        <div id="demo" className="mt-16 flow-root sm:mt-24">
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:bg-white/5 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
            <video 
              className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 w-full"
              controls
              autoPlay
              muted
              loop
            >
              <source src="/mediagent_vid.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}