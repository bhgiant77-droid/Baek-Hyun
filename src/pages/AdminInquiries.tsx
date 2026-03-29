import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, CheckCircle2, Clock, Mail, Phone, Building, MessageSquare, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setInquiries(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
      toast.error("문의 내역을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "inquiries", id), { status });
      toast.success("상태가 업데이트되었습니다.");
      fetchInquiries();
      if (selectedInquiry?.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status });
      }
    } catch (error) {
      console.error(error);
      toast.error("상태 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteDoc(doc(db, "inquiries", id));
      toast.success("삭제되었습니다.");
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error(error);
      toast.error("삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div className="p-8 text-purple-500">문의 내역을 불러오는 중...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold mb-2">문의 관리</h1>
        <p className="text-gray-500">고객으로부터 접수된 문의 내역을 관리합니다.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {inquiries.map((inquiry) => (
            <motion.div
              key={inquiry.id}
              onClick={() => setSelectedInquiry(inquiry)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                selectedInquiry?.id === inquiry.id 
                  ? "bg-purple-600 border-purple-500 shadow-lg shadow-purple-600/20" 
                  : "bg-zinc-900 border-white/5 hover:border-purple-500/30"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold">{inquiry.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                  inquiry.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                  inquiry.status === 'contacted' ? 'bg-blue-500/20 text-blue-500' :
                  'bg-green-500/20 text-green-500'
                }`}>
                  {inquiry.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-4 line-clamp-1">{inquiry.email}</p>
              <div className="text-[10px] text-gray-600">
                {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleString() : 'N/A'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedInquiry ? (
              <motion.div
                key={selectedInquiry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-zinc-900 border border-white/5 rounded-3xl p-8 md:p-12 sticky top-24"
              >
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedInquiry.name}</h2>
                    <p className="text-gray-500">{selectedInquiry.company || "개인 문의"}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDelete(selectedInquiry.id)}
                      className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-400">
                      <Mail className="w-4 h-4 mr-3 text-purple-500" />
                      <span className="text-sm">{selectedInquiry.email}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Phone className="w-4 h-4 mr-3 text-purple-500" />
                      <span className="text-sm">{selectedInquiry.phone || "연락처 없음"}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <Building className="w-4 h-4 mr-3 text-purple-500" />
                      <span className="text-sm">{selectedInquiry.company || "회사명 없음"}</span>
                    </div>
                  </div>
                  <div className="bg-black/30 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-4">상태 변경</h4>
                    <div className="flex flex-wrap gap-2">
                      {['pending', 'contacted', 'completed'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedInquiry.id, status)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedInquiry.status === status 
                              ? "bg-purple-600 text-white" 
                              : "bg-white/5 text-gray-500 hover:bg-white/10"
                          }`}
                        >
                          {status.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 p-8 rounded-3xl border border-white/5">
                  <div className="flex items-center mb-6 text-purple-500">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    <h4 className="font-bold">문의 내용</h4>
                  </div>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 bg-zinc-900/30 border border-dashed border-white/10 rounded-3xl p-12">
                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                <p>문의 내역을 선택하여 상세 내용을 확인하세요.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
