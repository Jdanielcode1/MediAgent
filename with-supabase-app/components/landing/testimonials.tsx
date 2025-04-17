const testimonials = [
    {
      content: "MediAgent has transformed our sales process. We've seen a 40% increase in qualified leads and our sales team can focus on high-value conversations instead of cold outreach.",
      author: "Sarah Johnson",
      role: "VP of Sales, MedTech Innovations",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      content: "The personalized outreach capabilities are incredible. Our response rates have doubled since implementing MediAgent, and the quality of conversations has improved dramatically.",
      author: "Michael Chen",
      role: "Sales Director, Surgical Solutions Inc.",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      content: "As a smaller medical device company, we couldn't afford a large sales team. MediAgent has allowed us to compete with industry giants by automating our prospecting and follow-ups.",
      author: "Emily Rodriguez",
      role: "CEO, NeuroCare Devices",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];
  
  export default function Testimonials() {
    return (
      <div id="testimonials" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">Testimonials</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by leading medical device companies
            </p>
          </div>
          <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 p-8 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                  <blockquote className="text-gray-700 dark:text-gray-300">
                    <p>"{testimonial.content}"</p>
                  </blockquote>
                  <div className="mt-6 flex items-center gap-x-4">
                    <img
                      className="h-10 w-10 rounded-full bg-gray-50"
                      src={testimonial.image}
                      alt=""
                    />
                    <div>
                      <div className="font-semibold">{testimonial.author}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }