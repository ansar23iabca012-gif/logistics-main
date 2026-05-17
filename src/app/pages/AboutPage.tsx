import { ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { useState } from 'react';

export default function AboutPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Mumbai",
      text: "ASZE RELOCATION made our home relocation incredibly smooth! Their team was professional, punctual, and handled all our belongings with great care. The entire process was stress-free from start to finish.",
      image: "https://images.unsplash.com/photo-1632144130358-6cfeed023e27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwdGVzdGltb25pYWwlMjByZXZpZXd8ZW58MXx8fHwxNzc1Mjg0MDIxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Priya Sharma",
      location: "Delhi",
      text: "Excellent service! I've moved several times, but ASZE RELOCATION is by far the best. Their attention to detail, transparent pricing, and friendly staff made the entire process smooth. Highly recommended!",
      image: "https://images.unsplash.com/photo-1753161023792-d240af5e6ef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRpc2ZpZWQlMjBjdXN0b21lciUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzUyMTI5OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Amit Patel",
      location: "Bangalore",
      text: "Outstanding experience! The packing was meticulous, delivery was on time, and everything arrived in perfect condition. ASZE RELOCATION exceeded all our expectations. Will definitely use their services again!",
      image: "https://images.unsplash.com/photo-1763739533280-602fda25d0e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHJldmlld3xlbnwxfHx8fDE3NzUzMjg2MDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      {/* Hero Section with Breadcrumb */}
      <section className="relative bg-[#1a2545] py-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Us</h1>
            <div className="flex items-center justify-center gap-2 text-white/90 text-base">
              <Link to="/" className="hover:underline hover:text-white transition">ASZE RELOCATION</Link>
              <ChevronRight className="w-4 h-4" />
              <span>About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Partner Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Content */}
            <div>
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  <span className="text-[#1a2545]">Your Trusted Partner for</span>{' '}
                  <span className="text-[#c93a3a]">Stress-Free Relocation</span>
                </h2>
                <div className="w-24 h-1 bg-[#c93a3a] mt-2"></div>
              </div>
              
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p>
                  Welcome to <span className="font-bold">ASZE RELOCATION</span>, your trusted partner in the world of seamless relocation solutions. With a proven track record of excellence, we stand as one of the most reliable packing and moving service providers in India. At <span className="font-bold">ASZE RELOCATION</span>, we understand the significance of a smooth and stress-free relocation experience, and we are committed to delivering unparalleled services to meet your unique needs.
                </p>
                
                <div>
                  <h3 className="text-xl font-bold text-[#1a2545] mb-3">Our Mission</h3>
                  <p>
                    At <span className="font-bold">ASZE RELOCATION</span>, our mission is to redefine the standards of packing and moving by providing efficient, reliable, and cost-effective solutions. We aim to exceed our customers' expectations and create lasting relationships built on trust and satisfaction.
                  </p>
                </div>
                
                <p>
                  Join countless satisfied customers who have experienced the seamless and reliable relocation services provided by <span className="font-bold">ASZE RELOCATION</span>. Let us take the stress out of your move, allowing you to focus on the excitement of a new beginning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Us for Your Packing and Moving Needs Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              <span className="text-[#1a2545]">Trust Us for Your </span>
              <span className="text-[#c93a3a]">Packing and Moving</span>
              <span className="text-[#1a2545]"> Needs</span>
            </h2>
            <div className="flex justify-center mt-2">
              <div className="w-16 h-1 bg-[#c93a3a]"></div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-center text-gray-700 max-w-4xl mx-auto mb-12 text-base md:text-lg">
            When it comes to relocating your cherished belongings, ASZE RELOCATION stands out as the premier choice for a seamless and reliable moving experience in India.
          </p>

          {/* 3x2 Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Reliability */}
            <div className="bg-white border-2 border-[#4a5fc1] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1590727264848-7d60c651f9b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZlcnMlMjBsb2FkaW5nJTIwYm94ZXMlMjB0cnVja3xlbnwxfHx8fDE3NzUzMjY3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Reliability"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#4a5fc1] mb-3 transition-colors duration-300 group-hover:text-[#c93a3a]">Reliability</h3>
                <p className="text-gray-700 leading-relaxed">
                  At ASZE RELOCATION, reliability is not just a word – it's a commitment. We understand the importance of your possessions and pledge to deliver them to your new destination securely and on time.
                </p>
              </div>
            </div>

            {/* Card 2: Professional Expertise */}
            <div className="bg-white border-2 border-[#4a5fc1] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1658946376097-dae10a8a8027?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb3ZlcnMlMjB3cmFwcGluZyUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NzUzMjY3Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional Expertise"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#4a5fc1] mb-3 transition-colors duration-300 group-hover:text-[#c93a3a]">Professional Expertise</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our team comprises skilled and experienced professionals who are masters in the art of packing and moving. From delicate items to bulky furniture, we handle each article with precision and care.
                </p>
              </div>
            </div>

            {/* Card 3: Customer Satisfaction */}
            <div className="bg-white border-2 border-[#4a5fc1] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1714647211923-a3881cd1300f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBtb3ZpbmclMjBzYXRpc2ZhY3Rpb258ZW58MXx8fHwxNzc1MzI2NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Customer Satisfaction"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#4a5fc1] mb-3 transition-colors duration-300 group-hover:text-[#c93a3a]">Customer Satisfaction</h3>
                <p className="text-gray-700 leading-relaxed">
                  We take a customer-centric approach, tailoring our services to meet your unique needs. From the initial consultation to the final delivery, We provide personalized and stress-free experience.
                </p>
              </div>
            </div>

            {/* Card 4: Nationwide Reach */}
            <div className="bg-white border-2 border-[#4a5fc1] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1635774152029-17bf0a3e1cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwaGlnaHdheSUyMGluZGlhfGVufDF8fHx8MTc3NTMyNjc2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Nationwide Reach"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#4a5fc1] mb-3 transition-colors duration-300 group-hover:text-[#c93a3a]">Nationwide Reach</h3>
                <p className="text-gray-700 leading-relaxed">
                  With a widespread network across India, ASZE RELOCATION is well-positioned to handle relocations to and from any part of the country.
                </p>
              </div>
            </div>

            {/* Card 5: Transparent and Fair Practices */}
            <div className="bg-white border-2 border-[#4a5fc1] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1758523671165-967ec4af0d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB1bnBhY2tpbmclMjBib3hlcyUyMG5ldyUyMGhvbWV8ZW58MXx8fHwxNzc1MzI2NzY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Transparent and Fair Practices"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#4a5fc1] mb-3 transition-colors duration-300 group-hover:text-[#c93a3a]">Transparent and Fair Practices</h3>
                <p className="text-gray-700 leading-relaxed">
                  Our transparent processes and pricing ensure that you have a clear understanding of the services you're receiving, fostering trust and confidence in our partnership.
                </p>
              </div>
            </div>

            {/* Card 6: Modern Infrastructure */}
            <div className="bg-white border-2 border-[#4a5fc1] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
              <div className="h-48 overflow-hidden">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1619302820124-e3b9d8a7f686?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZWxpdmVyeSUyMHRydWNrcyUyMGZsZWV0fGVufDF8fHx8MTc3NTMyNjc2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Modern Infrastructure"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#4a5fc1] mb-3 transition-colors duration-300 group-hover:text-[#c93a3a]">Modern Infrastructure</h3>
                <p className="text-gray-700 leading-relaxed">
                  Equipped with state-of-the-art technology and a fleet of well-maintained vehicles, ASZE RELOCATION ensures a smooth and efficient moving process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-4">
            <p className="text-[#c93a3a] text-sm font-bold tracking-widest mb-2 uppercase">TESTIMONIALS</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-[#1a2545]">
              What Our Clients Say
            </h2>
            <div className="flex justify-center mt-2">
              <div className="w-16 h-1 bg-[#c93a3a]"></div>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative mt-12">
            {/* Navigation Arrows */}
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-[#c93a3a] text-gray-700 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 -ml-5"
              aria-label="Previous testimonial"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white hover:bg-[#c93a3a] text-gray-700 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 -mr-5"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Testimonial Card */}
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl max-w-4xl mx-auto border-t-4 border-[#c93a3a]">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Customer Image */}
                <div className="flex-shrink-0">
                  <ImageWithFallback 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name} 
                    className="w-20 h-20 rounded-full object-cover border-4 border-[#c93a3a]/20"
                  />
                </div>
                
                {/* Testimonial Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-[#1a2545]">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-sm text-[#c93a3a] font-semibold">{testimonials[currentTestimonial].location}</p>
                  </div>
                  
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <svg className="w-10 h-10 text-[#c93a3a]/20" fill="currentColor" viewBox="0 0 32 32">
                      <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-6c0-2.2 1.8-4 4-4V8z" />
                    </svg>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                </div>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'bg-[#c93a3a] w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}