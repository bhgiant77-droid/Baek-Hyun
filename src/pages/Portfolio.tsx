import { motion } from "motion/react";
import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "A사 자동차 부품 제조 현장 위험성평가",
    category: "위험성평가",
    image: "https://picsum.photos/seed/factory1/800/600",
    desc: "프레스 공정 및 용접 공정의 유해위험요인 발굴 및 개선"
  },
  {
    id: 2,
    title: "B사 화학 물질 취급 시설 안전진단",
    category: "안전진단",
    image: "https://picsum.photos/seed/chemical/800/600",
    desc: "유해화학물질 누출 방지 및 비상대응체계 점검"
  },
  {
    id: 3,
    title: "C건설 현장 안전보건관리체계 구축",
    category: "체계구축",
    image: "https://picsum.photos/seed/construction/800/600",
    desc: "중대재해처벌법 대응을 위한 현장 안전 시스템 최적화"
  },
  {
    id: 4,
    title: "D식품 제조 공장 ISO 45001 인증",
    category: "인증컨설팅",
    image: "https://picsum.photos/seed/food/800/600",
    desc: "글로벌 안전 기준에 부합하는 경영시스템 구축 및 인증 취득"
  },
  {
    id: 5,
    title: "E물류 센터 화재 위험성 평가",
    category: "위험성평가",
    image: "https://picsum.photos/seed/logistics/800/600",
    desc: "대규모 창고 시설의 화재 확산 방지 및 소방 시설 점검"
  },
  {
    id: 6,
    title: "F정밀 기계 가공 업체 안전 교육",
    category: "안전교육",
    image: "https://picsum.photos/seed/machine/800/600",
    desc: "관리감독자 및 근로자 대상 실무 중심 안전 교육 실시"
  }
];

export default function Portfolio() {
  const [filter, setFilter] = useState("전체");
  const categories = ["전체", "위험성평가", "안전진단", "체계구축", "인증컨설팅", "안전교육"];

  const filteredProjects = filter === "전체" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">수행 실적</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            다양한 산업 현장에서 검증된 위험성평가 및 안전 컨설팅 성과를 확인하세요.
          </p>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === cat 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                  : "bg-zinc-900 text-gray-400 hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5"
            >
              <div className="aspect-video overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {project.desc}
                </p>
              </div>
              <div className="absolute inset-0 bg-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <button className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform">
                  <ExternalLink className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
