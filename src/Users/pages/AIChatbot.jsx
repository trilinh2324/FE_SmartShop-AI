import { useState, useRef, useEffect } from "react";

const QUICK_QUESTIONS = [
  "Cửa hàng có những sản phẩm gì?",
  "iPhone nào đang bán?",
  "Sản phẩm rẻ nhất là gì?",
  "So sánh các điện thoại",
  "Tư vấn điện thoại dưới 10 triệu?",
  "Xem giỏ hàng của tôi",
  "Đơn hàng của tôi",
  "Khuyến mãi mới nhất",
];

// ─── Lấy Bearer token từ localStorage ───────────────────────
// App lưu token riêng: localStorage.setItem("token", "eyJ...")
// Backend sẽ dùng token này để tự decode ra username — giống
// hệt cách /api/user/bill/my-bills và các API khác hoạt động.
function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token") || null;
}

// ─── Message Bubble ───────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 12,
      animation: "fadeSlideIn 0.25s ease both",
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #E8000D, #8B0000)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 14, flexShrink: 0, marginRight: 8, marginTop: 2,
          boxShadow: "0 0 12px rgba(232,0,13,0.4)",
        }}>🤖</div>
      )}
      <div style={{
        maxWidth: "78%",
        background: isUser ? "linear-gradient(135deg,#E8000D,#9B0000)" : "#141414",
        border: isUser ? "none" : "1px solid #222",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        padding: "10px 14px",
        color: "#F0F0F0",
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 14,
        lineHeight: 1.55,
        boxShadow: isUser ? "0 4px 16px rgba(232,0,13,0.3)" : "0 2px 8px rgba(0,0,0,0.4)",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}>
        {msg.content}
        {msg.timestamp && (
          <div style={{
            fontSize: 9.5, color: isUser ? "rgba(255,255,255,0.5)" : "#444",
            marginTop: 4, textAlign: "right",
            fontFamily: "'Orbitron', monospace",
          }}>
            {msg.timestamp}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing Indicator ─────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: "linear-gradient(135deg, #E8000D, #8B0000)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, boxShadow: "0 0 12px rgba(232,0,13,0.4)",
      }}>🤖</div>
      <div style={{
        background: "#141414", border: "1px solid #222",
        borderRadius: "16px 16px 16px 4px", padding: "12px 16px",
        display: "flex", gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#E8000D",
            animation: "bounce 1.2s ease infinite",
            animationDelay: `${i * 0.2}s`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Main Chatbot ─────────────────────────────────────────────
export default function AIChatbot() {
  const [isOpen,   setIsOpen]   = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Xin chào! 👋 Tôi là trợ lý AI của SmartShop.\nTôi có thể tư vấn sản phẩm, kiểm tra đơn hàng, xem giỏ hàng và nhiều hơn nữa.\n\nBạn cần hỗ trợ gì hôm nay?",
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [unread,  setUnread]  = useState(0);

  // ── Đọc userId một lần khi component mount ──────────────────
  // Nếu user đăng nhập/đăng xuất trong lúc chat đang mở, gọi
  // getUserId() lại bên trong sendMessage() để luôn dùng giá trị mới nhất.
  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");

    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg = { role: "user", content, timestamp: now };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    // Đọc token tại thời điểm gửi (bắt kịp login/logout giữa chừng)
    const token = getToken();

    try {
      const response = await fetch("http://localhost:8080/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Gửi Bearer token — backend decode ra username giống /api/user/bill/my-bills
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data  = await response.json();
      const reply = data?.reply || data?.error || "Xin lỗi, tôi không thể trả lời ngay lúc này!";
      const replyTime = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      setMessages(prev => [...prev, { role: "assistant", content: reply, timestamp: replyTime }]);
      if (!isOpen) setUnread(n => n + 1);

    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Không kết nối được với server. Vui lòng thử lại sau!",
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => setMessages([{
    role: "assistant",
    content: "Xin chào lại! 👋 Tôi có thể giúp gì cho bạn?",
    timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  }]);

  // Hiển thị trạng thái đăng nhập trong header
  const token = getToken();

  return (
    <>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes chatbtnPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(232,0,13,0.5), 0 8px 32px rgba(232,0,13,0.4); }
          50%       { box-shadow: 0 0 0 10px rgba(232,0,13,0), 0 8px 32px rgba(232,0,13,0.4); }
        }
        .chat-input:focus  { outline: none; }
        .quick-btn:hover   { background: #1a1a1a !important; border-color: #E8000D !important; color: #E8000D !important; }
        .send-btn:hover:not(:disabled) { background: #c00009 !important; transform: scale(1.05); }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .chat-window::-webkit-scrollbar       { width: 4px; }
        .chat-window::-webkit-scrollbar-track { background: transparent; }
        .chat-window::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        .close-btn { color: #fff; transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease !important; }
        .close-btn:hover { color: #E8000D !important; background: #1a0000 !important; border-color: #E8000D !important; }
      `}</style>

      {/* ── Floating Button ── */}
      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 99999, pointerEvents: "all" }}>
        {!isOpen && (
          <div style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "2px solid rgba(232,0,13,0.5)",
            animation: "pulseRing 2s ease-out infinite",
            pointerEvents: "none",
          }} />
        )}

        {unread > 0 && !isOpen && (
          <div style={{
            position: "absolute", top: -4, right: -4, zIndex: 100000,
            background: "#E8000D", color: "#fff",
            fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 700,
            width: 20, height: 20, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #070707", pointerEvents: "none",
          }}>{unread}</div>
        )}

        <button
          className={isOpen ? "close-btn" : ""}
          onClick={() => setIsOpen(o => !o)}
          style={{
            width: 58, height: 58, borderRadius: "50%",
            position: "relative", zIndex: 99999,
            background: isOpen ? "#1a1a1a" : "linear-gradient(135deg, #E8000D, #8B0000)",
            border: isOpen ? "2px solid #333" : "none",
            cursor: "pointer", fontSize: isOpen ? 20 : 24,
            fontWeight: isOpen ? 700 : "normal",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: isOpen ? "none" : "chatbtnPulse 2.5s ease infinite",
            transition: "all 0.2s ease",
            boxShadow: "0 8px 32px rgba(232,0,13,0.4)",
          }}
        >
          {isOpen ? "✕" : "💬"}
        </button>
      </div>

      {/* ── Chat Window ── */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 100, right: 28, zIndex: 99998,
          width: 370, height: 560,
          background: "#0A0A0A",
          border: "1px solid #1e1e1e", borderRadius: 12,
          display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 0 1px rgba(232,0,13,0.1)",
          animation: "slideUp 0.25s ease both",
          overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #0D0000, #1a0000)",
            borderBottom: "1px solid #2a0000",
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg, #E8000D, #8B0000)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 0 16px rgba(232,0,13,0.5)",
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 700, color: "#F0F0F0", letterSpacing: 1 }}>
                AI TƯ VẤN
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", boxShadow: "0 0 6px #00ff88" }} />
                <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, color: "#555" }}>
                  {token ? "Đã đăng nhập • Trực tuyến" : "Khách • Chưa đăng nhập"}
                </span>
              </div>
            </div>
            <button onClick={resetChat} style={{
              background: "none", border: "1px solid #2a2a2a",
              color: "#555", fontSize: 11,
              fontFamily: "'Rajdhani', sans-serif",
              padding: "4px 8px", borderRadius: 4, cursor: "pointer",
            }}>Xóa</button>
          </div>

          {/* Messages */}
          <div className="chat-window" style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions — chỉ hiện khi mới mở */}
          {messages.length <= 2 && (
            <div style={{
              padding: "8px 12px", borderTop: "1px solid #141414",
              display: "flex", flexWrap: "wrap", gap: 6,
            }}>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} className="quick-btn" onClick={() => sendMessage(q)} style={{
                  background: "#111", border: "1px solid #222", borderRadius: 20,
                  color: "#888", fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 11, fontWeight: 600, padding: "4px 10px",
                  cursor: "pointer", transition: "all 0.15s ease",
                }}>{q}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: "12px", borderTop: "1px solid #1a1a1a",
            display: "flex", gap: 8, alignItems: "flex-end",
          }}>
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              rows={1}
              style={{
                flex: 1,
                background: "#111", border: "1px solid #222",
                borderRadius: 8, color: "#F0F0F0",
                fontFamily: "'Rajdhani', sans-serif", fontSize: 14,
                padding: "10px 12px", resize: "none",
                lineHeight: 1.4, maxHeight: 80,
                transition: "border-color 0.15s",
              }}
              onFocus={e => e.target.style.borderColor = "#E8000D"}
              onBlur={e  => e.target.style.borderColor = "#222"}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 8,
                background: "linear-gradient(135deg, #E8000D, #8B0000)",
                border: "none", color: "#fff", fontSize: 16,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, transition: "all 0.15s ease",
                boxShadow: "0 4px 14px rgba(232,0,13,0.35)",
              }}
            >→</button>
          </div>
        </div>
      )}
    </>
  );
}
