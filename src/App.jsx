import { useState, useRef, useCallback, useEffect } from "react";

// ── Disposal data ─────────────────────────────────────────────────────────────
const DISPOSAL = {
  cardboard: {
    bin: "♻️ Recycling Bin",
    accent: "#D97706", bar: "#F59E0B", bg: "#FFFBEB", glow: "rgba(245,158,11,0.12)",
    icon: "📦",
    steps: [
      { icon: "✂️", title: "Break it down", desc: "Flatten all boxes completely. Cut oversized pieces to fit your bin — most councils won't collect if the lid can't close." },
      { icon: "🚫", title: "Remove contaminants", desc: "Strip off all plastic tape, bubble wrap, styrofoam inserts, and staples. These jam recycling machinery and contaminate entire batches." },
      { icon: "💧", title: "Keep it dry", desc: "Wet cardboard loses structural integrity and becomes unrecyclable. Store it indoors or in a dry spot before collection day." },
      { icon: "🏭", title: "Bulk amounts", desc: "Large quantities (moving boxes, appliance packaging) — take directly to your nearest recycling centre or arrange a bulk collection via your council." },
      { icon: "🌱", title: "Compost option", desc: "Plain cardboard with no coatings or inks is excellent brown material for compost heaps. Tear into strips, soak briefly, and layer with green waste." },
    ],
    impact: "Recycling 1 tonne of cardboard saves 17 trees and 26,000 litres of water.",
  },
  glass: {
    bin: "🫙 Glass Recycling Bank",
    accent: "#047857", bar: "#10B981", bg: "#ECFDF5", glow: "rgba(16,185,129,0.12)",
    icon: "🫙",
    steps: [
      { icon: "🚿", title: "Rinse thoroughly", desc: "Rinse bottles and jars with cold water. Labels can stay on — they burn off during the melting process. No need for hot water or soap." },
      { icon: "🎨", title: "Sort by colour", desc: "Many glass banks have separate slots for clear, green, and brown glass. Mixing colours downgrades the recycled product significantly." },
      { icon: "🚫", title: "What cannot go in", desc: "Never put in: Pyrex/oven dishes, window glass, mirrors, light bulbs, or drinking glasses — they have different melting points and ruin entire loads." },
      { icon: "⚠️", title: "Broken glass", desc: "Wrap carefully in several layers of newspaper, tape securely, and label 'BROKEN GLASS' before placing in general waste. Never put loose shards in a recycling bin." },
      { icon: "🔁", title: "Reuse first", desc: "Glass jars are ideal for storing dried foods, homemade jams, or as drinking glasses. Glass is infinitely reusable — cleaning and reusing is always better than recycling." },
    ],
    impact: "Glass is 100% recyclable and can be recycled endlessly without any loss in quality or purity.",
  },
  metal: {
    bin: "♻️ Recycling Bin",
    accent: "#B91C1C", bar: "#F43F5E", bg: "#FFF1F2", glow: "rgba(244,63,94,0.12)",
    icon: "🥫",
    steps: [
      { icon: "🚿", title: "Rinse cans", desc: "A quick cold rinse is enough. Food residue causes odour and attracts pests at collection points. No deep cleaning needed — just remove visible food." },
      { icon: "🧪", title: "Test with a magnet", desc: "Steel cans are magnetic; aluminium is not. Both are recyclable, but knowing which is which helps if your area separates them at collection points." },
      { icon: "📦", title: "Aerosol cans", desc: "Empty aerosols (deodorant, cooking spray) are recyclable — ensure completely empty first. Never puncture or crush them as residual pressure can be dangerous." },
      { icon: "✨", title: "Aluminium foil", desc: "Clean foil and foil trays are recyclable. Scrunch multiple pieces into a ball the size of your fist — small pieces fall through sorting machinery and are lost." },
      { icon: "💰", title: "Scrap metal value", desc: "Larger metal items (old pots, tools, wire) have scrap value. Local scrap metal dealers or council recycling centres will take these — some pay cash for aluminium." },
    ],
    impact: "Recycling aluminium uses 95% less energy than producing it from raw ore. One recycled can saves enough energy to power a TV for 3 hours.",
  },
  paper: {
    bin: "♻️ Paper Recycling Bin",
    accent: "#6D28D9", bar: "#8B5CF6", bg: "#F5F3FF", glow: "rgba(139,92,246,0.12)",
    icon: "📄",
    steps: [
      { icon: "🍕", title: "The grease test", desc: "If paper has absorbed grease or food (pizza boxes, paper plates) it cannot be recycled — oil disrupts the pulping process. Tear off clean sections and recycle those; bin the soiled parts." },
      { icon: "📰", title: "What's accepted", desc: "Newspapers, magazines, office paper, envelopes (including windowed ones), cardboard tubes, paper bags, and clean wrapping paper are all fine to recycle." },
      { icon: "🚫", title: "What's NOT accepted", desc: "Thermal receipts, wax-coated paper, laminated paper, paper contaminated with chemicals (paint, adhesive), and tissues or kitchen roll — these are not recyclable." },
      { icon: "🔐", title: "Sensitive documents", desc: "Shredded paper often jams machinery. Compact shreds in a sealed paper bag before recycling, or use a confidential waste destruction service for sensitive material." },
      { icon: "🌱", title: "Compost it", desc: "Non-glossy paper is excellent for composting. Newspaper makes great weed-suppressing mulch in garden beds when layered 5–6 sheets thick and topped with compost." },
    ],
    impact: "Recycling 1 tonne of paper saves 13 trees, 2.5 barrels of oil, and 4,100 kWh of electricity.",
  },
  plastic: {
    bin: "♻️ Recycling Bin (check symbol first)",
    accent: "#9D174D", bar: "#EC4899", bg: "#FDF2F8", glow: "rgba(236,72,153,0.12)",
    icon: "🧴",
    steps: [
      { icon: "🔢", title: "Check the resin code", desc: "Look for the triangle symbol with a number on the bottom. Types 1 (PET) and 2 (HDPE) are widely accepted. Types 3–7 vary by council — check local guidelines before recycling." },
      { icon: "🚿", title: "Rinse containers", desc: "Remove all food residue with a cold rinse. Contaminated plastic spoils entire batches. Labels don't need removing — they're separated during processing." },
      { icon: "🛍️", title: "Plastic bags and film", desc: "Soft plastic bags, bread bags, and cling film CANNOT go in kerbside bins — they wrap around sorting machinery. Return to supermarket front-of-store collection points instead." },
      { icon: "🔄", title: "Reduce first", desc: "Plastic quality degrades each recycling cycle (unlike glass or aluminium). Prioritise refusing single-use plastic and reusing what you have before recycling as a last resort." },
      { icon: "🏭", title: "Specialist drop-offs", desc: "Blister packs, crisp packets, and Tetrapak cartons need specialist recycling. TerraCycle and supermarket take-back schemes handle these — search for local drop-off points online." },
    ],
    impact: "Only 9% of all plastic ever produced has been recycled. Refusing unnecessary plastic has far greater environmental impact than recycling alone.",
  },
  trash: {
    bin: "🗑️ General Waste",
    accent: "#334155", bar: "#64748B", bg: "#F8FAFC", glow: "rgba(100,116,139,0.12)",
    icon: "🗑️",
    steps: [
      { icon: "🔍", title: "Double-check before binning", desc: "Many items thought to be 'trash' are recyclable or have specialist collection routes. Search your item + your local council name online before placing in general waste." },
      { icon: "⚡", title: "Batteries and electronics", desc: "NEVER bin batteries or small electronics — they're a fire hazard in waste trucks and contain toxic materials. Supermarkets and councils have free battery drop-off points." },
      { icon: "💊", title: "Medicines and chemicals", desc: "Return unused medicines to any pharmacy for safe disposal. Household chemicals (paint, solvents, pesticides) must go to a Household Hazardous Waste facility — never pour down drains." },
      { icon: "👗", title: "Clothing and textiles", desc: "Even worn or torn clothing should never be binned. Charity shops, textile banks, and in-store collection schemes (H&M, Zara) accept all fabric conditions for reuse or fibre recycling." },
      { icon: "🌍", title: "Reduce at source", desc: "General waste goes to landfill or incineration — both have serious environmental costs. Buying less, choosing less packaging, and favouring repair over replacement are the highest-impact actions." },
    ],
    impact: "The average person generates 400kg of waste per year. Reducing consumption is 10× more impactful than improving disposal habits.",
  },
};

