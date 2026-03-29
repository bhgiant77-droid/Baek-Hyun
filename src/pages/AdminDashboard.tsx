import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs, where, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "motion/react";
import { 
  Users, MessageSquare, Briefcase, TrendingUp, 
  Clock, CheckCircle2, AlertCircle, ChevronRight, Database
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    pendingInquiries: 0,
    totalPortfolio: 0,
    totalServices: 0
  });
  const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const inquiriesSnap = await getDocs(collection(db, "inquiries"));
      const pendingSnap = await getDocs(query(collection(db, "inquiries"), where("status", "==", "pending")));
      const portfolioSnap = await getDocs(collection(db, "portfolio"));
      const servicesSnap = await getDocs(collection(db, "services"));

      setStats({
        totalInquiries: inquiriesSnap.size,
        pendingInquiries: pendingSnap.size,
        totalPortfolio: portfolioSnap.size,
        totalServices: servicesSnap.size
      });

      const recentQuery = query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(5));
      const recentSnap = await getDocs(recentQuery);
      setRecentInquiries(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const seedData = async () => {
    try {
      // Seed Services
      const services = [
        { title: "위험성평가 컨설팅", description: "현장 밀착형 위험요인 발굴 및 개선 대책 수립", icon: "Shield", order: 1 },
        { title: "안전보건관리체계 구축", description: "중대재해처벌법 대응을 위한 전사적 관리 시스템", icon: "CheckCircle2", order: 2 },
        { title: "현장 안전 점검", description: "정기적인 현장 순회 점검 및 안전 문화 정착", icon: "AlertTriangle", order: 3 }
      ];
      for (const s of services) {
        await addDoc(collection(db, "services"), { ...s, createdAt: serverTimestamp() });
      }

      // Seed Portfolio
      const portfolios = [
        { title: "A사 자동차 부품 제조 현장 위험성평가", category: "위험성평가", imageUrl: "https://picsum.photos/seed/factory1/800/600", description: "프레스 공정 및 용접 공정의 유해위험요인 발굴 및 개선" },
        { title: "B사 화학 물질 취급 시설 안전진단", category: "안전진단", imageUrl: "https://picsum.photos/seed/chemical/800/600", description: "유해화학물질 누출 방지 및 비상대응체계 점검" }
      ];
      for (const p of portfolios) {
        await addDoc(collection(db, "portfolio"), { ...p, createdAt: serverTimestamp() });
      }

      toast.success("샘플 데이터가 생성되었습니다.");
      fetchStats();
    } catch (error) {
      console.error(error);
      toast.error("데이터 생성 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-8 text-purple-500">통계 데이터를 불러오는 중...</div>;

  const cards = [
    { label: "전체 문의", value: stats.totalInquiries, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "대기 중 문의", value: stats.pendingInquiries, icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "포트폴리오", value: stats.totalPortfolio, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "서비스 항목", value: stats.totalServices, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">관리자 대시보드</h1>
          <p className="text-gray-500">웹사이트 현황 및 최근 활동을 한눈에 확인하세요.</p>
        </div>
        {stats.totalServices === 0 && (
          <button
            onClick={seedData}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm transition-all"
          >
            <Database className="w-4 h-4" />
            <span>샘플 데이터 생성</span>
          </button>
        )}
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900 border border-white/5 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
            </div>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-gray-500 text-sm">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="font-bold">최근 문의 내역</h3>
            <Link to="/admin/inquiries" className="text-xs text-purple-500 hover:underline flex items-center">
              전체 보기 <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium">{inquiry.name}</div>
                      <div className="text-xs text-gray-500">{inquiry.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      inquiry.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                      inquiry.status === 'contacted' ? 'bg-blue-500/10 text-blue-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>
                      {inquiry.status}
                    </span>
                    <div className="text-xs text-gray-600">
                      {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-600">최근 문의가 없습니다.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-white/5 p-6 rounded-2xl">
            <h3 className="font-bold mb-6">빠른 작업</h3>
            <div className="space-y-3">
              <Link to="/admin/cms" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <Briefcase className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-sm font-medium">포트폴리오 추가</span>
                <ChevronRight className="w-4 h-4 ml-auto text-gray-600 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/admin/cms" className="flex items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                <TrendingUp className="w-5 h-5 text-purple-500 mr-3" />
                <span className="text-sm font-medium">서비스 항목 수정</span>
                <ChevronRight className="w-4 h-4 ml-auto text-gray-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="bg-purple-600 p-6 rounded-2xl text-white">
            <h3 className="font-bold mb-2">도움말</h3>
            <p className="text-sm text-purple-100 mb-4 leading-relaxed">
              관리자 페이지에서는 웹사이트의 모든 콘텐츠를 실시간으로 수정할 수 있습니다. 
              문의 내역은 이메일로도 발송됩니다.
            </p>
            <button className="w-full py-2 bg-white text-purple-600 rounded-lg text-sm font-bold">
              매뉴얼 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
