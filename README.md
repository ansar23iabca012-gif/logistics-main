# ASZE RELOCATION - Professional Logistics Website

> A modern, full-featured logistics and relocation services website built with React, Tailwind CSS, and Supabase.

---

## 🎯 Project Status: 

**Your website is ready to launch!** Just one step remaining: Create database tables in Supabase.

---

## 📚 Quick Links

- **[QUICK SETUP GUIDE](QUICK_SETUP_GUIDE.md)** ← Start here! (5 minutes)
- **[Complete Analysis](APPLICATION_ANALYSIS.md)** - Detailed system documentation
- **[Database Setup](SUPABASE_SETUP.sql)** - SQL script to create tables

---

## ✨ Features

### 🌐 Pages (18 Total)
- ✅ Home page with interactive service tabs
- ✅ About Us with customer testimonials carousel
- ✅ Services overview with 5 service cards
- ✅ 5 Individual service pages with dedicated forms
- ✅ Branches page (5 Indian cities)
- ✅ Gallery with 9 professional moving images
- ✅ Contact Us with form and location info
- ✅ Shipment Tracking with timeline display
- ✅ Admin Login (secure authentication)
- ✅ Admin Dashboard (data management & export)

### 🎨 Design
- Modern dark navy blue (#1a2545) and beige (#f5f1e8) color scheme
- Fully responsive (mobile, tablet, desktop)
- Smooth animations with Motion (Framer Motion)
- Professional gradient accents
- Company logo integration

### 🔧 Functionality
- Contact form with Supabase integration
- 5 service-specific quote request forms
- Shipment tracking system
- Admin authentication
- Data filtering and search
- CSV export functionality
- Error handling and validation

### 📞 Contact Information
- Phone: (+91) 620 057 3418
- Toll-Free: 1800 170 6200
- Email: info@aszerelocation.com

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Supabase account
- Access to project: `wjkceccwfkfevdbijvkh`

### Setup (5 Minutes)

**Step 1:** Run the SQL setup script
```bash
# Open SUPABASE_SETUP.sql
# Copy all SQL code
# Paste into Supabase SQL Editor
# Click "Run"
```

**Step 2:** Verify tables created
- Go to Supabase Table Editor
- Check for 4 tables:
  - `contact_submissions`
  - `quote_requests`
  - `shipments`
  - `shipment_updates`

**Step 3:** Test the website
- Submit a contact form
- Login to admin: admin@aszerelocation.com / Admin@123
- Check tracking: `ASZE2024001234`

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Main application
│   ├── routes.ts               # React Router config
│   ├── components/
│   │   └── Layout.tsx          # Header, Footer, Modals
│   └── pages/
│       ├── HomePage.tsx        # Landing page
│       ├── AboutPage.tsx       # Company info
│       ├── ServicesPage.tsx    # Services overview
│       ├── [Service]Page.tsx   # 5 service pages
│       ├── ContactPage.tsx     # Contact form
│       ├── TrackingPage.tsx    # Shipment tracking
│       └── Admin*.tsx          # Admin pages
├── lib/
│   └── supabase.ts            # Supabase client
└── styles/
    ├── theme.css              # CSS variables
    └── fonts.css              # Font imports
```

---

## 🗄️ Database Schema

### Tables

**contact_submissions**
- Stores contact form data
- Fields: name, email, phone, message

**quote_requests**
- Stores quote requests from all services
- Fields: service_type, name, email, phone, moving details

**shipments**
- Stores shipment tracking info
- Fields: tracking_number, customer, route, status

**shipment_updates**
- Stores timeline updates for shipments
- Fields: shipment_id, date, time, status, location

---

## 🔐 Admin Access

**Login URL:** `/admin/login`
**Email:** admin@aszerelocation.com
**Password:** Admin@123

⚠️ **Change password before production!**

---

## 🧪 Testing

### Test Contact Form
1. Go to `/contact`
2. Fill and submit form
3. Check admin dashboard

### Test Quote Request
1. Go to `/services/home-relocation`
2. Fill and submit form
3. Check admin dashboard → Quotes

### Test Tracking
1. Go to `/tracking`
2. Search: `ASZE2024001234`
3. View shipment timeline

### Test Admin
1. Login at `/admin/login`
2. View statistics
3. Filter and export data

---

## 📋 Pre-Launch Checklist

- [ ] Run SQL setup script in Supabase
- [ ] Test all forms
- [ ] Test tracking functionality
- [ ] Change admin password
- [ ] Update social media links
- [ ] Test on mobile devices
- [ ] Test on different browsers
- [ ] Add SSL certificate
- [ ] Set up custom domain

---

## 🛠️ Tech Stack

- **Frontend:** React 18.3.1
- **Routing:** React Router 7.13.0
- **Styling:** Tailwind CSS 4.1.12
- **Animations:** Motion (Framer Motion) 12.23.24
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **Build Tool:** Vite 6.3.5

---

## 📝 Available Scripts

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build
```

---

## 🐛 Troubleshooting

### "Table does not exist" error
→ Run `SUPABASE_SETUP.sql` in Supabase

### Admin dashboard shows no data
→ Submit test forms first, then refresh

### Tracking shows "not found"
→ Use sample tracking: `ASZE2024001234`

---

## 📖 Documentation

- **[Quick Setup Guide](QUICK_SETUP_GUIDE.md)** - 5-minute setup
- **[Application Analysis](APPLICATION_ANALYSIS.md)** - Complete documentation
- **[SQL Setup](SUPABASE_SETUP.sql)** - Database schema

---

## 🎯 Next Steps (Optional)

1. Email notifications for form submissions
2. Customer portal for tracking
3. Payment gateway integration
4. Multi-language support (Hindi, etc.)
5. Blog section for SEO
6. Google Maps integration

---

## 📞 Support

For issues or questions:
1. Check `APPLICATION_ANALYSIS.md` for detailed info
2. Review `SUPABASE_SETUP.sql` for database setup
3. Test with sample data provided

---

## 📄 License

Private project for ASZE RELOCATION

---

## 🙏 Acknowledgments

- Design inspiration: Modern logistics industry standards
- Icons: Lucide Icons
- Animations: Motion (Framer Motion)
- Backend: Supabase

---

**Built with ❤️ for ASZE RELOCATION**

*Est. 2020 - Your trusted partner in logistics excellence*
