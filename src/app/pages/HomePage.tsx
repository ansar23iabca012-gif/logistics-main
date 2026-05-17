import { Phone, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh"></div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-brand-gold/20 rounded-full blur-3xl animate-float"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-brand-red/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left Side - Glass Hero Card */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            {/* Floating Badge */}
            <motion.div
              className="absolute -top-6 -left-6 z-10"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="glass-light rounded-full px-4 py-2 shadow-float flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span className="text-sm font-semibold text-brand-navy">Premium Service</span>
              </div>
            </motion.div>

            <div className="glass-dark rounded-3xl p-10 shadow-float-lg transform-3d hover-lift relative overflow-hidden">
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>

              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Ready to make your move{' '}
                <span className="bg-gradient-to-r from-brand-gold to-brand-red bg-clip-text text-transparent animate-gradient">
                  hassle-free?
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl leading-relaxed text-white/90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Call our toll-free number now and experience the smoothest relocation journey ever!
              </motion.p>

              {/* Decorative Elements */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-gold/20 rounded-full blur-2xl"></div>
            </div>
          </motion.div>

          {/* Right Side - Toll Free Number Glass Card */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100, delay: 0.2 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-brand-navy mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="inline-block px-4 py-2 glass-light rounded-full shadow-float">
                Toll free number
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <motion.a
                href="tel:18001706200"
                className="group relative inline-flex items-center gap-6 glass-light rounded-3xl px-10 py-8 shadow-float-lg hover-lift overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 gradient-overlay-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Phone Icon with Glow */}
                <motion.div
                  className="relative z-10 w-20 h-20 bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-2xl flex items-center justify-center shadow-glow-gold group-hover:shadow-glow-red transition-all duration-300"
                  animate={{
                    rotate: [0, 5, -5, 5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Phone className="w-10 h-10 text-white" />
                </motion.div>

                <div className="relative z-10 text-left">
                  <div className="text-sm text-brand-navy/70 group-hover:text-white/90 mb-1 transition-colors">
                    Call Us Now
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-red to-brand-red-hover bg-clip-text text-transparent group-hover:from-white group-hover:to-white/90 transition-all">
                    1800 170 6200
                  </div>
                </div>

                {/* Arrow Icon */}
                <ArrowRight className="relative z-10 w-6 h-6 text-brand-navy group-hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300" />
              </motion.a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="mt-12 flex justify-center lg:justify-start gap-8 flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { label: '24/7 Support', value: 'Always Available' },
                { label: 'Trusted by', value: '10,000+ Customers' },
                { label: 'Service Rating', value: '4.9/5 ⭐' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass-card rounded-2xl px-6 py-4 shadow-float transform-3d hover-lift"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="text-sm text-brand-navy/60">{stat.label}</div>
                  <div className="text-lg font-bold text-brand-navy mt-1">{stat.value}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>

        {/* Floating CTA Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="glass-light rounded-3xl p-8 shadow-float-lg text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-brand-navy mb-4">
              Get Your Free Quote Today
            </h3>
            <p className="text-brand-navy/70 mb-6">
              Professional relocation services for homes, offices, vehicles, and fine art. Experience the ASZE difference.
            </p>
            <motion.button
              className="bg-gradient-to-r from-brand-red to-brand-red-hover text-white px-8 py-4 rounded-full font-semibold shadow-glow-red hover:shadow-glow-gold transition-all duration-300"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                // Navigate to services or open quote modal
                const header = document.querySelector('header');
                const getQuoteBtn = header?.querySelector('button');
                (getQuoteBtn as HTMLElement)?.click();
              }}
            >
              Request Quote Now →
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
