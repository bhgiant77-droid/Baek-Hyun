import { motion } from "motion/react";
import { Shield, CheckCircle2, ClipboardCheck, HardHat, FileText, BarChart3 } from "lucide-react";

const ServiceCard = ({ title, desc, icon: Icon, steps }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/30 transition-all"
  >
    <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-8">
      <Icon className="w-8 h-8 text-purple-500" />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 mb-8 leading-relaxed">{desc}</p>
    <div className="space-y-3">
      {steps.map((step: string, i: number) => (
        <div key={i} className="flex items-center text-sm text-gray-300">
          <CheckCircle2 className="w-4 h-4 text-purple-500 mr-2 shrink-0" />
          <span>{step}</span>
        </div>
      ))}
    </div>
  </motion.div>
);

export default function Services() {
  const services = [
    {
      title: "위험성평가 컨설팅",
      desc: "산업안전보건법에 따른 정기/수시 위험성평가를 대행하고 실질적인 개선 대책을 제시합니다.",
      icon: ClipboardCheck,
      steps: [
        "사전 준비 및 유해위험요인 파악",
        "위험성 추정 및 결정",
        "위험성 감소 대책 수립 및 실행",
        "기록 및 보존 (법적 증빙 확보)"
      ]
    },
    {
      title: "안전보건관리체계 구축",
      desc: "중대재해처벌법 대응을 위한 7대 핵심 요소를 중심으로 기업 맞춤형 체계를 구축합니다.",
      icon: Shield,
      steps: [
        "경영책임자의 안전보건 경영방침 수립",
        "안전보건 목표 및 실행 계획 수립",
        "예산 편성 및 인력 배치 최적화",
        "종사자 의견 청취 및 참여 시스템 구축"
      ]
    },
    {
      title: "현장 안전 점검 및 지도",
      desc: "전문가가 직접 현장을 방문하여 유해·위험 요소를 점검하고 즉각적인 개선 지도를 수행합니다.",
      icon: HardHat,
      steps: [
        "기계·기구 및 설비의 안전 상태 점검",
        "작업 방법 및 절차의 적정성 평가",
        "보호구 착용 및 안전 표지 준수 확인",
        "현장 근로자 안전 교육 및 지도"
      ]
    },
    {
      title: "안전보건 교육 서비스",
      desc: "법정 의무 교육부터 관리감독자 교육까지, 실무 중심의 맞춤형 교육 프로그램을 제공합니다.",
      icon: FileText,
      steps: [
        "정기 안전보건 교육 (근로자/관리감독자)",
        "채용 시 및 작업 내용 변경 시 교육",
        "특별 안전보건 교육 (고위험 작업)",
        "경영자 대상 중대재해법 대응 특강"
      ]
    },
    {
      title: "ISO 45001 인증 컨설팅",
      desc: "국제 표준 안전보건경영시스템 인증 취득을 위한 전 과정을 전문적으로 지원합니다.",
      icon: BarChart3,
      steps: [
        "현 수준 진단 및 갭 분석",
        "매뉴얼, 절차서, 지침서 개발",
        "내부 심사원 양성 및 예비 심사",
        "인증 심사 대응 및 사후 관리"
      ]
    }
  ];

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            전문 컨설팅 서비스
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            단순한 법적 서류 작성을 넘어, 현장의 실질적인 안전 수준을 높이고 
            기업의 리스크를 최소화하는 전문 서비스를 제공합니다.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>

        {/* Process Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">컨설팅 진행 프로세스</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "상담 및 진단", desc: "기업 현황 파악 및 니즈 분석" },
              { step: "02", title: "맞춤형 제안", desc: "최적화된 컨설팅 플랜 수립" },
              { step: "03", title: "현장 컨설팅", desc: "전문가 투입 및 실무 수행" },
              { step: "04", title: "사후 관리", desc: "지속적인 모니터링 및 피드백" },
            ].map((item, i) => (
              <div key={i} className="relative p-8 rounded-2xl bg-zinc-900/30 border border-white/5">
                <span className="text-4xl font-bold text-purple-500/20 absolute top-4 right-6">{item.step}</span>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
