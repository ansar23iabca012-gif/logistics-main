import { Home, Building2, Palette, Car, Warehouse, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function ServicesPage() {
  const services = [
    {
      title: "Home Relocation",
      icon: Home,
      description: "Professional and stress-free home moving services across India. We handle your belongings with care and precision.",
      features: ["Professional Packing", "Safe Transportation", "Insurance Coverage"],
      path: "/services/home-relocation",
      color: "from-blue-500 to-blue-600",
      glowColor: "shadow-glow-blue"
    },
    {
      title: "Office Relocation",
      icon: Building2,
      description: "Seamless corporate relocation with minimal downtime. We ensure your business operations continue smoothly.",
      features: ["Minimal Downtime", "Dedicated Team", "Secure Handling"],
      path: "/services/office-relocation",
      color: "from-purple-500 to-purple-600",
      glowColor: "shadow-glow-purple"
    },
    {
      title: "Fine Art Logistics",
      icon: Palette,
      description: "Specialized handling and transportation of valuable artworks, antiques, and collectibles with utmost care.",
      features: ["Expert Handling", "Premium Insurance", "Climate-Controlled"],
      path: "/services/fine-art-logistics",
      color: "from-pink-500 to-pink-600",
      glowColor: "shadow-glow-pink"
    },
    {
      title: "Car Relocation",
      icon: Car,
      description: "Safe and reliable vehicle transportation services across India. Door-to-door delivery with real-time tracking.",
      features: ["Insured Transport", "Specialized Carriers", "GPS Tracking"],
      path: "/services/car-relocation",
      color: "from-orange-500 to-orange-600",
      glowColor: "shadow-glow-orange"
    },
    {
      title: "Warehouse Facility",
      icon: Warehouse,
      description: "Secure storage solutions with state-of-the-art facilities. Short-term and long-term warehousing options available.",
      features: ["24/7 Security", "Flexible Terms", "Climate Control"],
      path: "/services/warehouse-facility",
      color: "from-green-500 to-green-600",
      glowColor: "shadow-glow-green"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh"></div>

      {/* Animated Background Blobs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section - Glass Style */}
      <motion.div
        className="relative py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="inline-flex items-center gap-2 glass-light rounded-full px-6 py-3 mb-6 shadow-float"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-brand-navy">Comprehensive Solutions</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 text-brand-navy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Our <span className="bg-gradient-to-r from-brand-red to-brand-gold bg-clip-text text-transparent">Services</span>
          </motion.h1>

          <motion.p
            className="text-xl text-brand-navy/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Comprehensive relocation and logistics solutions tailored to your needs. Choose from our wide range of professional services.
          </motion.p>
        </div>
      </motion.div>

      {/* Services Grid - Glass Cards */}
      <div className="relative py-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="glass-card rounded-3xl overflow-hidden shadow-float-lg transform-3d hover-lift group relative"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
              >
                {/* Icon Header with Gradient */}
                <div className={`bg-gradient-to-br ${service.color} p-8 text-white relative overflow-hidden`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                  </div>

                  <motion.div
                    className="relative glass-light w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-float"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <service.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="relative text-2xl font-bold">{service.title}</h3>
                </div>

                {/* Content */}
                <div className="p-6 backdrop-blur-xl bg-white/30">
                  <p className="text-brand-navy/80 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + idx * 0.05 }}
                      >
                        <CheckCircle className="w-5 h-5 text-brand-gold flex-shrink-0" />
                        <span className="text-sm font-medium text-brand-navy">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Learn More Button */}
                  <Link to={service.path}>
                    <motion.div
                      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-brand-red to-brand-red-hover text-white py-3 px-6 rounded-xl font-semibold shadow-glow-red hover:shadow-glow-gold transition-all duration-300 group-hover:scale-105"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </Link>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-brand-gold/20 to-transparent rounded-bl-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action - Glass Style */}
      <motion.div
        className="relative py-20"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-dark rounded-3xl p-12 text-center shadow-float-lg overflow-hidden relative">
            {/* Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>

            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-4 text-white relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Need a <span className="bg-gradient-to-r from-brand-gold to-brand-red bg-clip-text text-transparent">Custom Solution?</span>
            </motion.h2>

            <motion.p
              className="text-xl text-white/80 mb-8 relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Contact us for personalized logistics solutions tailored to your specific requirements.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/contact">
                <motion.div
                  className="glass-light px-8 py-4 rounded-full font-semibold shadow-float text-lg hover-lift text-brand-navy backdrop-blur-xl"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(232, 182, 71, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.div>
              </Link>

              <a href="tel:+916200573418">
                <motion.div
                  className="bg-gradient-to-r from-brand-red to-brand-red-hover text-white px-8 py-4 rounded-full font-semibold shadow-glow-red hover:shadow-glow-gold transition-all text-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Call: +91 620 057 3418
                </motion.div>
              </a>
            </motion.div>

            {/* Decorative Blobs */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-gold/20 rounded-full blur-2xl"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-red/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
