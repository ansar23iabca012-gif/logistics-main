import { MapPin, Phone, Mail } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import branchImage from 'figma:asset/95e397b8ec5daec4155061b545c1dff7645fd268.png';
import delhiBranchImage from 'figma:asset/94566523153ff38443fda9723e80cda4e93e5e88.png';
import kolkataBranchImage from 'figma:asset/e4c3883e2fe9c01e1aee6c05952a9f36d7314ab0.png';
import mumbaiBranchImage from 'figma:asset/8e26185f17b99cd384934fa68027b7d1c538533a.png';
import hyderabadBranchImage from 'figma:asset/0547332b55883f87dc36ae2528c802a970bdc95f.png';

export default function BranchesPage() {
  const branches = [
    {
      city: "Bangalore",
      address: "#5/2, Ammani Byrathi Kane, Hennur Bande, Bangalore- 560043",
      phone: "+91 6201825015",
      email: "info@aszerelocation.com",
      image: branchImage
    },
    {
      city: "Delhi-NCR",
      address: "#434/13a, Tughlakabad Extension, Okhla Road, new Delhi-110019",
      phone: "+91 6200573418",
      email: "info@aszerelocation.com",
      image: delhiBranchImage
    },
    {
      city: "Mumbai",
      address: "Unit No. 2, Vasant Smruti Apartment, Dadiani Park, Thane West, Mumbai - 400608",
      phone: "+91 6282869772",
      email: "info@aszerelocation.com",
      image: mumbaiBranchImage
    },
    {
      city: "Hyderabad",
      address: "Prashanthi Enclave, Ward No 7 Secunderabad, Kanajiguda, Alwal, Secunderabad, Telangana 500011",
      phone: "+91 9693456962",
      email: "info@aszerelocation.com",
      image: hyderabadBranchImage
    },
    {
      city: "Kolkata",
      address: "#32/6, Kustia Road, Picnic Garden, Block-c, Kolkata -700039",
      phone: "+91 6200573418",
      email: "info@aszerelocation.com",
      image: kolkataBranchImage
    }
  ];

  return (
    <section className="py-20 bg-[#f5f1e8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#1a2545] mb-4">Our Branches</h2>
          <p className="text-xl text-gray-600">Find us in major cities across India</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {branches.map((branch, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition border-2 border-transparent hover:border-[#c93a3a] flex flex-col">
              <div className="relative h-48">
                <ImageWithFallback
                  src={branch.image}
                  alt={`${branch.city} branch`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white drop-shadow-lg">{branch.city}</h3>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-[#c93a3a] mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{branch.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-[#c93a3a] flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{branch.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#c93a3a] flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{branch.email}</p>
                  </div>
                </div>
                <button className="mt-6 w-full bg-[#c93a3a] text-white py-2 px-4 rounded-lg hover:bg-[#a83030] transition font-semibold shadow-md">
                  Visit Branch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}