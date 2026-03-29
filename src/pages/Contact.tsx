import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";
import { useState } from "react";

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      // Save to Firebase
      await addDoc(collection(db, "inquiries"), {
        ...data,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Send to Formspree
      await fetch("https://formspree.io/f/mvzvkzkp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
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
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-8">프로젝트 의뢰</h1>
              <p className="text-xl text-gray-400 mb-12">
                귀사의 안전 수준을 한 단계 높일 준비가 되셨나요? <br />
                전문 컨설턴트가 상세히 안내해 드립니다.
              </p>

              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">이메일 문의</h4>
                    <p className="text-gray-500">bhgiant@naver.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">전화 상담</h4>
                    <p className="text-gray-500">02-1234-5678 (평일 09:00 - 18:00)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">오시는 길</h4>
                    <p className="text-gray-500">서울특별시 강남구 테헤란로 123, 안전빌딩 5층</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/50 border border-white/5 p-8 md:p-12 rounded-3xl relative"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-purple-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4">접수 완료!</h3>
                <p className="text-gray-400 mb-8">
                  문의하신 내용이 정상적으로 접수되었습니다. <br />
                  담당자가 확인 후 빠른 시일 내에 연락드리겠습니다.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all"
                >
                  새 문의 작성하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">성함 *</label>
                    <input
                      {...register("name", { required: "성함을 입력해주세요" })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      placeholder="홍길동"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">이메일 *</label>
                    <input
                      {...register("email", { 
                        required: "이메일을 입력해주세요",
                        pattern: { value: /^\S+@\S+$/i, message: "올바른 이메일 형식이 아닙니다" }
                      })}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      placeholder="example@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">연락처</label>
                    <input
                      {...register("phone")}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">회사명</label>
                    <input
                      {...register("company")}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                      placeholder="(주)안전제일"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">문의 내용 *</label>
                  <textarea
                    {...register("message", { required: "내용을 입력해주세요" })}
                    rows={5}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none"
                    placeholder="컨설팅 의뢰 내용을 상세히 적어주세요."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message as string}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <span>처리 중...</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>문의 보내기</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
