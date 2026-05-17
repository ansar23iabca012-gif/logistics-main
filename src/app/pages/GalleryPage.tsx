import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'motion/react';

export default function GalleryPage() {
  const galleryImages = [
    {
      url: "https://images.unsplash.com/photo-1600725935160-f67ee4f6084a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWNraW5nJTIwYm94ZXMlMjBtb3ZpbmclMjBob3VzZXxlbnwxfHx8fDE3NzU2Mjc5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Packing & Moving Services"
    },
    {
      url: "https://images.unsplash.com/photo-1762235634111-f1c8a719c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZlcnMlMjBsb2FkaW5nJTIwZnVybml0dXJlJTIwdHJ1Y2t8ZW58MXx8fHwxNzc1NjI3OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Professional Loading Services"
    },
    {
      url: "https://images.unsplash.com/photo-1758219944627-4d9b32ed7019?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpbmclMjB0cnVjayUyMHJlbG9jYXRpb258ZW58MXx8fHwxNzc1NjI3OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Moving Truck Fleet"
    },
    {
      url: "https://images.unsplash.com/photo-1773125929765-99d4d67e831d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjBzdG9yYWdlJTIwYm94ZXN8ZW58MXx8fHwxNzc1NTQyNTM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Warehouse Storage Facility"
    },
    {
      url: "https://images.unsplash.com/photo-1657049199023-87fb439d47c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtb3ZlcnMlMjB0ZWFtfGVufDF8fHx8MTc3NTU1NzE5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Expert Moving Team"
    },
    {
      url: "https://images.unsplash.com/photo-1771848194072-3a7d2b37360c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYm9hcmQlMjBib3hlcyUyMHBhY2tpbmclMjBtYXRlcmlhbHN8ZW58MXx8fHwxNzc1NjI3OTE2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Quality Packing Materials"
    },
    {
      url: "https://images.unsplash.com/photo-1765747825066-48b0a6e1d7c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjB3cmFwcGluZyUyMHByb3RlY3Rpb258ZW58MXx8fHwxNzc1NjI3OTE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Furniture Protection Services"
    },
    {
      url: "https://images.unsplash.com/photo-1596626586515-b020adef4d0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjByZWxvY2F0aW9uJTIwZXF1aXBtZW50fGVufDF8fHx8MTc3NTYyNzkxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Office Relocation"
    },
    {
      url: "https://images.unsplash.com/photo-1771574205592-32e4e4381e6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2FkaW5nJTIwdHJ1Y2slMjBjYXJnbyUyMHRyYW5zcG9ydHxlbnwxfHx8fDE3NzU2Mjc5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Cargo Transport Services"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-[#1a2545] mb-4">Gallery</h2>
          <p className="text-xl text-gray-600">A glimpse into our packing and moving services</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div 
              key={index} 
              className="relative h-64 rounded-xl overflow-hidden group cursor-pointer shadow-md border-2 border-transparent"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                borderColor: "#c93a3a",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
              }}
            >
              <motion.div
                className="w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <ImageWithFallback 
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                initial={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
              >
                <motion.h3 
                  className="text-white text-xl font-bold px-4 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {image.title}
                </motion.h3>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
