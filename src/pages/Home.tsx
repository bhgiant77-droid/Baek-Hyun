import { motion } from "motion/react";
import { Shield, ChevronRight, Factory, AlertTriangle, CheckCircle2, Users, ArrowRight, Send, Mail, Phone, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useState } from "react";

const QuickContact = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, "inquiries"), {
        ...data,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      toast.success("문의가 성공적으로 접수되었습니다.");
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error(error);
      toast.error("문의 접수 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="py-24 bg-zinc-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">빠른 상담 신청</h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              성함과 연락처를 남겨주시면 <br />
              전문 컨설턴트가 24시간 이내에 연락드립니다.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3" />
                <span>무료 현장 안전 진단 제공</span>
              </div>
              <div className="flex items-center text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3" />
                <span>중대재해처벌법 대응 가이드 증정</span>
              </div>
              <div className="flex items-center text-gray-500">
                <CheckCircle2 className="w-5 h-5 text-purple-500 mr-3" />
                <span>업종별 맞춤형 위험성평가 샘플 제공</span>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 border border-white/5 p-8 rounded-3xl shadow-2xl"
          >
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-2">접수 완료</h3>
                <p className="text-gray-400 mb-6">전문가가 곧 연락드리겠습니다.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-purple-400 font-bold hover:underline"
                >
                  다시 작성하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      {...register("name", { required: "이름을 입력해주세요" })}
                      placeholder="이름"
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-purple-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      {...register("email", { required: "이메일을 입력해주세요" })}
                      placeholder="이메일"
                      className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-purple-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    {...register("phone", { required: "핸드폰 번호를 입력해주세요" })}
                    placeholder="핸드폰 번호"
                    className="w-full bg-black border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
                <textarea
                  {...register("message", { required: "내용을 입력해주세요" })}
                  placeholder="문의 내용 (예: 자동차 부품 제조업 위험성평가 의뢰)"
                  rows={4}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>전송 중...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>상담 신청하기</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505]">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0" style={{ 
          backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
      </div>

      {/* Radar/Scanning Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] z-0 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-purple-500/10 rounded-full"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1/2 bg-gradient-to-b from-purple-500/40 to-transparent origin-bottom" />
        </motion.div>
        <div className="absolute inset-0 border border-purple-500/5 rounded-full scale-75" />
        <div className="absolute inset-0 border border-purple-500/5 rounded-full scale-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-mono tracking-widest uppercase mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span>System Active: Risk Identification Mode</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mb-8 tracking-tighter uppercase">
              안전한 현장, <br />
              <span className="text-purple-500">유해위험요인</span> <br />
              <span className="text-white/20">파악 및 제거</span>
            </h1>
            
            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-xl font-light">
              <span className="text-purple-400 font-mono mr-2">[ANALYSIS]</span>
              중대재해처벌법 대응부터 실질적인 위험성평가까지, 
              제조업 현장의 안전을 위한 정밀 진단 솔루션을 제공합니다.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center group skew-x-[-10deg]"
              >
                <span className="skew-x-[10deg] flex items-center">
                  무료 진단 시작하기
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link
                to="/services"
                className="px-10 py-4 border border-white/20 text-white font-bold hover:bg-white/5 transition-all skew-x-[-10deg]"
              >
                <span className="skew-x-[10deg]">기술 사양 보기</span>
              </Link>
            </div>
          </motion.div>

          {/* Technical Visual Element */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square max-w-[500px] mx-auto">
              {/* Decorative Hexagon/Technical Shape */}
              <div className="absolute inset-0 border-2 border-purple-500/20 rounded-[40px] rotate-45 animate-pulse" />
              <div className="absolute inset-4 border border-white/10 rounded-[40px] -rotate-12" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
                  <Shield className="w-20 h-20 text-purple-500 mx-auto mb-6" />
                  <div className="font-mono text-4xl font-bold mb-2 tracking-tighter">99.9%</div>
                  <div className="text-gray-500 text-xs uppercase tracking-[0.2em]">Safety Compliance</div>
                  
                  <div className="mt-8 space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-1 bg-white/5 rounded-full overflow-hidden w-40 mx-auto">
                        <motion.div 
                          animate={{ x: [-160, 160] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                          className="h-full w-20 bg-purple-500/40"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Data Points */}
              <div className="absolute top-0 right-0 p-4 bg-zinc-900 border border-white/10 rounded-xl font-mono text-[10px] text-purple-400">
                STATUS: SECURE
              </div>
              <div className="absolute bottom-10 left-0 p-4 bg-zinc-900 border border-white/10 rounded-xl font-mono text-[10px] text-gray-500">
                RISK_LEVEL: LOW
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  const stats = [
    { label: "누적 컨설팅 건수", value: "500+", icon: Factory },
    { label: "안전 사고 감소율", value: "85%", icon: AlertTriangle },
    { label: "인증 통과율", value: "100%", icon: CheckCircle2 },
    { label: "함께한 기업", value: "200+", icon: Users },
  ];

  return (
    <section className="py-24 bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 mb-4">
                <stat.icon className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedServices = () => {
  const services = [
    {
      title: "위험성평가 컨설팅",
      desc: "현장 밀착형 위험요인 발굴 및 개선 대책 수립을 통해 법적 의무 이행과 실질적 안전을 확보합니다.",
      icon: Shield
    },
    {
      title: "안전보건관리체계 구축",
      desc: "중대재해처벌법 대응을 위한 전사적 안전보건관리체계를 진단하고 최적화된 시스템을 구축합니다.",
      icon: CheckCircle2
    },
    {
      title: "현장 안전 점검",
      desc: "정기적인 현장 순회 점검을 통해 잠재적 위험 요소를 사전에 차단하고 안전 문화를 정착시킵니다.",
      icon: AlertTriangle
    }
  ];

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">핵심 서비스</h2>
          <p className="text-gray-400">기업의 규모와 현장 특성에 맞는 맞춤형 안전 솔루션을 제공합니다.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all"
            >
              <service.icon className="w-10 h-10 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-6">{service.desc}</p>
              <Link to="/services" className="text-purple-400 font-medium flex items-center group">
                자세히 보기 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <FeaturedServices />
      <QuickContact />
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-purple-600/10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">안전은 선택이 아닌 필수입니다.</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            지금 바로 전문가와 상담하여 귀사의 안전 수준을 진단받으세요. <br />
            첫 상담은 무료로 진행됩니다.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-10 py-5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-600/20"
          >
            무료 진단 신청하기
          </Link>
        </div>
      </section>
    </div>
  );
}
