import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, Menu, X, LayoutDashboard, Settings as SettingsIcon, 
  Briefcase, MessageSquare, LogIn, LogOut, ChevronRight,
  Factory, AlertTriangle, CheckCircle2, Users
} from "lucide-react";
import { cn } from "./lib/utils";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCMS from "./pages/AdminCMS";
import AdminInquiries from "./pages/AdminInquiries";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-purple-500">Loading...</div>;
  
  // Check if user is admin (hardcoded for now as per rules)
  const isAdmin = user?.email === "bhgiant77@gmail.com";
  
  if (!user || !isAdmin) return <Navigate to="/" />;
  
  return <>{children}</>;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  const navLinks = [
    { name: "홈", path: "/" },
    { name: "서비스", path: "/services" },
    { name: "포트폴리오", path: "/portfolio" },
    { name: "문의하기", path: "/contact" },
  ];

  const adminLinks = [
    { name: "대시보드", path: "/admin", icon: LayoutDashboard },
    { name: "콘텐츠 관리", path: "/admin/cms", icon: SettingsIcon },
    { name: "문의 관리", path: "/admin/inquiries", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
              위험성평가
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {(isAdminPath ? adminLinks : navLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-purple-400",
                  location.pathname === link.path ? "text-purple-500" : "text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAdminPath && (
              <button
                onClick={() => signOut(auth)}
                className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-black border-b border-purple-900/30 px-4 py-6 space-y-4"
          >
            {(isAdminPath ? adminLinks : navLinks).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block text-lg font-medium",
                  location.pathname === link.path ? "text-purple-500" : "text-gray-400"
                )}
              >
                {link.name}
              </Link>
            ))}
            {isAdminPath && (
              <button
                onClick={() => {
                  signOut(auth);
                  setIsOpen(false);
                }}
                className="flex items-center space-x-2 text-lg text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span>로그아웃</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/cms" element={
              <ProtectedRoute>
                <AdminCMS />
              </ProtectedRoute>
            } />
            <Route path="/admin/inquiries" element={
              <ProtectedRoute>
                <AdminInquiries />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        
        <footer className="bg-black border-t border-purple-900/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <Shield className="w-6 h-6 text-purple-500" />
              <span className="text-lg font-bold">위험성평가 컨설팅</span>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              제조업 전문 위험성평가 및 안전보건관리체계 구축 컨설팅
            </p>
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">인스타그램</a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">카카오톡</a>
              <a href="#" className="text-gray-400 hover:text-purple-500 transition-colors">블로그</a>
            </div>
            <p className="text-gray-600 text-xs">
              © 2026 위험성평가 컨설팅. All rights reserved.
            </p>
            <button 
              onClick={async () => {
                try {
                  await signInWithPopup(auth, googleProvider);
                  toast.success("관리자로 로그인되었습니다.");
                } catch (e) {
                  toast.error("로그인 실패");
                }
              }}
              className="mt-8 text-[10px] text-gray-800 hover:text-gray-600"
            >
              Admin Login
            </button>
          </div>
        </footer>
        <Toaster position="top-right" theme="dark" />
      </div>
    </Router>
  );
}
