/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  Search, 
  MapPin, 
  Plane, 
  Info, 
  ArrowRight, 
  Menu,
  Globe, 
  Hotel,
  ShieldCheck, 
  Clock, 
  ChevronRight,
  ChevronLeft,
  Send,
  Languages,
  Facebook,
  Instagram,
  QrCode,
  MessageCircle,
  X,
  Sparkles,
  Users,
  Calendar,
  FileText,
  AlertCircle
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { FEATURED_TRIPS, VISA_INFO, AD_IMAGES, type Trip } from "./constants";
import { consultGemini, getStructuredTripInfo, searchBooking, type TripConsultation, type BookingOption } from "./services/geminiService";
import { translations, type Language } from "./translations";
import { cn } from "./lib/utils";
import { Logo, TikTokIcon } from "./components/Icons";
import { InstallPrompt } from "./components/InstallPrompt";

const HERO_SLIDES = [
  "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=75&w=1600",
  "https://images.unsplash.com/photo-1528181304800-2f140819ad9c?auto=format&fit=crop&q=75&w=1600",
  "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&q=75&w=1600",
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=75&w=1600",
  "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=75&w=1600",
];

export default function App() {
  const [lang, setLang] = useState<Language>("en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [consultationResult, setConsultationResult] = useState<string | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedVisa, setSelectedVisa] = useState<any | null>(null);
  const [selectedAppointmentVisa, setSelectedAppointmentVisa] = useState<any | null>(null);
  const [appointmentForm, setAppointmentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    passportNumber: "",
    issueDate: "",
    expiryDate: "",
    dob: ""
  });
  const [tripDetails, setTripDetails] = useState<TripConsultation | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [whatsappForm, setWhatsappForm] = useState({
    destination: "",
    adults: 1,
    children: 0,
    departureDate: "",
    nights: 1,
    boardType: "All Inclusive"
  });

  // Booking states
  const [flightDeparture, setFlightDeparture] = useState("");
  const [flightQuery, setFlightQuery] = useState("");
  const [tripType, setTripType] = useState<"RT" | "OW">("RT");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [cabin, setCabin] = useState("Economy");
  const [flightResults, setFlightResults] = useState<BookingOption[]>([]);
  const [isSearchingFlights, setIsSearchingFlights] = useState(false);

  const [hotelQuery, setHotelQuery] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotelAdults, setHotelAdults] = useState(2);
  const [hotelChildren, setHotelChildren] = useState(0);
  const [hotelRooms, setHotelRooms] = useState(1);
  const [hotelResults, setHotelResults] = useState<BookingOption[]>([]);
  const [isSearchingHotels, setIsSearchingHotels] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState<BookingOption | null>(null);
  const [showFlightForm, setShowFlightForm] = useState(false);
  const [passengerData, setPassengerData] = useState({
    firstName: "",
    lastName: "",
    passportNumber: "",
    dateOfBirth: "",
    passportExpiryDate: ""
  });

  const [showDZD, setShowDZD] = useState(false);

  const VisaCard = ({ visa, idx, setSelectedVisa, setSelectedAppointmentVisa, t }: any) => (
    <div 
      className="group relative flex flex-col bg-zinc-900/40 rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand/50 transition-all duration-500 shadow-2xl backdrop-blur-sm"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={visa.image} 
          alt={visa.country} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
        
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
          <div className="bg-brand/90 backdrop-blur-md text-white md:text-sm text-[10px] font-black px-4 py-2 rounded-xl shadow-lg uppercase tracking-widest">
            {visa.type}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
            <Globe size={24} />
          </div>
        </div>

        <div className="absolute bottom-6 left-8">
          <h3 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-2xl">{visa.country}</h3>
        </div>
      </div>

      <div className="p-8 flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white/5 border border-white/5 p-5 rounded-3xl group-hover:border-brand/30 transition-all">
            <div className="flex items-center gap-2 text-brand mb-2">
              <Clock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Processing</span>
            </div>
            <p className="text-base font-bold text-white/90">{visa.processingTime}</p>
          </div>
          <div className="bg-brand/10 border border-brand/20 p-5 rounded-3xl group-hover:bg-brand/20 transition-all">
            <div className="flex items-center gap-2 text-brand mb-2">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Starting Price</span>
            </div>
            <p className="text-base font-bold text-brand">{visa.price || "Contact Us"}</p>
          </div>
        </div>

        <div className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/5 relative overflow-hidden group-hover:border-brand/10 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle size={40} className="text-brand" />
          </div>
          <div className="flex items-center gap-2 text-white/40 mb-3">
            <Info size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest tracking-[0.2em]">Key Requirements</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed font-medium line-clamp-2">
            {visa.requirement}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <div className="flex gap-4">
            <button 
              onClick={() => setSelectedVisa(visa)}
              className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-2xl font-bold hover:bg-white hover:text-black transition-all text-xs uppercase tracking-widest"
            >
              Requirements
            </button>
            <button 
              onClick={() => setSelectedAppointmentVisa(visa)}
              className="flex-1 bg-brand text-white py-4 rounded-2xl font-black hover:bg-white hover:text-brand transition-all text-xs uppercase tracking-widest shadow-xl shadow-brand/20"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const VisaCardCompact = ({ visa, idx, setSelectedVisa, t }: any) => (
    <div 
      className="glass rounded-[2rem] overflow-hidden border border-white/5 bg-white/5 hover:border-brand/30 transition-all group flex flex-col"
    >
      <div className="relative h-40 overflow-hidden">
        <img 
          src={visa.image} 
          alt={visa.country} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-6">
          <h3 className="text-xl font-bold">{visa.country}</h3>
          <p className="text-brand text-[10px] font-bold uppercase tracking-widest">{visa.type}</p>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/40 uppercase tracking-widest font-bold">Processing</span>
            <span className="font-bold">{visa.processingTime}</span>
          </div>
          {visa.price && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40 uppercase tracking-widest font-bold">Price</span>
              <span className="text-brand font-black">{visa.price}</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setSelectedVisa(visa)}
          className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-brand transition-all"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const formatDate = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2)}`;
    }
    return v;
  };

  const consultationRef = useRef<HTMLDivElement>(null);
  const flightRef = useRef<HTMLDivElement>(null);
  const hotelRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  // Parallax effects
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const yHero = useTransform(heroScroll, [0, 1], ["0%", "30%"]);

  const { scrollYProgress: flightScroll } = useScroll({
    target: flightRef,
    offset: ["start end", "end start"]
  });
  const yFlights = useTransform(flightScroll, [0, 1], ["-10%", "10%"]);

  const { scrollYProgress: hotelScroll } = useScroll({
    target: hotelRef,
    offset: ["start end", "end start"]
  });
  const yHotels = useTransform(hotelScroll, [0, 1], ["-10%", "10%"]);

  const SQUARE_RATE = 280;

  const formatPrice = (eur: number) => {
    if (showDZD) {
      return `${(eur * SQUARE_RATE).toLocaleString()} DA`;
    }
    return `€ ${eur.toLocaleString()}`;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  useEffect(() => {
    if (flightResults.length > 0) {
      setTimeout(() => {
        flightRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [flightResults]);

  useEffect(() => {
    if (hotelResults.length > 0) {
      setTimeout(() => {
        hotelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [hotelResults]);

  const handleFlightSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const departure = flightDeparture.trim() || "ALG";
    const destination = flightQuery.trim() || "DXB";

    setIsSearchingFlights(true);
    setFlightResults([]); // Clear previous results
    try {
      const results = await searchBooking(destination, "flight", lang, departure, {
        tripType,
        departureDate,
        returnDate,
        adults,
        cabin
      });
      setFlightResults(results);
    } catch (err) {
      console.error("Flight search failed:", err);
      setFlightResults([]);
    } finally {
      setIsSearchingFlights(false);
    }
  };

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelQuery.trim()) return;

    setIsSearchingHotels(true);
    setHotelResults([]); // Clear previous results
    try {
      const results = await searchBooking(hotelQuery, "hotel", lang, undefined, {
        checkInDate,
        checkOutDate,
        adults: hotelAdults,
        children: hotelChildren,
        rooms: hotelRooms
      });
      setHotelResults(results);
    } catch (err) {
      console.error("Hotel search failed:", err);
      setHotelResults([]);
    } finally {
      setIsSearchingHotels(false);
    }
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsConsulting(true);
    setConsultationResult(null);
    
    const result = await consultGemini(searchQuery, lang);
    setConsultationResult(result);
    setIsConsulting(false);

    // Scroll to result
    setTimeout(() => {
      consultationRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Visa Appointment Request: ${selectedAppointmentVisa?.country}`;
    const body = `
Visa Appointment Request Details:
--------------------------------
Country: ${selectedAppointmentVisa?.country}
First Name: ${appointmentForm.firstName}
Last Name: ${appointmentForm.lastName}
Email: ${appointmentForm.email}
Phone: ${appointmentForm.phone}
Passport Number: ${appointmentForm.passportNumber}
Passport Issue Date: ${appointmentForm.issueDate}
Passport Expiry Date: ${appointmentForm.expiryDate}
Date of Birth: ${appointmentForm.dob}
--------------------------------
    `.trim();

    window.location.href = `mailto:MYTRAVEL.DZ@GMAIL.COM?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSelectedAppointmentVisa(null);
    setAppointmentForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      passportNumber: "",
      issueDate: "",
      expiryDate: "",
      dob: ""
    });
  };

  const handleWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = "+213559942325";
    const message = `
*Travel Inquiry / طلب استفسار رحلة*
--------------------------------
*Destination / الوجهة:* ${whatsappForm.destination}
*Adults / بالغون:* ${whatsappForm.adults}
*Children / أطفال:* ${whatsappForm.children}
*Departure Date / تاريخ الانطلاق:* ${whatsappForm.departureDate}
*Nights / عدد الليالي:* ${whatsappForm.nights}
*Board Type / نوع الإقامة:* ${whatsappForm.boardType}
--------------------------------
    `.trim();
    
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleViewTripDetails = async (trip: Trip) => {
    setSelectedTrip(trip);
    setIsLoadingDetails(true);
    setTripDetails(null);
    
    const details = await getStructuredTripInfo(trip.location, lang);
    setTripDetails(details);
    setIsLoadingDetails(false);
  };

  const LanguageSwitcher = () => (
    <div className="relative">
      <button 
        onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
        className="flex items-center gap-2 text-white/70 hover:text-brand transition-all uppercase text-xs font-bold tracking-widest bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-brand/50"
      >
        <Languages size={16} className="text-brand" />
        {lang}
      </button>
      <AnimatePresence>
        {isLangMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 right-0 glass rounded-2xl overflow-hidden min-w-[140px] z-[60] border border-white/10 shadow-2xl"
          >
            {(["en", "fr", "ar"] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLang(l);
                  setIsLangMenuOpen(false);
                }}
                className={cn(
                  "w-full px-5 py-3 text-left text-xs font-bold uppercase tracking-widest hover:bg-brand hover:text-white transition-all flex items-center justify-between group",
                  lang === l ? "text-brand bg-brand/5" : "text-white/70"
                )}
              >
                {l === "en" ? "English" : l === "fr" ? "Français" : "العربية"}
                {lang === l && <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-black text-white bg-grid-white/[0.02]">
      <InstallPrompt />
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 px-10 py-4",
        scrolled 
          ? "glass border-b border-white/10 py-3 bg-black/60 backdrop-blur-xl" 
          : "bg-transparent border-b border-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-12">
          <div className="flex items-center gap-4 group cursor-pointer shrink-0">
            <div className={cn(
              "transition-all duration-500",
              scrolled ? "scale-90" : "scale-100"
            )}>
              <Logo className="w-12 h-12 shadow-lg shadow-brand/20 group-hover:shadow-brand/40 transition-all" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className={cn(
                "font-sans text-xl font-bold tracking-tight uppercase transition-all duration-500",
                scrolled ? "text-white" : "text-white text-glow"
              )}>My Travel</span>
              <span className="text-[7px] uppercase tracking-[0.2em] text-white/50 font-medium">The Pleasure of Travel</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white/70">
            {[
              { href: "#flights", label: "Book Fly" },
              { href: "#hotels", label: "Book Hotel" },
              { href: "#offers", label: t.nav.destinations },
              { href: "#visa-info", label: t.nav.visaInfo },
              { href: "#inquiry", label: (t as any).whatsapp.title }
            ].map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className="relative hover:text-brand transition-colors group py-2"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowDZD(!showDZD)}
                className="flex items-center gap-2 text-white/70 hover:text-brand transition-all uppercase text-xs font-bold tracking-widest bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-brand/50"
              >
                <div className="w-4 h-4 rounded-full border border-brand/50 flex items-center justify-center">
                  <div className={cn("w-2 h-2 rounded-full bg-brand transition-all", showDZD ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
                </div>
                {showDZD ? "DA" : "€"}
              </button>
              <LanguageSwitcher />
            </div>
            
            <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <a href="https://www.facebook.com/mytravel.dzd?locale=fr_FR" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/my_travel.dz?igsh=MTh1c2J6OGprcjAzbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.tiktok.com/@my_travel.dz" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">
                <TikTokIcon size={18} />
              </a>
            </div>

            <a 
              href="https://wa.me/213559942325" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand text-white px-6 py-2 rounded-full hover:bg-white hover:text-brand transition-all font-bold flex items-center gap-2"
            >
              <MessageCircle size={18} />
              {t.nav.bookNow}
            </a>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={() => setShowDZD(!showDZD)}
              className="flex items-center gap-2 text-white/70 hover:text-brand transition-all uppercase text-xs font-bold tracking-widest bg-white/5 px-3 py-2 rounded-lg border border-white/10 hover:border-brand/50"
            >
              <div className="w-4 h-4 rounded-full border border-brand/50 flex items-center justify-center">
                <div className={cn("w-2 h-2 rounded-full bg-brand transition-all", showDZD ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
              </div>
              {showDZD ? "DA" : "€"}
            </button>
            <LanguageSwitcher />
            <button className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full pt-32 px-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Currency</span>
                  <button 
                    onClick={() => setShowDZD(!showDZD)}
                    className="flex items-center gap-2 text-white/70 hover:text-brand transition-all uppercase text-xs font-bold tracking-widest bg-white/5 px-4 py-3 rounded-xl border border-white/10"
                  >
                    <div className="w-5 h-5 rounded-full border border-brand/50 flex items-center justify-center">
                      <div className={cn("w-2.5 h-2.5 rounded-full bg-brand transition-all", showDZD ? "opacity-100 scale-100" : "opacity-0 scale-0")} />
                    </div>
                    {showDZD ? "Dinar (DA)" : "Euro (€)"}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-white/40 font-bold">Language</span>
                  <LanguageSwitcher />
                </div>
              </div>

              <div className="flex flex-col gap-8 text-2xl font-bold uppercase tracking-tighter mt-12">
                {[
                  { href: "#flights", label: "Book Fly" },
                  { href: "#hotels", label: "Book Hotel" },
                  { href: "#offers", label: t.nav.destinations },
                  { href: "#visa-info", label: t.nav.visaInfo },
                  { href: "#inquiry", label: (t as any).whatsapp.title }
                ].map((link, idx) => (
                  <motion.a 
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-brand transition-colors flex items-center justify-between group"
                  >
                    {link.label}
                    <ArrowRight size={20} className="text-brand opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </motion.a>
                ))}
              </div>
              
              <div className="mt-auto mb-12 space-y-8">
                <div className="flex gap-8 py-6 border-y border-white/10">
                  <a href="https://www.facebook.com/mytravel.dzd?locale=fr_FR" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand transition-colors">
                    <Facebook size={28} />
                  </a>
                  <a href="https://www.instagram.com/my_travel.dz?igsh=MTh1c2J6OGprcjAzbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand transition-colors">
                    <Instagram size={28} />
                  </a>
                  <a href="https://www.tiktok.com/@my_travel.dz" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-brand transition-colors">
                    <TikTokIcon size={28} />
                  </a>
                </div>

                <a 
                  href="https://wa.me/213559942325" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-brand text-white py-6 rounded-[2rem] font-bold text-center flex items-center justify-center gap-3 shadow-xl shadow-brand/20"
                >
                  <MessageCircle size={24} />
                  {t.nav.bookNow}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              src={HERO_SLIDES[currentSlide]} 
              alt="Travel Destination" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Slider Controls */}
        <div className="absolute inset-0 z-10 flex items-center justify-between px-4 md:px-8 pointer-events-none">
          <button 
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-brand hover:border-brand transition-all pointer-events-auto"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white hover:bg-brand hover:border-brand transition-all pointer-events-auto"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6">
          <div className="flex gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={cn(
                  "w-12 h-1 transition-all duration-500 rounded-full",
                  currentSlide === idx ? "bg-brand w-20" : "bg-white/20 hover:bg-white/40"
                )}
              />
            ))}
          </div>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-brand to-transparent" />
          </motion.div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="absolute inset-0 -z-10 bg-brand/10 blur-[100px] rounded-full scale-150" />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand uppercase tracking-[0.4em] text-lg font-black mb-6 block drop-shadow-lg text-glow">
              {t.hero.subtitle}
            </span>
            <h1 className="font-sans text-4xl md:text-7xl font-bold uppercase tracking-tight mb-12 leading-tight drop-shadow-2xl hero-text-shadow">
              {t.hero.title}
            </h1>
            
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <a 
                  href="#flights"
                  className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand hover:text-white transition-all shadow-2xl flex items-center justify-center gap-3 group border-2 border-transparent hover:border-brand"
                >
                  <Plane className="group-hover:rotate-12 transition-transform" />
                  {t.hero.bookFly}
                </a>
                <a 
                  href="#hotels"
                  className="w-full md:w-auto bg-brand/20 backdrop-blur-md text-white border-2 border-white/20 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-brand hover:border-brand transition-all shadow-2xl flex items-center justify-center gap-3 group"
                >
                  <Globe className="group-hover:scale-110 transition-transform" />
                  {t.hero.bookHotel}
                </a>
                <a 
                  href="#inquiry"
                  className="w-full md:w-auto bg-brand text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-brand transition-all shadow-2xl shadow-brand/20 flex items-center justify-center gap-3 group border-2 border-brand hover:border-white"
                >
                  <MessageCircle className="group-hover:scale-110 transition-transform" />
                  {t.hero.whatsappInquiry}
                </a>
              </div>
          </motion.div>
        </div>
      </header>

      {/* WhatsApp Inquiry Section */}
      <section id="inquiry" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=1920" 
            alt="Communication Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/20 to-zinc-950/60" />
        </div>

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-4">
              <MessageCircle size={16} /> {(t as any).whatsapp.title}
            </div>
            <h2 className="font-sans text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4">{(t as any).whatsapp.subtitle}</h2>
          </div>

          <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
            <form onSubmit={handleWhatsAppInquiry} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-2">
                    {(t as any).whatsapp.destination}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" size={20} />
                    <input 
                      required
                      type="text" 
                      placeholder={(t as any).whatsapp.placeholder}
                      value={whatsappForm.destination}
                      onChange={(e) => setWhatsappForm({...whatsappForm, destination: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:border-brand transition-all text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-2">
                    {(t as any).whatsapp.departureDate}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand" size={20} />
                    <input 
                      required
                      type="date" 
                      value={whatsappForm.departureDate}
                      onChange={(e) => setWhatsappForm({...whatsappForm, departureDate: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:border-brand transition-all text-lg text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-2">
                    {(t as any).whatsapp.adults}
                  </label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={whatsappForm.adults}
                    onChange={(e) => setWhatsappForm({...whatsappForm, adults: parseInt(e.target.value)})}
                    className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand transition-all text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-2">
                    {(t as any).whatsapp.children}
                  </label>
                  <input 
                    required
                    type="number" 
                    min="0"
                    value={whatsappForm.children}
                    onChange={(e) => setWhatsappForm({...whatsappForm, children: parseInt(e.target.value)})}
                    className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand transition-all text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-2">
                    {(t as any).whatsapp.nights}
                  </label>
                  <input 
                    required
                    type="number" 
                    min="1"
                    value={whatsappForm.nights}
                    onChange={(e) => setWhatsappForm({...whatsappForm, nights: parseInt(e.target.value)})}
                    className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-5 px-6 focus:outline-none focus:border-brand transition-all text-lg"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-white/40 font-bold ml-2">
                  {(t as any).whatsapp.boardType}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "All Inclusive", label: (t as any).whatsapp.allInclusive },
                    { id: "Half Board", label: (t as any).whatsapp.halfBoard },
                    { id: "Breakfast", label: (t as any).whatsapp.breakfast }
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setWhatsappForm({...whatsappForm, boardType: option.id})}
                      className={cn(
                        "py-4 px-6 rounded-2xl border text-sm font-bold transition-all",
                        whatsappForm.boardType === option.id 
                          ? "bg-brand border-brand text-white shadow-lg shadow-brand/20" 
                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand text-white py-6 rounded-2xl font-bold text-xl hover:bg-white hover:text-brand transition-all shadow-2xl shadow-brand/30 flex items-center justify-center gap-3 mt-12 group"
              >
                <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
                {(t as any).whatsapp.send}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Flight Search Results */}
      <section id="flights" ref={flightRef} className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544016768-982d1554f0b9?auto=format&fit=crop&q=80&w=1920" 
            alt="Flight Background" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/40 via-transparent to-zinc-950/40" />
        </div>
        <motion.div style={{ y: yFlights }} className="absolute top-0 right-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center gap-8 mb-16">
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-6 translate-x-12">
                <div className="flex items-center gap-2 pr-4 border-r border-brand/20">
                  <Plane size={16} /> {t.booking.flight}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    setShowDZD(!showDZD);
                  }}
                  className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
                >
                  <QrCode size={14} className={showDZD ? "text-brand" : "text-white/40"} />
                  <span>{showDZD ? "DA" : "€"}</span>
                </button>
              </div>
              <h2 className="font-sans text-4xl md:text-6xl font-bold uppercase tracking-tight">{t.booking.flight}</h2>
            </div>
            
            <form onSubmit={handleFlightSearch} className="w-full max-w-6xl">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <div className="flex bg-white/5 backdrop-blur-xl p-1 rounded-xl border border-white/10 shadow-xl">
                  <button 
                    type="button"
                    onClick={() => setTripType("RT")}
                    className={cn(
                      "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                      tripType === "RT" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/40 hover:text-white"
                    )}
                  >
                    {t.booking.roundTrip}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTripType("OW")}
                    className={cn(
                      "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                      tripType === "OW" ? "bg-brand text-white shadow-lg shadow-brand/20" : "text-white/40 hover:text-white"
                    )}
                  >
                    {t.booking.oneWay}
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                  <Users size={14} className="text-brand" />
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{t.booking.adults}</span>
                    <input 
                      type="number" 
                      min="1" 
                      value={adults} 
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      className="bg-transparent w-8 text-xs font-black focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                  <Plane size={14} className="text-brand" />
                  <select 
                    value={cabin}
                    onChange={(e) => setCabin(e.target.value)}
                    className="bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none appearance-none cursor-pointer text-white"
                  >
                    <option value="Economy" className="bg-zinc-900">{t.booking.economy}</option>
                    <option value="Business" className="bg-zinc-900">{t.booking.business}</option>
                    <option value="First" className="bg-zinc-900">{t.booking.firstClass}</option>
                  </select>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand/10 via-brand/20 to-brand/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative glass p-1.5 rounded-[2rem] flex flex-col lg:flex-row gap-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
                  <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    <div className="relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input">
                      <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.departure}</label>
                      <div className="flex items-center gap-3">
                        <Search size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                        <input 
                          type="text" 
                          placeholder="ALG"
                          value={flightDeparture}
                          onChange={(e) => setFlightDeparture(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/5 tracking-tight text-white"
                        />
                      </div>
                    </div>
                    <div className="relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input">
                      <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.arrival}</label>
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                        <input 
                          type="text" 
                          placeholder="DXB"
                          value={flightQuery}
                          onChange={(e) => setFlightQuery(e.target.value)}
                          className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/5 tracking-tight text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "grid gap-1.5 transition-all duration-500",
                    tripType === "OW" ? "flex-1 grid-cols-1" : "flex-[1.5] grid-cols-1 md:grid-cols-2"
                  )}>
                    <div className="relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input">
                      <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.departureDate}</label>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                        <input 
                          type="text" 
                          placeholder={t.booking.datePlaceholder}
                          value={departureDate}
                          onChange={(e) => setDepartureDate(formatDate(e.target.value))}
                          className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/10 text-white"
                        />
                      </div>
                    </div>
                    {tripType === "RT" && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input"
                      >
                        <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.returnDate}</label>
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                          <input 
                            type="text" 
                            placeholder={t.booking.datePlaceholder}
                            value={returnDate}
                            onChange={(e) => setReturnDate(formatDate(e.target.value))}
                            className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/10 text-white"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSearchingFlights}
                    className="bg-brand text-white px-10 py-4 rounded-[1.5rem] font-black hover:bg-white hover:text-brand transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 lg:min-w-[180px] shadow-xl group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    {isSearchingFlights ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search size={20} className="group-hover/btn:scale-110 transition-transform duration-300" />
                        <span className="text-xs uppercase tracking-widest">{t.booking.searchBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <AnimatePresence>
            {isSearchingFlights && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-brand/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  <Plane className="absolute inset-0 m-auto text-brand animate-bounce" size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-widest mb-2">{t.booking.searchingFlights}</h3>
                <p className="text-white/40 font-medium">Finding the best deals for your journey...</p>
              </motion.div>
            )}

            {!isSearchingFlights && flightResults.length === 0 && flightQuery && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-white/20">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.booking.noFlights}</h3>
                <p className="text-white/40">{t.booking.tryAdjust}</p>
              </motion.div>
            )}

            {flightResults.length > 0 && !isSearchingFlights && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-6"
              >
                {flightResults.map((flight, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass p-6 md:p-8 rounded-[2rem] border border-white/10 hover:border-brand/30 transition-all group"
                  >
                    <div className="flex flex-col gap-6">
                      {/* Price and Action Section Move to Top */}
                      <div className="flex flex-col md:flex-row items-center justify-between bg-white/5 p-6 rounded-2xl border border-white/5 group-hover:border-brand/30 transition-all shadow-inner">
                        <div className="text-3xl font-black text-brand">{formatPrice(flight.priceEUR)}</div>
                        <button 
                          onClick={() => {
                            setSelectedFlight(flight);
                            setShowFlightForm(true);
                          }}
                          className="w-full md:w-auto bg-brand text-white px-10 py-4 rounded-xl font-bold hover:bg-white hover:text-brand transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand/20 active:scale-95 mt-4 md:mt-0"
                        >
                          {t.nav.bookNow}
                          <ArrowRight size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row items-center justify-between gap-8 order-last md:order-none">
                        <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                          <Plane className="text-brand" size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-1">{flight.airline}</h3>
                          <p className="text-white/40 text-sm font-mono uppercase tracking-widest">{flight.flightNumber}</p>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center gap-8 md:gap-12">
                        <div className="text-center">
                          <p className="text-2xl font-bold mb-1">{flight.departureTime}</p>
                          <p className="text-white/40 text-xs uppercase tracking-widest">Departure</p>
                        </div>
                        <div className="flex-1 max-w-[200px] flex flex-col items-center gap-2">
                          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">{flight.duration}</p>
                          <div className="w-full h-px bg-white/10 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-brand" />
                          </div>
                          <p className="text-[10px] text-brand uppercase tracking-widest font-bold">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop(s)`}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold mb-1">{flight.arrivalTime}</p>
                          <p className="text-white/40 text-xs uppercase tracking-widest">Arrival</p>
                        </div>
                      </div>

                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Hotel Search Results */}
      <section id="hotels" ref={hotelRef} className="py-24 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920" 
            alt="Hotel Background" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>
        <motion.div style={{ y: yHotels }} className="absolute bottom-0 left-0 w-96 h-96 bg-brand/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center gap-8 mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-4">
                <Globe size={16} /> {t.booking.hotel}
              </div>
              <h2 className="font-sans text-4xl md:text-6xl font-bold uppercase tracking-tight">{t.booking.hotel}</h2>
            </div>
            
            <form onSubmit={handleHotelSearch} className="w-full max-w-6xl">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 shadow-xl">
                  <Users size={14} className="text-brand" />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{t.booking.adults}</span>
                      <input 
                        type="number" 
                        min="1" 
                        value={hotelAdults} 
                        onChange={(e) => setHotelAdults(parseInt(e.target.value))}
                        className="bg-transparent w-8 text-xs font-black focus:outline-none text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{t.booking.children}</span>
                      <input 
                        type="number" 
                        min="0" 
                        value={hotelChildren} 
                        onChange={(e) => setHotelChildren(parseInt(e.target.value))}
                        className="bg-transparent w-8 text-xs font-black focus:outline-none text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{t.booking.rooms}</span>
                      <input 
                        type="number" 
                        min="1" 
                        value={hotelRooms} 
                        onChange={(e) => setHotelRooms(parseInt(e.target.value))}
                        className="bg-transparent w-8 text-xs font-black focus:outline-none text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand/10 via-brand/20 to-brand/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative glass p-1.5 rounded-[2rem] flex flex-col lg:flex-row gap-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl">
                  <div className="flex-[1.5] relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input">
                    <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.hotel}</label>
                    <div className="flex items-center gap-3">
                      <Search size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                      <input 
                        type="text" 
                        placeholder={t.booking.searchPlaceholder}
                        value={hotelQuery}
                        onChange={(e) => setHotelQuery(e.target.value)}
                        className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/5 tracking-tight text-white"
                      />
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    <div className="relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input">
                      <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.checkIn}</label>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                        <input 
                          type="text" 
                          placeholder={t.booking.datePlaceholder}
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(formatDate(e.target.value))}
                          className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/10 text-white"
                        />
                      </div>
                    </div>
                    <div className="relative bg-white/5 border border-white/5 rounded-[1.5rem] p-4 focus-within:border-brand/40 focus-within:bg-brand/5 transition-all duration-300 group/input">
                      <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 ml-1 group-focus-within/input:text-brand transition-colors">{t.booking.checkOut}</label>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-brand/40 group-focus-within/input:text-brand transition-colors" />
                        <input 
                          type="text" 
                          placeholder={t.booking.datePlaceholder}
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(formatDate(e.target.value))}
                          className="w-full bg-transparent focus:outline-none text-lg font-black placeholder:text-white/10 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSearchingHotels}
                    className="bg-brand text-white px-10 py-4 rounded-[1.5rem] font-black hover:bg-white hover:text-brand transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-50 lg:min-w-[180px] shadow-xl group/btn relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    {isSearchingHotels ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Search size={20} className="group-hover/btn:scale-110 transition-transform duration-300" />
                        <span className="text-xs uppercase tracking-widest">{t.booking.searchBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <AnimatePresence>
            {isSearchingHotels && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="relative w-24 h-24 mb-8">
                  <div className="absolute inset-0 border-4 border-brand/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  <Hotel className="absolute inset-0 m-auto text-brand animate-bounce" size={32} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-widest mb-2">{t.booking.searchingHotels}</h3>
                <p className="text-white/40 font-medium">Searching for the perfect stay for you...</p>
              </motion.div>
            )}

            {!isSearchingHotels && hotelResults.length === 0 && hotelQuery && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 text-white/20">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold mb-2">{t.booking.noHotels}</h3>
                <p className="text-white/40">{t.booking.tryAdjust}</p>
              </motion.div>
            )}

            {hotelResults.length > 0 && !isSearchingHotels && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {hotelResults.map((hotel, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-brand/30 transition-all group flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800&sig=${idx}`} 
                        alt={hotel.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-6 right-6 bg-brand text-white px-4 py-2 rounded-xl font-bold shadow-xl">
                        {formatPrice(hotel.priceEUR)}
                        <span className="text-[10px] block opacity-70 uppercase tracking-widest font-medium">{t.booking.pricePerNight}</span>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-4">{hotel.name}</h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1">{hotel.details}</p>
                      <button 
                        onClick={() => {
                          const message = `I want to book hotel: ${hotel.name}`;
                          window.open(`https://wa.me/213559942325?text=${encodeURIComponent(message)}`, "_blank");
                        }}
                        className="w-full bg-brand/5 border border-brand/20 text-white py-4 rounded-2xl font-bold hover:bg-brand hover:border-brand transition-all flex items-center justify-center gap-2"
                      >
                        {t.nav.bookNow}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Offers */}
      <section id="offers" className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles size={16} /> {t.offers.title}
              </div>
              <h2 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tight mb-6">{t.offers.title}</h2>
              <p className="text-white/50 text-xl leading-relaxed">{t.offers.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowDZD(!showDZD)}
                className="glass px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
              >
                Currency: {showDZD ? "DZD" : "EUR"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURED_TRIPS.map((trip, idx) => (
              <motion.div 
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-[500px] rounded-[3rem] overflow-hidden cursor-pointer"
                onClick={() => handleViewTripDetails(trip)}
              >
                <img 
                  src={trip.image} 
                  alt={trip.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                
                <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {trip.duration}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center shadow-xl shadow-brand/20 group-hover:rotate-45 transition-transform">
                    <ArrowRight size={20} />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest mb-2">
                    <MapPin size={14} /> {trip.location}
                  </div>
                  <h3 className="text-3xl font-bold mb-4 leading-tight">{trip.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand mb-1">{t.offers.startingFrom}</span>
                      <span className="text-2xl font-black text-white">{trip.price}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/50 group-hover:text-brand transition-colors">
                      {t.offers.details}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visa Services Section */}
      <section id="visa-info" className="py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=1920" 
            alt="Visa Background" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 blur-[150px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-6">
              <ShieldCheck size={16} /> {t.visa.title}
            </div>
            <h2 className="font-sans text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">{t.visa.title}</h2>
            <p className="text-white/50 text-xl leading-relaxed">{t.visa.description}</p>
          </div>

          {/* Main Visas */}
          <div className="mb-24">
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px w-12 bg-brand" />
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">Main Visa Services</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {VISA_INFO.filter(v => v.category === 'main').map((visa, idx) => (
                <VisaCard key={visa.id} visa={visa} idx={idx} setSelectedVisa={setSelectedVisa} setSelectedAppointmentVisa={setSelectedAppointmentVisa} t={t} />
              ))}
            </div>
          </div>

          {/* E-Visas */}
          <div className="mb-24">
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px w-12 bg-brand" />
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">E-Visa Services</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {VISA_INFO.filter(v => v.category === 'evisa').map((visa, idx) => (
                <VisaCard key={visa.id} visa={visa} idx={idx} setSelectedVisa={setSelectedVisa} setSelectedAppointmentVisa={setSelectedAppointmentVisa} t={t} />
              ))}
            </div>
          </div>

          {/* Residence Services */}
          <div>
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px w-12 bg-brand" />
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">Residence Services</h3>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {VISA_INFO.filter(v => v.category === 'residence').map((visa, idx) => (
                <VisaCard key={visa.id} visa={visa} idx={idx} setSelectedVisa={setSelectedVisa} setSelectedAppointmentVisa={setSelectedAppointmentVisa} t={t} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Offers / Advertisements Section */}
      <section className="py-24 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={16} /> {lang === 'ar' ? 'عروض حصرية' : lang === 'fr' ? 'Offres Exclusives' : 'Exclusive Offers'}
            </div>
            <h2 className="font-sans text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">
              {lang === 'ar' ? 'أفضل العروض والخصومات' : lang === 'fr' ? 'Meilleures Offres & Promos' : 'Best Offers & Promos'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AD_IMAGES.map((ad, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="group relative aspect-square overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl"
              >
                <img 
                  src={ad} 
                  alt={`Promotion ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <button className="w-full bg-brand text-white py-4 rounded-2xl font-bold shadow-xl shadow-brand/20">
                    {lang === 'ar' ? 'احجز الآن' : lang === 'fr' ? 'Réserver Maintenant' : 'Book Now'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Travel Consultation Section */}
      <section className="py-32 px-6 bg-zinc-950 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1920" 
            alt="Consultation Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-transparent to-zinc-950" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="glass p-12 md:p-20 rounded-[4rem] border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles size={16} /> AI Travel Expert
                </div>
                <h2 className="font-sans text-4xl md:text-6xl font-bold uppercase tracking-tight mb-8">Plan Your Dream Trip</h2>
                <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed">
                  Ask our AI expert anything about your next destination, from hidden gems to visa advice.
                </p>
              </div>

              <form onSubmit={handleConsult} className="relative max-w-3xl mx-auto mb-12">
                <input 
                  type="text" 
                  placeholder="Where do you want to go? What's your budget?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand/5 border border-brand/20 rounded-[2rem] py-8 pl-10 pr-40 focus:outline-none focus:border-brand transition-all text-xl"
                />
                <button 
                  type="submit"
                  disabled={isConsulting}
                  className="absolute right-4 top-4 bottom-4 bg-brand text-white px-10 rounded-2xl font-bold hover:bg-white hover:text-brand transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isConsulting ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={20} />}
                  Consult
                </button>
              </form>

              <AnimatePresence>
                {consultationResult && (
                  <motion.div 
                    ref={consultationRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-10 rounded-[2.5rem] border border-brand/20 bg-brand/5"
                  >
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/10">
                      <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center">
                        <Sparkles className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold uppercase tracking-tight">{t.consultation.report}</h3>
                        <p className="text-brand text-[10px] font-bold uppercase tracking-widest">Expert AI Analysis</p>
                      </div>
                    </div>
                    <div className="prose prose-invert prose-brand max-w-none">
                      <ReactMarkdown>{consultationResult}</ReactMarkdown>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                      <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10">
                        <ShieldCheck className="text-brand mb-4" size={24} />
                        <h4 className="font-bold mb-2">{t.consultation.visaSupport}</h4>
                        <p className="text-white/40 text-xs leading-relaxed">{t.consultation.visaSupportDesc}</p>
                      </div>
                      <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10">
                        <Clock className="text-brand mb-4" size={24} />
                        <h4 className="font-bold mb-2">{t.consultation.fastTrack}</h4>
                        <p className="text-white/40 text-xs leading-relaxed">{t.consultation.fastTrackDesc}</p>
                      </div>
                      <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10">
                        <Globe className="text-brand mb-4" size={24} />
                        <h4 className="font-bold mb-2">{t.consultation.expertAdvice}</h4>
                        <p className="text-white/40 text-xs leading-relaxed">{t.consultation.expertAdviceDesc}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <Logo className="w-12 h-12" />
                <span className="font-sans text-2xl font-bold tracking-tight uppercase">My Travel</span>
              </div>
              <p className="text-white/40 leading-relaxed text-lg">
                {t.footer.desc}
              </p>
              <div className="flex items-center gap-4">
                <a href="https://www.facebook.com/mytravel.dzd?locale=fr_FR" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand transition-all group">
                  <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.instagram.com/my_travel.dz?igsh=MTh1c2J6OGprcjAzbA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand transition-all group">
                  <Instagram size={20} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.tiktok.com/@my_travel.dz" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-brand transition-all group">
                  <TikTokIcon size={20} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand mb-10">{t.footer.quickLinks}</h4>
              <ul className="space-y-6 text-white/50 font-medium">
                <li><a href="#flights" className="hover:text-white transition-colors">Book Fly</a></li>
                <li><a href="#hotels" className="hover:text-white transition-colors">Book Hotel</a></li>
                <li><a href="#offers" className="hover:text-white transition-colors">{t.nav.destinations}</a></li>
                <li><a href="#visa-info" className="hover:text-white transition-colors">{t.nav.visaInfo}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-brand mb-10">{t.footer.contactUs}</h4>
              <ul className="space-y-6 text-white/50 font-medium">
                <li className="flex items-start gap-4">
                  <MapPin size={20} className="text-brand shrink-0" />
                  <span>{t.footer.address}</span>
                </li>
                <li className="flex items-center gap-4">
                  <Send size={20} className="text-brand shrink-0" />
                  <span>{t.footer.email}</span>
                </li>
                <li className="flex items-center gap-4">
                  <Clock size={20} className="text-brand shrink-0" />
                  <span>{t.footer.hours}</span>
                </li>
              </ul>
            </div>

            <div className="glass p-8 rounded-[2.5rem] border border-white/10 text-center">
              <QrCode size={48} className="mx-auto mb-6 text-brand" />
              <h4 className="font-bold mb-2">{t.qr.title}</h4>
              <p className="text-white/40 text-xs leading-relaxed mb-6">{t.qr.desc}</p>
              <div className="bg-white p-2 rounded-2xl inline-block">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/my_travel.dz" 
                  alt="QR Code" 
                  className="w-24 h-24"
                />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/30 text-xs font-bold uppercase tracking-widest">
            <p>© {new Date().getFullYear()} My Travel. {t.footer.rights}</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {/* Trip Details Modal */}
        {selectedTrip && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrip(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-950 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                <img 
                  src={selectedTrip.image} 
                  alt={selectedTrip.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 md:p-12 flex-1 overflow-y-auto">
                <button 
                  onClick={() => setSelectedTrip(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                >
                  <X size={20} />
                </button>
                
                <div className="mb-10">
                  <div className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest mb-4">
                    <MapPin size={14} /> {selectedTrip.location}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight">{selectedTrip.title}</h2>
                  <p className="text-white/50 text-lg leading-relaxed">{selectedTrip.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <Clock className="text-brand mb-4" size={24} />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Duration</h4>
                    <p className="text-xl font-bold">{selectedTrip.duration}</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <ShieldCheck className="text-brand mb-4" size={24} />
                    <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Status</h4>
                    <p className="text-xl font-bold">{t.modal.visaSupport}</p>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl border border-brand/20 bg-brand/5 mb-10">
                  <h4 className="flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest mb-6">
                    <Sparkles size={16} /> {t.modal.travelConsultation}
                  </h4>
                  {isLoadingDetails ? (
                    <div className="flex items-center gap-4 text-white/40">
                      <div className="w-5 h-5 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                      {t.modal.fetching}
                    </div>
                  ) : tripDetails ? (
                    <div className="space-y-8">
                      <div>
                        <h5 className="font-bold mb-2 text-white/80">{t.modal.visaReq}</h5>
                        <p className="text-sm text-white/50 leading-relaxed">{tripDetails.visaRequirements}</p>
                      </div>
                      <div>
                        <h5 className="font-bold mb-2 text-white/80">{t.modal.howToApply}</h5>
                        <p className="text-sm text-white/50 leading-relaxed">{tripDetails.howToApply}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <h5 className="font-bold mb-2 text-white/80">{t.modal.bestTime}</h5>
                          <p className="text-sm text-white/50 leading-relaxed">{tripDetails.bestTimeToVisit}</p>
                        </div>
                        <div>
                          <h5 className="font-bold mb-2 text-white/80">{t.modal.estimatedCost}</h5>
                          <p className="text-sm text-white/50 leading-relaxed">{tripDetails.estimatedCost}</p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-8 pt-8 border-t border-white/10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1">Total Price</p>
                    <p className="text-3xl font-black text-brand">{selectedTrip.price}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const message = `I want to book trip: ${selectedTrip.title}`;
                      window.open(`https://wa.me/213559942325?text=${encodeURIComponent(message)}`, "_blank");
                    }}
                    className="bg-brand text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-brand transition-all shadow-xl shadow-brand/20"
                  >
                    {t.modal.apply}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Visa Details Modal */}
        {selectedVisa && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVisa(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-950 rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedVisa(null)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-12">
                <div className="w-20 h-20 rounded-3xl bg-brand/10 flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-brand" size={40} />
                </div>
                <h2 className="text-4xl font-bold mb-2 uppercase tracking-tight">{selectedVisa.country}</h2>
                <p className="text-brand text-xs font-bold uppercase tracking-widest">{selectedVisa.type}</p>
              </div>

              <div className="space-y-8 mb-12">
                {selectedVisa.price && (
                  <div className="bg-brand text-white p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-brand/20">
                    <span className="text-xs font-bold uppercase tracking-widest opacity-70">Service Fee</span>
                    <span className="text-2xl font-black">{selectedVisa.price}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                    <Clock className="text-brand mb-3" size={20} />
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{t.visa.processingTime}</h4>
                    <p className="text-sm font-bold">{selectedVisa.processingTime}</p>
                  </div>
                  {selectedVisa.stay && (
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                      <Calendar className="text-brand mb-3" size={20} />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Duration of Stay</h4>
                      <p className="text-sm font-bold">{selectedVisa.stay}</p>
                    </div>
                  )}
                </div>

                {selectedVisa.dossier && (
                  <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-6 flex items-center gap-2">
                      <FileText size={16} /> Required Documents
                    </h4>
                    <ul className="space-y-3">
                      {selectedVisa.dossier.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedVisa.conditions && (
                  <div className="bg-brand/5 p-8 rounded-3xl border border-brand/10">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-brand mb-6 flex items-center gap-2">
                      <AlertCircle size={16} /> Important Conditions
                    </h4>
                    <ul className="space-y-3">
                      {selectedVisa.conditions.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand mt-1.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">Expert Analysis</h4>
                  <p className="text-white/80 leading-relaxed whitespace-pre-line text-sm">
                    {selectedVisa.id === 'v1' ? (t as any).visaData.turkey.requirements : selectedVisa.requirement}
                    {"\n\n"}
                    {typeof selectedVisa.details === 'object' 
                      ? selectedVisa.details[lang] || selectedVisa.details['en']
                      : selectedVisa.details}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    const message = `I need help with ${selectedVisa.country} visa`;
                    window.open(`https://wa.me/213559942325?text=${encodeURIComponent(message)}`, "_blank");
                  }}
                  className="flex-1 bg-white text-black py-5 rounded-2xl font-bold hover:bg-brand hover:text-white transition-all uppercase tracking-widest text-sm"
                >
                  Chat with Expert
                </button>
                <button 
                  onClick={() => {
                    setSelectedAppointmentVisa(selectedVisa);
                    setSelectedVisa(null);
                  }}
                  className="flex-1 bg-brand text-white py-5 rounded-2xl font-bold hover:bg-white hover:text-brand transition-all uppercase tracking-widest text-sm shadow-xl shadow-brand/20"
                >
                  {t.visa.bookAppointment}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Appointment Modal */}
        {selectedAppointmentVisa && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppointmentVisa(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-950 rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedAppointmentVisa(null)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">{t.appointment.title}</h2>
                <p className="text-brand text-xs font-bold uppercase tracking-widest">{selectedAppointmentVisa.country}</p>
              </div>

              <form onSubmit={handleAppointmentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.firstName}</label>
                    <input 
                      required
                      type="text" 
                      value={appointmentForm.firstName}
                      onChange={(e) => setAppointmentForm({...appointmentForm, firstName: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.lastName}</label>
                    <input 
                      required
                      type="text" 
                      value={appointmentForm.lastName}
                      onChange={(e) => setAppointmentForm({...appointmentForm, lastName: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.email}</label>
                    <input 
                      required
                      type="email" 
                      value={appointmentForm.email}
                      onChange={(e) => setAppointmentForm({...appointmentForm, email: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.phone}</label>
                    <input 
                      required
                      type="tel" 
                      value={appointmentForm.phone}
                      onChange={(e) => setAppointmentForm({...appointmentForm, phone: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.passportNumber}</label>
                  <input 
                    required
                    type="text" 
                    value={appointmentForm.passportNumber}
                    onChange={(e) => setAppointmentForm({...appointmentForm, passportNumber: e.target.value})}
                    className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.passportIssueDate}</label>
                    <input 
                      required
                      type="date" 
                      value={appointmentForm.issueDate}
                      onChange={(e) => setAppointmentForm({...appointmentForm, issueDate: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.passportExpiryDate}</label>
                    <input 
                      required
                      type="date" 
                      value={appointmentForm.expiryDate}
                      onChange={(e) => setAppointmentForm({...appointmentForm, expiryDate: e.target.value})}
                      className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand/40 ml-4">{t.appointment.dateOfBirth}</label>
                  <input 
                    required
                    type="date" 
                    value={appointmentForm.dob}
                    onChange={(e) => setAppointmentForm({...appointmentForm, dob: e.target.value})}
                    className="w-full bg-brand/5 border border-brand/20 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all text-white"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand text-white py-5 rounded-2xl font-bold text-lg hover:bg-white hover:text-brand transition-all mt-8 shadow-xl shadow-brand/20"
                >
                  {t.appointment.submit}
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Flight Booking Modal */}
        {showFlightForm && selectedFlight && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFlightForm(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-950 rounded-[3rem] p-10 md:p-16 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowFlightForm(false)}
                className="absolute top-8 right-8 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight">{t.flightBooking.title}</h2>
                <p className="text-brand text-xs font-bold uppercase tracking-widest">{selectedFlight.airline} - {selectedFlight.flightNumber}</p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const message = `
*Flight Booking Request*
------------------------
*Flight:* ${selectedFlight.airline} (${selectedFlight.flightNumber})
*Price:* ${formatPrice(selectedFlight.priceEUR)}
*Passenger:* ${passengerData.firstName} ${passengerData.lastName}
*Passport:* ${passengerData.passportNumber}
*DOB:* ${passengerData.dateOfBirth}
*Expiry:* ${passengerData.passportExpiryDate}
------------------------
                  `.trim();
                  window.open(`https://wa.me/213559942325?text=${encodeURIComponent(message)}`, "_blank");
                  setShowFlightForm(false);
                }} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">{t.appointment.firstName}</label>
                    <input 
                      required
                      type="text" 
                      value={passengerData.firstName}
                      onChange={(e) => setPassengerData({...passengerData, firstName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">{t.appointment.lastName}</label>
                    <input 
                      required
                      type="text" 
                      value={passengerData.lastName}
                      onChange={(e) => setPassengerData({...passengerData, lastName: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">{t.appointment.passportNumber}</label>
                  <input 
                    required
                    type="text" 
                    value={passengerData.passportNumber}
                    onChange={(e) => setPassengerData({...passengerData, passportNumber: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">{t.appointment.dateOfBirth}</label>
                    <input 
                      required
                      type="date" 
                      value={passengerData.dateOfBirth}
                      onChange={(e) => setPassengerData({...passengerData, dateOfBirth: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-4">{t.appointment.passportExpiryDate}</label>
                    <input 
                      required
                      type="date" 
                      value={passengerData.passportExpiryDate}
                      onChange={(e) => setPassengerData({...passengerData, passportExpiryDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand transition-all text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setShowFlightForm(false)}
                    className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-2xl font-bold hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
                  >
                    {t.flightBooking.back}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-brand text-white py-5 rounded-2xl font-bold hover:bg-white hover:text-brand transition-all uppercase tracking-widest text-sm shadow-xl shadow-brand/20"
                  >
                    {t.flightBooking.submit}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