const CLASS_COLORS = Object.fromEntries(
  Object.entries(DISPOSAL).map(([k, v]) => [k, { accent: v.accent, bar: v.bar, bg: v.bg, glow: v.glow }])
);

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0C0C0A;
    --surface: #141412;
    --surface2: #1C1C19;
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.12);
    --text: #F2EFE8;
    --muted: #5C5C52;
    --muted2: #8C8C7A;
    --accent: #A8E063;
    --radius: 24px;
    --radius-sm: 14px;
  }

  html, body { height: 100%; background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 60% 40% at 20% 0%, rgba(168,224,99,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 85% 90%, rgba(168,224,99,0.04) 0%, transparent 50%);
  }

  .layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    grid-template-rows: auto 1fr;
    min-height: 100vh;
  }

  /* Sidebar */
  .sidebar {
    grid-row: 1 / 3; border-right: 1px solid var(--border);
    padding: 40px 28px; display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
  }
  .logo { margin-bottom: 44px; }
  .logo-leaf { font-size: 26px; margin-bottom: 8px; display: block; }
  .logo-title { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; line-height: 1; letter-spacing: -0.8px; }
  .logo-title em { font-style: italic; color: var(--accent); }
  .logo-sub { font-size: 12px; color: var(--muted2); margin-top: 5px; font-weight: 300; }
  .section-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px; }
  .sidebar-section { margin-bottom: 28px; }
  .tab-group { display: flex; flex-direction: column; gap: 3px; }
  .tab-btn {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: var(--radius-sm); background: transparent; border: none;
    color: var(--muted2); font-family: 'DM Sans', sans-serif; font-size: 14px;
    font-weight: 500; cursor: pointer; transition: all 0.16s; text-align: left; width: 100%;
  }
  .tab-btn:hover { background: var(--surface2); color: var(--text); }
  .tab-btn.active { background: var(--surface2); color: var(--text); }
  .tab-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--muted); flex-shrink: 0; transition: all 0.16s; }
  .tab-btn.active .tab-dot { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .sidebar-about { font-size: 13px; color: var(--muted2); line-height: 1.7; font-weight: 300; }
  .sidebar-footer { margin-top: auto; font-size: 11px; color: var(--muted); line-height: 1.8; }
  .status-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); margin-right: 6px; box-shadow: 0 0 6px var(--accent); animation: pulse 2s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }

  /* Topbar */
  .topbar { padding: 28px 40px 24px; border-bottom: 1px solid var(--border); }
  .topbar h1 { font-family: 'Playfair Display', serif; font-size: clamp(26px,3vw,38px); font-weight: 700; letter-spacing: -1px; line-height: 1; text-transform: capitalize; }
  .topbar p { font-size: 14px; color: var(--muted2); margin-top: 6px; font-weight: 300; }

  /* Main */
  .main { padding: 36px 40px 60px; }

  /* Upload */
  .upload-zone {
    border: 1.5px dashed var(--border2); border-radius: var(--radius); padding: 64px 40px;
    text-align: center; cursor: pointer; background: var(--surface); transition: all 0.22s;
    position: relative; overflow: hidden;
  }
  .upload-zone::after { content:''; position:absolute; inset:0; background:radial-gradient(circle at 50% 0%, rgba(168,224,99,0.08) 0%, transparent 55%); opacity:0; transition:opacity 0.22s; }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); }
  .upload-zone:hover::after, .upload-zone.drag::after { opacity:1; }
  .upload-zone:hover { box-shadow: 0 0 0 1px rgba(168,224,99,0.06), 0 20px 60px rgba(0,0,0,0.3); }
  .upload-inner { position: relative; z-index: 1; }
  .upload-icon-wrap { width:72px; height:72px; border-radius:20px; margin:0 auto 20px; background:rgba(168,224,99,0.08); border:1px solid rgba(168,224,99,0.18); display:flex; align-items:center; justify-content:center; font-size:30px; }
  .upload-title { font-size:18px; font-weight:600; color:var(--text); margin-bottom:8px; }
  .upload-sub { font-size:14px; color:var(--muted2); }
  .upload-hint { display:inline-flex; align-items:center; gap:6px; margin-top:20px; background:rgba(255,255,255,0.03); border:1px solid var(--border); border-radius:100px; padding:5px 14px; font-size:12px; color:var(--muted2); }

  /* Camera */
  .cam-wrap { border-radius:var(--radius); overflow:hidden; background:#000; border:1px solid var(--border); position:relative; }
  .cam-video { width:100%; display:block; max-height:420px; object-fit:cover; }
  .cam-hud { position:absolute; inset:0; pointer-events:none; background:linear-gradient(to bottom,rgba(0,0,0,0.25) 0%,transparent 25%,transparent 65%,rgba(0,0,0,0.5) 100%); }
  .cam-corners { position:absolute; inset:20px; pointer-events:none; }
  .cam-corners::before{content:'';position:absolute;top:0;left:0;width:24px;height:24px;border-top:2.5px solid var(--accent);border-left:2.5px solid var(--accent);border-radius:5px 0 0 0}
  .cam-corners::after{content:'';position:absolute;top:0;right:0;width:24px;height:24px;border-top:2.5px solid var(--accent);border-right:2.5px solid var(--accent);border-radius:0 5px 0 0}
  .cam-br::before{content:'';position:absolute;bottom:0;left:0;width:24px;height:24px;border-bottom:2.5px solid var(--accent);border-left:2.5px solid var(--accent);border-radius:0 0 0 5px}
  .cam-br::after{content:'';position:absolute;bottom:0;right:0;width:24px;height:24px;border-bottom:2.5px solid var(--accent);border-right:2.5px solid var(--accent);border-radius:0 0 5px 0}
  .cam-bar { display:flex; align-items:center; justify-content:center; gap:16px; padding:20px; background:var(--surface2); border-top:1px solid var(--border); }
  .shutter { width:68px; height:68px; border-radius:50%; border:3px solid var(--accent); background:transparent; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s; }
  .shutter-inner { width:54px; height:54px; border-radius:50%; background:var(--accent); transition:all 0.15s; }
  .shutter:hover .shutter-inner { width:50px; height:50px; background:#fff; }
  .shutter:active .shutter-inner { width:42px; height:42px; }
  .shutter:disabled { opacity:0.35; cursor:not-allowed; }
  .cam-hint { font-size:12px; color:var(--muted2); font-weight:500; }

  /* Preview */
  .preview-card { border-radius:var(--radius); overflow:hidden; border:1.5px solid var(--border); background:var(--surface); box-shadow:0 24px 80px rgba(0,0,0,0.4); }
  .preview-img-wrap { position:relative; }
  .preview-img { width:100%; max-height:380px; object-fit:cover; display:block; }
  .preview-close { position:absolute; top:14px; right:14px; width:34px; height:34px; border-radius:50%; background:rgba(0,0,0,0.6); border:none; color:#fff; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; backdrop-filter:blur(6px); transition:background 0.15s; }
  .preview-close:hover { background:rgba(0,0,0,0.85); }
  .preview-footer { padding:20px 24px 24px; }
  .preview-name { font-size:12px; color:var(--muted2); margin-bottom:14px; font-weight:500; }

  /* Buttons */
  .btn-classify { width:100%; padding:16px; border-radius:100px; background:var(--accent); color:#0C0C0A; border:none; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:10px; }
  .btn-classify:hover:not(:disabled) { background:#C4F56A; box-shadow:0 8px 28px rgba(168,224,99,0.28); transform:translateY(-1px); }
  .btn-classify:disabled { opacity:0.45; cursor:not-allowed; transform:none; }
  .btn-ghost { padding:10px 22px; border-radius:100px; background:transparent; color:var(--muted2); border:1.5px solid var(--border2); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .btn-ghost:hover { color:var(--text); border-color:rgba(255,255,255,0.25); }
  .spinner { width:18px; height:18px; border-radius:50%; border:2.5px solid rgba(0,0,0,0.15); border-top-color:#0C0C0A; animation:spin 0.7s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* Error */
  .error { margin-top:14px; background:rgba(244,63,94,0.07); border:1px solid rgba(244,63,94,0.18); border-radius:var(--radius-sm); padding:14px 18px; display:flex; gap:10px; align-items:flex-start; font-size:13px; color:#FDA4AF; line-height:1.55; }

  /* Result */
  .result { animation: up 0.5s cubic-bezier(0.16,1,0.3,1); }
  @keyframes up { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
  .result-hero { border-radius:var(--radius); padding:32px 28px; margin-bottom:14px; position:relative; overflow:hidden; }
  .result-ghost { position:absolute; right:-12px; top:-12px; font-size:110px; opacity:0.1; pointer-events:none; line-height:1; user-select:none; }
  .result-inner { position:relative; z-index:1; }
  .result-eyebrow { font-size:11px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:6px; opacity:0.65; }
  .result-name { font-family:'Playfair Display',serif; font-size:clamp(42px,5vw,58px); font-weight:900; line-height:0.95; letter-spacing:-2px; text-transform:capitalize; margin-bottom:24px; }
  .conf-label { display:flex; justify-content:space-between; font-size:13px; font-weight:600; margin-bottom:7px; }
  .conf-track { height:6px; background:rgba(0,0,0,0.15); border-radius:100px; overflow:hidden; margin-bottom:22px; }
  .conf-fill { height:100%; border-radius:100px; transition:width 1.3s cubic-bezier(0.16,1,0.3,1); }
  .steps-title { font-size:11px; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; margin-bottom:12px; opacity:0.6; }
  .step { display:flex; gap:14px; padding:14px 16px; border-radius:var(--radius-sm); background:rgba(0,0,0,0.18); border:1px solid rgba(255,255,255,0.05); margin-bottom:8px; transition:background 0.15s; }
  .step:hover { background:rgba(0,0,0,0.28); }
  .step-icon { font-size:20px; flex-shrink:0; margin-top:2px; }
  .step-title { font-size:13px; font-weight:700; margin-bottom:4px; }
  .step-desc { font-size:13px; line-height:1.65; opacity:0.72; font-weight:300; }
  .impact-bar { margin-top:16px; padding:14px 16px; border-radius:var(--radius-sm); background:rgba(168,224,99,0.08); border:1px solid rgba(168,224,99,0.15); font-size:13px; line-height:1.6; font-style:italic; color:rgba(168,224,99,0.9); display:flex; gap:10px; align-items:flex-start; }

  /* Probs */
  .probs-panel { background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:22px 24px; margin-bottom:14px; }
  .probs-title { font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:1.2px; margin-bottom:16px; }
  .prob-row { margin-bottom:11px; }
  .prob-meta { display:flex; justify-content:space-between; font-size:13px; margin-bottom:5px; }
  .prob-name { display:flex; align-items:center; gap:7px; }
  .prob-top { font-size:9px; background:var(--accent); color:#0C0C0A; border-radius:100px; padding:1px 8px; font-weight:800; letter-spacing:0.3px; }
  .prob-track { height:4px; background:rgba(255,255,255,0.05); border-radius:100px; overflow:hidden; }
  .prob-fill { height:100%; border-radius:100px; transition:width 1s cubic-bezier(0.16,1,0.3,1); }
  .retry-row { display:flex; gap:12px; align-items:center; }
  .thumb { width:54px; height:54px; object-fit:cover; border-radius:12px; border:1.5px solid var(--border); flex-shrink:0; }
  .thumb-info { flex:1; min-width:0; font-size:12px; color:var(--muted2); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }

  /* Mobile */
  @media (max-width:768px) {
    .layout { grid-template-columns:1fr; grid-template-rows:auto auto 1fr; }
    .sidebar { display:none; }
    .topbar { padding:20px 20px 16px; }
    .main { padding:20px 20px 60px; }
    .topbar h1 { font-size:24px; }
    .mobile-nav { display:flex; gap:4px; padding:10px 20px 0; }
    .mobile-tab { flex:1; padding:9px; border-radius:100px; background:transparent; border:1px solid var(--border); font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600; color:var(--muted2); cursor:pointer; transition:all 0.16s; display:flex; align-items:center; justify-content:center; gap:6px; }
    .mobile-tab.active { background:var(--surface2); color:var(--text); border-color:var(--border2); }
  }
  @media (min-width:769px) { .mobile-nav{display:none} }
  canvas { display:none; }
`;

export default function App() {
  const [tab, setTab] = useState("upload");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [drag, setDrag] = useState(false);
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState(null);

  const fileRef = useRef();
  const videoRef = useRef();
  const canvasRef = useRef();
  const streamRef = useRef(null);

  useEffect(() => {
    if (tab === "camera" && !preview) startCamera();
    return () => { if (tab !== "camera") stopCamera(); };
  }, [tab, preview]);

  const startCamera = async () => {
    setCamError(null); setCamReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => { videoRef.current.play(); setCamReady(true); };
      }
    } catch { setCamError("Camera access denied. Please allow camera permissions in your browser settings."); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null; setCamReady(false);
  };

  const capturePhoto = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    c.toBlob(blob => {
      stopCamera();
      setImage(new File([blob], "capture.jpg", { type: "image/jpeg" }));
      setPreview(URL.createObjectURL(blob));
      setResult(null); setError(null);
    }, "image/jpeg", 0.92);
  };

  const handleFile = useCallback((file) => {
    if (!file?.type.startsWith("image/")) { setError("Please upload an image file (JPEG, PNG, or WebP)."); return; }
    setError(null); setResult(null);
    setImage(file); setPreview(URL.createObjectURL(file));
  }, []);

  const handleClassify = async () => {
    if (!image) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", image);
      const res = await fetch("http://localhost:8000/classify", { method: "POST", body: fd });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || "Classification failed."); }
      setResult(await res.json());
    } catch (e) {
      setError(e.message || "Could not reach the server. Is the backend running?");
    } finally { setLoading(false); }
  };

  const reset = () => {
    setImage(null); setPreview(null); setResult(null); setError(null);
    stopCamera();
    if (tab === "camera") setTimeout(startCamera, 100);
  };

  const switchTab = (t) => { setTab(t); if (t !== "camera") stopCamera(); };

  const info = result ? (DISPOSAL[result.predicted_class] || DISPOSAL.trash) : null;
  const c = result ? (CLASS_COLORS[result.predicted_class] || CLASS_COLORS.trash) : null;

  const tabs = [{ id: "upload", label: "Upload Image", icon: "📁" }, { id: "camera", label: "Use Camera", icon: "📷" }];

  return (
    <>
      <style>{STYLES}</style>
      <canvas ref={canvasRef} />
      <div className="app">
        <div className="layout">

          {/* Sidebar */}
          <aside className="sidebar">
            <div className="logo">
              <span className="logo-leaf">🌿</span>
              <div className="logo-title">Waste<em>Wise</em></div>
              <div className="logo-sub">AI-powered waste classification</div>
            </div>
            <div className="sidebar-section">
              <div className="section-label">Input method</div>
              <div className="tab-group">
                {tabs.map(t => (
                  <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => switchTab(t.id)}>
                    <span className="tab-dot" />{t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="sidebar-section">
              <div className="section-label">About</div>
              <p className="sidebar-about">WasteWise uses a MobileNetV2 model trained on 6 waste categories to identify items and provide practical, environmentally-informed disposal guidance.</p>
            </div>
            <div className="sidebar-footer">
              <div><span className="status-dot" />Backend · Port 8000</div>
              <div style={{marginTop:4}}>TechThrive March '26 · Built with 🌱</div>
            </div>
          </aside>

          {/* Topbar */}
          <div className="topbar">
            <h1>{result ? `${info?.icon} ${result.predicted_class}` : "Classify your waste"}</h1>
            <p>{result ? `${result.confidence}% confidence · ${info?.bin}` : "Upload a photo or use your camera — we'll identify the waste and tell you exactly how to handle it."}</p>
          </div>

          {/* Mobile nav */}
          {!preview && (
            <div className="mobile-nav">
              {tabs.map(t => (
                <button key={t.id} className={`mobile-tab ${tab === t.id ? "active" : ""}`} onClick={() => switchTab(t.id)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Main */}
          <main className="main">

            {/* Upload */}
            {!preview && tab === "upload" && (
              <div
                className={`upload-zone ${drag ? "drag" : ""}`}
                onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onClick={() => fileRef.current?.click()}
              >
                <div className="upload-inner">
                  <div className="upload-icon-wrap">📸</div>
                  <p className="upload-title">Drop your waste image here</p>
                  <p className="upload-sub">or click to browse your files</p>
                  <div className="upload-hint"><span>✓</span> JPEG · PNG · WebP</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={(e) => handleFile(e.target.files[0])} />
              </div>
            )}

            {/* Camera */}
            {!preview && tab === "camera" && (
              camError
                ? <div className="error"><span>⚠️</span><span>{camError}</span></div>
                : <div>
                    <div className="cam-wrap">
                      <video ref={videoRef} className="cam-video" playsInline muted autoPlay />
                      <div className="cam-hud" />
                      <div className="cam-corners"><div className="cam-br" /></div>
                    </div>
                    <div className="cam-bar">
                      <span className="cam-hint">Aim at your waste item</span>
                      <button className="shutter" onClick={capturePhoto} disabled={!camReady}><div className="shutter-inner" /></button>
                      <span className="cam-hint">then shoot</span>
                    </div>
                  </div>
            )}

            {/* Preview */}
            {preview && !result && (
              <div className="preview-card">
                <div className="preview-img-wrap">
                  <img src={preview} alt="preview" className="preview-img" />
                  <button className="preview-close" onClick={reset}>×</button>
                </div>
                <div className="preview-footer">
                  <p className="preview-name">{image?.name}</p>
                  <button className="btn-classify" onClick={handleClassify} disabled={loading}>
                    {loading ? <><span className="spinner" /> Analysing…</> : <><span>🔍</span> Classify Waste</>}
                  </button>
                </div>
              </div>
            )}

            {error && <div className="error"><span>⚠️</span><span>{error}</span></div>}

            {/* Result */}
            {result && info && c && (
              <div className="result">
                <div className="result-hero" style={{background: c.bg, border: `1.5px solid ${c.glow}`}}>
                  <div className="result-ghost">{info.icon}</div>
                  <div className="result-inner">
                    <p className="result-eyebrow" style={{color: c.accent}}>Detected waste type</p>
                    <h2 className="result-name" style={{color: "#111"}}>{result.predicted_class}</h2>
                    <div className="conf-label" style={{color: "#333"}}>
                      <span>Confidence score</span>
                      <span style={{color: c.accent}}>{result.confidence}%</span>
                    </div>
                    <div className="conf-track">
                      <div className="conf-fill" style={{width: `${result.confidence}%`, background: c.bar}} />
                    </div>
                    <p className="steps-title" style={{color: c.accent}}>How to dispose of this correctly</p>
                    {info.steps.map((s, i) => (
                      <div className="step" key={i}>
                        <span className="step-icon">{s.icon}</span>
                        <div>
                          <p className="step-title" style={{color: "#1a1a1a"}}>{s.title}</p>
                          <p className="step-desc" style={{color: "#444"}}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                    <div className="impact-bar"><span>🌍</span><span>{info.impact}</span></div>
                  </div>
                </div>

                <div className="probs-panel">
                  <p className="probs-title">All category scores</p>
                  {Object.entries(result.all_probabilities).sort((a,b) => b[1]-a[1]).map(([cls, prob]) => {
                    const cc = CLASS_COLORS[cls] || CLASS_COLORS.trash;
                    const isTop = cls === result.predicted_class;
                    return (
                      <div className="prob-row" key={cls}>
                        <div className="prob-meta">
                          <span className="prob-name" style={{fontWeight: isTop?700:400, color: isTop?"var(--text)":"var(--muted2)"}}>
                            {DISPOSAL[cls]?.icon||"🗑️"} {cls.charAt(0).toUpperCase()+cls.slice(1)}
                            {isTop && <span className="prob-top">TOP</span>}
                          </span>
                          <span style={{fontWeight:isTop?700:400, color:isTop?cc.bar:"var(--muted)"}}>{prob}%</span>
                        </div>
                        <div className="prob-track">
                          <div className="prob-fill" style={{width:`${prob}%`, background:isTop?cc.bar:"rgba(255,255,255,0.08)"}} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="retry-row">
                  <img src={preview} alt="uploaded" className="thumb" />
                  <p className="thumb-info">{image?.name}</p>
                  <button className="btn-ghost" onClick={reset}>Try another →</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
