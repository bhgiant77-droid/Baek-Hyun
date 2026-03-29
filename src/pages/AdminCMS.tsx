import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit2, Save, X, Image as ImageIcon, Briefcase, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<"services" | "portfolio">("portfolio");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, activeTab), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
      toast.error("데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing === "new") {
        await addDoc(collection(db, activeTab), {
          ...formData,
          createdAt: serverTimestamp()
        });
        toast.success("항목이 추가되었습니다.");
      } else if (isEditing) {
        await updateDoc(doc(db, activeTab, isEditing), formData);
        toast.success("항목이 수정되었습니다.");
      }
      setIsEditing(null);
      setFormData({});
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error("저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
      toast.success("삭제되었습니다.");
      fetchItems();
    } catch (error) {
      console.error(error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">콘텐츠 관리</h1>
          <p className="text-gray-500">웹사이트의 주요 콘텐츠를 직접 편집하세요.</p>
        </div>
        <button
          onClick={() => {
            setIsEditing("new");
            setFormData(activeTab === "portfolio" 
              ? { title: "", category: "", imageUrl: "", description: "" }
              : { title: "", description: "", icon: "", order: 0 }
            );
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>새 항목 추가</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-white/5">
        <button
          onClick={() => setActiveTab("portfolio")}
          className={`pb-4 px-4 text-sm font-bold transition-all relative ${
            activeTab === "portfolio" ? "text-purple-500" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4" />
            <span>포트폴리오</span>
          </div>
          {activeTab === "portfolio" && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`pb-4 px-4 text-sm font-bold transition-all relative ${
            activeTab === "services" ? "text-purple-500" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>서비스 항목</span>
          </div>
          {activeTab === "services" && (
            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
          )}
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden group"
            >
              {activeTab === "portfolio" && (
                <div className="aspect-video bg-black relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => { setIsEditing(item.id); setFormData(item); }}
                        className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  {activeTab === "services" && (
                    <div className="flex space-x-1">
                      <button onClick={() => { setIsEditing(item.id); setFormData(item); }} className="p-2 text-gray-500 hover:text-purple-500"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4">{item.description}</p>
                {activeTab === "portfolio" && (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 bg-purple-500/10 px-2 py-1 rounded">
                    {item.category}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-950">
                <h2 className="text-xl font-bold">{isEditing === "new" ? "새 항목 추가" : "항목 수정"}</h2>
                <button onClick={() => setIsEditing(null)} className="text-gray-500 hover:text-white"><X className="w-6 h-6" /></button>
              </div>
              <form onSubmit={handleSave} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">제목</label>
                    <input
                      value={formData.title || ""}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                    />
                  </div>
                  {activeTab === "portfolio" ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">카테고리</label>
                        <input
                          value={formData.category || ""}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">이미지 URL</label>
                        <input
                          value={formData.imageUrl || ""}
                          onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                          required
                          className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">아이콘 (Lucide Name)</label>
                      <input
                        value={formData.icon || ""}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">설명</label>
                    <textarea
                      value={formData.description || ""}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(null)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold transition-all flex items-center justify-center"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    저장하기
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
