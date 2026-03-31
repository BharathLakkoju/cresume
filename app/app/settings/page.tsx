"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Cpu, User, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsState {
  analysisDepth: "quick" | "thorough";
  responseStyle: "concise" | "detailed";
  tonePreference: "formal" | "casual";
  keywordWeighting: "strict" | "balanced" | "lenient";
  includeFormattingScore: boolean;
  includeSemanticScore: boolean;
}

const DEFAULTS: SettingsState = {
  analysisDepth: "thorough",
  responseStyle: "detailed",
  tonePreference: "formal",
  keywordWeighting: "balanced",
  includeFormattingScore: true,
  includeSemanticScore: true,
};

const STORAGE_KEY = "ats-precision-settings";

function loadSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function saveSettings(s: SettingsState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // localStorage unavailable
  }
}

export function getStoredSettings(): SettingsState {
  return loadSettings();
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function update<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    setSettings(DEFAULTS);
    saveSettings(DEFAULTS);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-2xl"
      >
        <p className="label-sm text-muted-foreground">CONFIGURATION</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Settings
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          Customize how ATS Precision analyzes and presents your results.
        </p>

        <div className="mt-10 space-y-8">
          {/* Model / Analysis */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <h2 className="label-sm font-semibold text-foreground">
                ANALYSIS ENGINE
              </h2>
            </div>
            <div className="space-y-5">
              <SegmentField
                label="Analysis Depth"
                description="How thorough the keyword and semantic scan should be."
                value={settings.analysisDepth}
                options={[
                  { value: "quick", label: "Quick", sub: "~2s" },
                  { value: "thorough", label: "Thorough", sub: "~5s" },
                ]}
                onChange={(v) =>
                  update("analysisDepth", v as SettingsState["analysisDepth"])
                }
              />
              <SegmentField
                label="Response Style"
                description="Level of detail in suggestions and explanations."
                value={settings.responseStyle}
                options={[
                  { value: "concise", label: "Concise", sub: "Key points" },
                  { value: "detailed", label: "Detailed", sub: "Full context" },
                ]}
                onChange={(v) =>
                  update("responseStyle", v as SettingsState["responseStyle"])
                }
              />
              <SegmentField
                label="Keyword Weighting"
                description="How strictly job description keywords must match."
                value={settings.keywordWeighting}
                options={[
                  { value: "strict", label: "Strict", sub: "Exact match" },
                  { value: "balanced", label: "Balanced", sub: "Flexible" },
                  { value: "lenient", label: "Lenient", sub: "Broad" },
                ]}
                onChange={(v) =>
                  update(
                    "keywordWeighting",
                    v as SettingsState["keywordWeighting"],
                  )
                }
              />
            </div>
          </section>

          {/* Score Components */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <h2 className="label-sm font-semibold text-foreground">
                SCORE COMPONENTS
              </h2>
            </div>
            <div className="space-y-4">
              <ToggleField
                label="Formatting & Readability Score"
                description="Include ATS-friendliness of layout and structure."
                checked={settings.includeFormattingScore}
                onChange={(v) => update("includeFormattingScore", v)}
              />
              <ToggleField
                label="Semantic Similarity Score"
                description="Include contextual meaning matching beyond exact keywords."
                checked={settings.includeSemanticScore}
                onChange={(v) => update("includeSemanticScore", v)}
              />
            </div>
          </section>

          {/* Tone */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <User className="h-4 w-4 text-muted-foreground" />
              <h2 className="label-sm font-semibold text-foreground">
                OUTPUT TONE
              </h2>
            </div>
            <SegmentField
              label="Suggestion Tone"
              description="Language style for improvement suggestions."
              value={settings.tonePreference}
              options={[
                { value: "formal", label: "Formal", sub: "Professional" },
                { value: "casual", label: "Casual", sub: "Conversational" },
              ]}
              onChange={(v) =>
                update("tonePreference", v as SettingsState["tonePreference"])
              }
            />
          </section>
        </div>

        {/* Actions */}
        <div className="mt-10 flex items-center gap-4">
          <Button onClick={handleSave} size="default" className="min-w-28">
            {saved ? "Saved ✓" : "Save Settings"}
          </Button>
          <Button
            variant="ghost"
            size="default"
            onClick={handleReset}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Defaults
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function SegmentField({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string; sub: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="max-w-xs">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <div className="inline-flex shrink-0 bg-surface-low p-1 gap-0.5">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="relative px-3 py-2 transition-all duration-200 ease-out"
            >
              {isActive && (
                <motion.div
                  layoutId={`seg-${label}`}
                  className="absolute inset-0 bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span
                className={`relative z-10 text-xs font-semibold block transition-colors ${isActive ? "text-white" : "text-muted-foreground"}`}
              >
                {opt.label}
              </span>
              <span
                className={`relative z-10 text-[10px] block transition-colors ${isActive ? "text-white/70" : "text-muted-foreground/60"}`}
              >
                {opt.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 cursor-pointer transition-colors duration-200 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-foreground ${checked ? "bg-foreground" : "bg-surface-highest"}`}
      >
        <motion.span
          layout
          className="absolute top-0.5 left-0.5 h-5 w-5 bg-white shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      </button>
    </div>
  );
}
