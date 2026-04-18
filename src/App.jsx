import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import confetti from "canvas-confetti";

// 1. Initialize Supabase
const supabase = createClient(
  "https://tbykgcmhantllgrugzle.supabase.co",
  "sb_publishable_5_jxHxqOgKJJE-VBl3wpWA_b3mZgAeq"
);

function App() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Handle Background Resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentBG = isMobile 
    ? "https://res.cloudinary.com/dpvmewh9g/image/upload/v1775565539/WEDSITE_BACKGROUND_VERT_uxy1kk.png" 
    : "https://res.cloudinary.com/dpvmewh9g/image/upload/v1775560048/WEDSITE_BACKGROUND_HORI_f1uqmi.png";

  const submitForm = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { error: dbError } = await supabase.from("restaurant_leads").insert([
        { 
          name: name.trim(), 
          phone: phone.trim() 
        }
      ]);
      
      if (dbError) { 
        setError("This number is already registered!"); 
        return; 
      }
      
      setSubmitted(true);
      confetti({ 
        particleCount: 200, 
        spread: 90, 
        origin: { y: 0.7 }, 
        colors: ['#1b5e20', '#ffffff', '#ffd700'] 
      });
    } catch (err) { 
      setError("Network error. Please try again."); 
    }
  };

  return (
    <div style={{ ...styles.container, backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${currentBG}')` }}>
      {!submitted ? (
        <div style={styles.glassCard}>
          <h1 style={styles.title}>🎉 Pure Plate Turns 1!</h1>
          <p style={styles.subtitle}>🎁 Win a <b>Lucky Voucher</b></p>
          <p style={styles.desc}>🥗 Fresh • Healthy • Daily Meal Plans</p>
          <p style={styles.urgency}>⏳ Limited Time Offer</p>

          <form onSubmit={submitForm} style={styles.form}>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              style={styles.input} 
              required 
            />
            <input 
              type="tel" 
              placeholder="05X XXX XXXX" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))} 
              style={styles.input} 
              required 
              pattern="[0][5][0-9]{8}" 
              maxLength="10" 
            />
            <button type="submit" style={styles.button}>Submit</button>
          </form>
          {error && <div style={styles.errorBox}>{error}</div>}
        </div>
      ) : (
        <div style={styles.glassCard}>
          <h2 style={{color: '#1b5e20', fontSize: '28px', margin: '10px 0', fontFamily:'palatino'}}>THANK YOU!</h2>
          <p style={{color: '#444', fontSize: '18px', lineHeight: '1.5', fontFamily:'serif'}}>
            for being a valued part of our journey.<br/>
            <b>with our gratitude and love! ❤️</b>
          </p>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundSize: "cover", backgroundPosition: "center", padding: "15px", fontFamily: "'Montserrat', sans-serif" },
  glassCard: { background: "rgba(255, 255, 255, 0.95)", width: "100%", maxWidth: "380px", padding: "40px 30px", borderRadius: "25px", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" },
  title: { fontSize: "24px", marginBottom: "10px", color: "#1b5e20", fontWeight: "700" },
  subtitle: { fontSize: "16px", marginBottom: "8px", fontFamily:"serif" },
  desc: { fontSize: "14px", color: "#444", marginBottom: "10px", fontFamily: "serif" },
  urgency: { color: "#d32f2f", fontSize: "13px", marginBottom: "20px", fontWeight: "bold" },
  form: { display: "flex", flexDirection: "column", marginTop: '10px' },
  input: { padding: "16px", color:"#446", margin: "8px 0", borderRadius: "15px", border: "1px solid #ddd", fontSize: "16px", width: '100%', boxSizing: 'border-box', background: 'white', outline: 'none' },
  button: { marginTop: "15px", padding: "18px", background: "#4caf50", color: "#fff", border: "none", borderRadius: "15px", fontSize: "18px", fontWeight: "bold", cursor: 'pointer' },
  errorBox: { color: "#d32f2f", marginTop: "15px", fontWeight: "bold", fontSize: "14px" },
};

export default App;