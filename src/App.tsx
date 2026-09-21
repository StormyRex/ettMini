import { useState, FormEvent } from "react";

/* ── Types ──────────────────────────────────────────────── */
type CardLayout = "minimal" | "compact";
interface SocialLinks { github: string; linkedin: string; website: string; }
interface Profile {
  name: string; title: string; bio: string; education: string;
  skills: string; avatarUrl: string; social: SocialLinks; layout: CardLayout;
}
interface ContactFormState { name: string; email: string; message: string; }

/* ── Default data ───────────────────────────────────────── */
const defaultProfile: Profile = {
  name: "Elena Rostova",
  title: "Full Stack Engineer & UI Systems",
  bio: "Building resilient distributed systems and crafting accessible web components. Open source contributor.",
  education: "B.Tech Computer Science, 2024",
  skills: "TypeScript, React, Node.js, PostgreSQL, Docker, Tailwind",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80",
  social: {
    github: "https://github.com/elena-rostova",
    linkedin: "https://linkedin.com/in/elena-rostova",
    website: "https://elena.dev",
  },
  layout: "minimal",
};

/* ── Cyclic skill badge tints (index % 3) ───────────────── */
const badgeTints = [
  "bg-amber-50   text-amber-900   border-amber-200/60",
  "bg-blue-50    text-blue-900    border-blue-200/60",
  "bg-emerald-50 text-emerald-900 border-emerald-200/60",
];

/* ── Shared style tokens ─────────────────────────────────── */
const inputCls =
  "w-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 placeholder-stone-400 " +
  "rounded-md transition-all duration-150 focus:outline-none focus:border-blue-600 " +
  "focus:ring-2 focus:ring-blue-600/20";

const secHead = "text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3";

/* ── Label ──────────────────────────────────────────────── */
function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
      {text}{required && <span className="text-amber-500 ml-0.5">*</span>}
    </label>
  );
}

/* ── SkillBadge — cyclic warm tints ─────────────────────── */
function SkillBadge({ skill, index }: { skill: string; index: number }) {
  const tint = badgeTints[index % 3];
  return (
    <span className={`animate-badge-in inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-mono font-medium ${tint}`}>
      {skill}
    </span>
  );
}

/* ── Spinner (pure SVG, no libs) ────────────────────────── */
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

/* ── ProfileCard ─────────────────────────────────────────── */
function ProfileCard({
  profile,
  onLayoutChange,
}: {
  profile: Profile;
  onLayoutChange: (l: CardLayout) => void;
}) {
  const { name, title, bio, education, skills, avatarUrl, social, layout } = profile;
  const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
  const hasSocial = social.github.trim() || social.linkedin.trim() || social.website.trim();
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  const isCompact = layout === "compact";
  const [imgError, setImgError] = useState(false);
  const showAvatar = avatarUrl.trim() && !imgError;

  return (
    /*
      Ambient glow: faint warm shadow behind the card so it pops off
      the stone-50 canvas without using glassmorphism or blurs.
    */
    <div className="rounded-xl shadow-[0_8px_32px_-4px_rgba(120,100,60,0.13),0_2px_8px_-2px_rgba(120,100,60,0.08)]">
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">

        {/* Layout toggle */}
        <div className="px-5 pt-4 pb-3 border-b border-stone-100 flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">Live Preview</span>
          <div className="flex items-center gap-1 bg-stone-100 rounded-full p-0.5">
            {(["minimal", "compact"] as CardLayout[]).map((v) => (
              <button
                key={v}
                type="button"
                id={`layout-${v}`}
                onClick={() => onLayoutChange(v)}
                className={
                  "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ease-out " +
                  (layout === v ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800")
                }
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Accent bar: amber-500 → crimson-rose (rose-600) */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-600" />

        {/* Header */}
        <div className={isCompact ? "flex items-start gap-4 px-6 py-5" : "px-6 pt-7 pb-5"}>
          <div className="flex-shrink-0">
            {showAvatar ? (
              <img
                src={avatarUrl}
                alt={name || "Avatar"}
                onError={() => setImgError(true)}
                className={`${isCompact ? "h-16 w-16" : "h-20 w-20"} rounded-full object-cover border-2 border-stone-200 ring-2 ring-white shadow-sm transition-all duration-300`}
              />
            ) : (
              <div className={`${isCompact ? "h-16 w-16" : "h-20 w-20"} rounded-full bg-stone-100 border-2 border-stone-200 ring-2 ring-white shadow-sm flex items-center justify-center`}>
                <span className={`${isCompact ? "text-xl" : "text-2xl"} font-bold text-stone-800`}>{initial}</span>
              </div>
            )}
          </div>

          <div className={isCompact ? "min-w-0 pt-1" : "mt-4"}>
            {name.trim()
              ? <h2 className="text-xl font-bold tracking-tight text-stone-900 leading-tight">{name}</h2>
              : <h2 className="text-xl font-bold tracking-tight text-stone-300 leading-tight">Your Name</h2>}
            {title.trim()
              ? <p className="mt-0.5 text-sm font-medium text-stone-500">{title}</p>
              : <p className="mt-0.5 text-sm font-medium text-stone-300">Professional Role</p>}

            {/* Available badge with breathing dot */}
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-breathe rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-medium text-green-700">Available for work</span>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-100 mx-6" />

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {bio.trim() && <p className="text-sm leading-relaxed text-stone-600">{bio}</p>}

          {/* Education — hidden when blank */}
          {education.trim() && (
            <div>
              <p className={secHead}>Education</p>
              <p className="text-sm text-stone-700 font-medium">{education}</p>
            </div>
          )}

          {/* Skills — hidden when blank, cyclic tints, entrance animation */}
          {skillList.length > 0 && (
            <div>
              <p className={secHead}>Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {skillList.map((skill, i) => (
                  <SkillBadge key={`${skill}-${i}`} skill={skill} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Social links — arrow shifts diagonally on hover */}
          {hasSocial && (
            <div>
              <p className={secHead}>Links</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                {social.github.trim() && (
                  <a href={social.github} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-0.5 text-stone-600 hover:text-stone-900 underline-offset-2 hover:underline transition-colors duration-150">
                    GitHub
                    <span className="inline-block text-stone-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">&#8599;</span>
                  </a>
                )}
                {social.linkedin.trim() && (
                  <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-0.5 text-stone-600 hover:text-stone-900 underline-offset-2 hover:underline transition-colors duration-150">
                    LinkedIn
                    <span className="inline-block text-stone-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">&#8599;</span>
                  </a>
                )}
                {social.website.trim() && (
                  <a href={social.website} target="_blank" rel="noopener noreferrer"
                    className="group inline-flex items-center gap-0.5 text-stone-600 hover:text-stone-900 underline-offset-2 hover:underline transition-colors duration-150">
                    Site
                    <span className="inline-block text-stone-400 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">&#8599;</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {!bio.trim() && !education.trim() && skillList.length === 0 && !hasSocial && (
            <p className="text-sm text-stone-300 italic text-center py-4">
              Fill in the form to see your card come to life.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── ContactForm ─────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState<ContactFormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<ContactFormState>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "dismissing" | "error">("idle");
  // Incrementing key forces the <form> to remount → re-triggers animate-form-in
  const [formKey, setFormKey] = useState(0);

  const update = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<ContactFormState> = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address";
    }
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || "Submission failed");
      }
      // Clear fields immediately; success panel will display
      setForm({ name: "", email: "", message: "" });
      setStatus("success");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  /**
   * 1. Switch to "dismissing" → CSS fade-out-scale plays (190ms).
   * 2. After animation finishes, flip to "idle" and bump formKey
   *    so the <form> remounts fresh and animate-form-in triggers.
   * No window.location.reload(). Profile state is never touched.
   */
  const handleReset = () => {
    setStatus("dismissing");
    setTimeout(() => {
      setErrors({});
      setFormKey((k) => k + 1);
      setStatus("idle");
    }, 200); // matches fade-out-scale duration (190ms) + 10ms buffer
  };

  const showSuccessPanel = status === "success" || status === "dismissing";
  const showForm = status === "idle" || status === "loading" || status === "error";

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
        Contact / Enquiry
      </p>
      <h2 className="mt-1.5 text-base font-bold tracking-tight text-stone-900">Send an enquiry</h2>
      <p className="mt-1 text-xs text-stone-500">
        Have a question? Fill out the form and we will get back to you.
      </p>

      {/* ── Success / dismissing panel ── */}
      {showSuccessPanel && (
        <div
          className={`mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-5 text-center ${
            status === "dismissing" ? "animate-fade-out-scale" : "animate-banner-slide"
          }`}
        >
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200">
            <svg className="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-emerald-900">Enquiry submitted successfully!</p>
          <p className="mt-1 text-xs text-emerald-700">We will get back to you shortly.</p>
          {/* type="button" prevents any accidental form submission */}
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 rounded-lg border border-emerald-200 bg-white px-4 py-1.5 text-xs font-medium text-emerald-800
              transition-all duration-150 hover:bg-stone-50 hover:border-stone-200 hover:text-stone-700
              active:scale-95"
          >
            Send another
          </button>
        </div>
      )}

      {/* ── Error banner ── */}
      {status === "error" && (
        <div className="animate-banner-slide mt-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">Something went wrong.</p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-0.5 text-xs text-red-600 underline underline-offset-2 hover:text-red-800"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* ── Form — slides in fresh on each reset via key ── */}
      {showForm && (
        <form key={formKey} onSubmit={handleSubmit} className="animate-form-in mt-4 space-y-3" noValidate>
          <div>
            <Label text="Name" required />
            <input id="contact-name" type="text" value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name" className={inputCls} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <Label text="Email" required />
            <input id="contact-email" type="email" value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com" className={inputCls} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          <div>
            <Label text="Message" required />
            <textarea id="contact-message" value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Your message..." rows={3} className={`${inputCls} resize-none`} />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>
          <button
            id="contact-submit"
            type="submit"
            disabled={status === "loading"}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white
              transition-all duration-200 ease-out
              hover:bg-indigo-950
              active:scale-[0.98]
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <Spinner />
                <span>Sending...</span>
              </>
            ) : "Submit Enquiry"}
          </button>
        </form>
      )}
    </div>
  );
}






/* ── EditorPanel ─────────────────────────────────────────── */
function EditorPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">{title}</p>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* ── App ─────────────────────────────────────────────────── */
export default function App() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  const handleChange = (field: keyof Profile, value: string) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const handleSocialChange = (field: keyof SocialLinks, value: string) =>
    setProfile((prev) => ({ ...prev, social: { ...prev.social, [field]: value } }));

  const handleLayoutChange = (layout: CardLayout) =>
    setProfile((prev) => ({ ...prev, layout }));

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold tracking-tight text-stone-900">Profile Card Generator</h1>
            <p className="mt-0.5 text-xs text-stone-400">Build a clean, professional profile card live.</p>
          </div>
          <span className="rounded-full bg-stone-100 px-3 py-1 text-[11px] font-medium text-stone-500">
            React + Express
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left column — Editor (7 cols) — slides up on load */}
          <div className="animate-fade-up lg:col-span-7 space-y-5">

            <EditorPanel title="Identity">
              <div>
                <Label text="Full Name" required />
                <input id="field-name" type="text" value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Jane Doe" className={inputCls} />
              </div>
              <div>
                <Label text="Professional Role" required />
                <input id="field-title" type="text" value={profile.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Senior Product Designer" className={inputCls} />
              </div>
              <div>
                <Label text="Short Bio" />
                <textarea id="field-bio" value={profile.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="A brief description of your background and interests."
                  rows={3} className={`${inputCls} resize-none`} />
              </div>
              <div>
                <Label text="Avatar URL" />
                <input id="field-avatar" type="text" value={profile.avatarUrl}
                  onChange={(e) => handleChange("avatarUrl", e.target.value)}
                  placeholder="https://example.com/photo.jpg" className={inputCls} />
              </div>
            </EditorPanel>

            <EditorPanel title="Background">
              <div>
                <Label text="Education" />
                <input id="field-education" type="text" value={profile.education}
                  onChange={(e) => handleChange("education", e.target.value)}
                  placeholder="B.Sc. Computer Science, MIT" className={inputCls} />
              </div>
              <div>
                <Label text="Skills (comma-separated)" />
                <input id="field-skills" type="text" value={profile.skills}
                  onChange={(e) => handleChange("skills", e.target.value)}
                  placeholder="React, TypeScript, Design Systems" className={inputCls} />
                {/* Live chip preview */}
                {profile.skills.trim() && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {profile.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                      <SkillBadge key={`prev-${skill}-${i}`} skill={skill} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </EditorPanel>

            <EditorPanel title="Socials">
              <div>
                <Label text="GitHub" />
                <input id="field-github" type="text" value={profile.social.github}
                  onChange={(e) => handleSocialChange("github", e.target.value)}
                  placeholder="https://github.com/username" className={inputCls} />
              </div>
              <div>
                <Label text="LinkedIn" />
                <input id="field-linkedin" type="text" value={profile.social.linkedin}
                  onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                  placeholder="https://linkedin.com/in/username" className={inputCls} />
              </div>
              <div>
                <Label text="Portfolio / Website" />
                <input id="field-website" type="text" value={profile.social.website}
                  onChange={(e) => handleSocialChange("website", e.target.value)}
                  placeholder="https://your-site.com" className={inputCls} />
              </div>
            </EditorPanel>

            <ContactForm />
          </div>

          {/* Right column — Preview (5 cols, sticky) — arrives 100ms later */}
          <div className="animate-fade-up-delay lg:col-span-5 lg:sticky lg:top-8 lg:h-fit">
            <ProfileCard profile={profile} onLayoutChange={handleLayoutChange} />
            <p className="mt-3 text-center text-[11px] text-stone-400">
              Updates instantly as you type &middot;{" "}
              <span className="font-medium text-stone-500">
                {profile.layout === "minimal" ? "Minimal" : "Compact"} layout
              </span>
            </p>
          </div>

        </div>
      </main>

      <footer className="border-t border-stone-200 bg-white mt-10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-stone-400">Profile Card Generator &mdash; built with React &amp; Express</p>
          <p className="text-xs text-stone-300">v2.0</p>
        </div>
      </footer>
    </div>
  );
}
