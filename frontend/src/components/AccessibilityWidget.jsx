import { useEffect, useRef, useState } from "react";
import "./AccessibilityWidget.css";

const STORAGE_KEY = "auraviva-acessibilidade";
const MIN_FONT_SIZE = 80;
const MAX_FONT_SIZE = 150;
const MIN_LINE_HEIGHT = 1.2;
const MAX_LINE_HEIGHT = 2.5;

const DEFAULT_SETTINGS = {
  fontSize: 100,
  lineHeight: 1.5,
  letterSpacing: false,
  highContrast: false,
  darkContrast: false,
  invert: false,
  grayscale: false,
  highSaturation: false,
  readingGuide: false,
  readingMask: false,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const readSavedSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : null;

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_SETTINGS };
    }

    return {
      fontSize: Number.isFinite(parsed.fontSize)
        ? clamp(parsed.fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE)
        : DEFAULT_SETTINGS.fontSize,
      lineHeight: Number.isFinite(parsed.lineHeight)
        ? clamp(parsed.lineHeight, MIN_LINE_HEIGHT, MAX_LINE_HEIGHT)
        : DEFAULT_SETTINGS.lineHeight,
      letterSpacing: typeof parsed.letterSpacing === "boolean" ? parsed.letterSpacing : DEFAULT_SETTINGS.letterSpacing,
      highContrast: typeof parsed.highContrast === "boolean" ? parsed.highContrast : DEFAULT_SETTINGS.highContrast,
      darkContrast: typeof parsed.darkContrast === "boolean" ? parsed.darkContrast : DEFAULT_SETTINGS.darkContrast,
      invert: typeof parsed.invert === "boolean" ? parsed.invert : DEFAULT_SETTINGS.invert,
      grayscale: typeof parsed.grayscale === "boolean" ? parsed.grayscale : DEFAULT_SETTINGS.grayscale,
      highSaturation: typeof parsed.highSaturation === "boolean" ? parsed.highSaturation : DEFAULT_SETTINGS.highSaturation,
      readingGuide: typeof parsed.readingGuide === "boolean" ? parsed.readingGuide : DEFAULT_SETTINGS.readingGuide,
      readingMask: typeof parsed.readingMask === "boolean" ? parsed.readingMask : DEFAULT_SETTINGS.readingMask,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export default function Accessibility() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState(readSavedSettings);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const wasOpenRef = useRef(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const applyVisualMode = (mode) => {
    setSettings((prev) => {
      const next = { ...prev };

      if (mode === "highContrast") {
        next.highContrast = !prev.highContrast;
        if (next.highContrast) {
          next.darkContrast = false;
          next.invert = false;
        }
      }

      if (mode === "darkContrast") {
        next.darkContrast = !prev.darkContrast;
        if (next.darkContrast) {
          next.highContrast = false;
          next.invert = false;
        }
      }

      if (mode === "invert") {
        next.invert = !prev.invert;
        if (next.invert) {
          next.highContrast = false;
          next.darkContrast = false;
        }
      }

      return next;
    });
  };

  useEffect(() => {
    if (!open) {
      if (wasOpenRef.current) {
        triggerRef.current?.focus();
        wasOpenRef.current = false;
      }
      return undefined;
    }

    wasOpenRef.current = true;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--accessibility-font-size", `${settings.fontSize}%`);
    root.style.setProperty("--accessibility-line-height", String(settings.lineHeight));

    root.classList.toggle("accessibility-letter-spacing", settings.letterSpacing);
    root.classList.toggle("accessibility-high-contrast", settings.highContrast);
    root.classList.toggle("accessibility-dark-contrast", settings.darkContrast);
    root.classList.toggle("accessibility-invert", settings.invert);
    root.classList.toggle("accessibility-grayscale", settings.grayscale);
    root.classList.toggle("accessibility-high-saturation", settings.highSaturation);
    root.classList.toggle("accessibility-reading-guide", settings.readingGuide);
    root.classList.toggle("accessibility-reading-mask", settings.readingMask);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Ignora falhas de persistência em navegadores restritivos.
    }
  }, [settings]);

  useEffect(() => {
    if (document.getElementById("vlibras-script")) {
      return;
    }

    const script = document.createElement("script");
    script.id = "vlibras-script";
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;

    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    };

    document.body.appendChild(script);
  }, []);

  const resetAccessibility = () => {
    setSettings(DEFAULT_SETTINGS);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const readPage = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const mainContent = document.querySelector("main")?.innerText || document.body.innerText;
    const text = mainContent.replace(/\s+/g, " ").trim();

    if (!text) {
      return;
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "pt-BR";
    speech.rate = 0.9;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  const pauseOrResumeReading = () => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      return;
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      return;
    }

    readPage();
  };

  const increaseFont = () => {
    setSettings((prev) => ({ ...prev, fontSize: clamp(prev.fontSize + 10, 80, 150) }));
  };

  const decreaseFont = () => {
    setSettings((prev) => ({ ...prev, fontSize: clamp(prev.fontSize - 10, 80, 150) }));
  };

  const increaseLineHeight = () => {
    setSettings((prev) => ({
      ...prev,
      lineHeight: clamp(Number((prev.lineHeight + 0.1).toFixed(1)), MIN_LINE_HEIGHT, MAX_LINE_HEIGHT),
    }));
  };

  const decreaseLineHeight = () => {
    setSettings((prev) => ({
      ...prev,
      lineHeight: clamp(Number((prev.lineHeight - 0.1).toFixed(1)), MIN_LINE_HEIGHT, MAX_LINE_HEIGHT),
    }));
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="accessibility-button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Fechar opções de acessibilidade" : "Abrir opções de acessibilidade"}
        aria-expanded={open}
        aria-controls={open ? "accessibility-panel" : undefined}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4" r="2" />
          <path d="M4 8h16M12 8v5m-4 9 4-9 4 9" />
        </svg>
      </button>

      {open && (
        <div
          id="accessibility-panel"
          className="accessibility-panel"
          role="region"
          aria-labelledby="accessibility-title"
        >
          <div className="accessibility-header">
            <div>
              <span className="accessibility-icon" aria-hidden="true">🌻</span>
              <h2 id="accessibility-title">Acessibilidade</h2>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className="close-accessibility"
              onClick={() => setOpen(false)}
              aria-label="Fechar acessibilidade"
            >
              x
            </button>
          </div>

          <div className="accessibility-content">
            <section>
              <h3>👁️ Visual</h3>

              <button
                type="button"
                className={settings.highContrast ? "active" : ""}
                aria-pressed={settings.highContrast}
                onClick={() => applyVisualMode("highContrast")}
              >
                ☀︎ Contraste claro
              </button>

              <button
                type="button"
                className={settings.darkContrast ? "active" : ""}
                aria-pressed={settings.darkContrast}
                onClick={() => applyVisualMode("darkContrast")}
              >
                ⏾ Contraste escuro
              </button>

              <button
                type="button"
                className={settings.invert ? "active" : ""}
                aria-pressed={settings.invert}
                onClick={() => applyVisualMode("invert")}
              >
                ⇄ Contraste invertido
              </button>

              <button
                type="button"
                className={settings.grayscale ? "active" : ""}
                aria-pressed={settings.grayscale}
                onClick={() => updateSetting("grayscale", !settings.grayscale)}
              >
                ◐ Monocromático
              </button>

              <button
                type="button"
                className={settings.highSaturation ? "active" : ""}
                aria-pressed={settings.highSaturation}
                onClick={() => updateSetting("highSaturation", !settings.highSaturation)}
              >
                ⚡︎ Alta saturação
              </button>
            </section>

            <section>
              <h3>🔤 Texto</h3>

              <div className="font-buttons">
                <button
                  type="button"
                  onClick={decreaseFont}
                  aria-label="Diminuir tamanho do texto"
                  disabled={settings.fontSize <= MIN_FONT_SIZE}
                >
                  A−
                  <span>Diminuir</span>
                </button>

                <div className="font-size-display" aria-live="polite">
                  {settings.fontSize}%
                </div>

                <button
                  type="button"
                  onClick={increaseFont}
                  aria-label="Aumentar tamanho do texto"
                  disabled={settings.fontSize >= MAX_FONT_SIZE}
                >
                  A+
                  <span>Aumentar</span>
                </button>
              </div>

              <div className="line-buttons">
                <button
                  type="button"
                  onClick={decreaseLineHeight}
                  aria-label="Diminuir altura de linha"
                  disabled={settings.lineHeight <= MIN_LINE_HEIGHT}
                >
                  ↧
                  <span>Linhas</span>
                </button>

                <div className="font-size-display" aria-live="polite">
                  {settings.lineHeight.toFixed(1)}x
                </div>

                <button
                  type="button"
                  onClick={increaseLineHeight}
                  aria-label="Aumentar altura de linha"
                  disabled={settings.lineHeight >= MAX_LINE_HEIGHT}
                >
                  ↥
                  <span>Linhas</span>
                </button>
              </div>

              <button
                type="button"
                className={settings.letterSpacing ? "active" : ""}
                aria-pressed={settings.letterSpacing}
                onClick={() => updateSetting("letterSpacing", !settings.letterSpacing)}
              >
                ↔️ Aumentar espaçamento
              </button>
            </section>

            <section>
              <h3>📖 Leitura</h3>

              <button
                type="button"
                className={settings.readingGuide ? "active" : ""}
                aria-pressed={settings.readingGuide}
                onClick={() => updateSetting("readingGuide", !settings.readingGuide)}
              >
                👁 Guia de leitura
              </button>

              <button
                type="button"
                className={settings.readingMask ? "active" : ""}
                aria-pressed={settings.readingMask}
                onClick={() => updateSetting("readingMask", !settings.readingMask)}
              >
                ▬ Máscara de leitura
              </button>

              <button type="button" onClick={readPage}>
                🕪 Ler página
              </button>

              <button type="button" onClick={pauseOrResumeReading}>
                ⏸️ Pausar ou retomar leitura
              </button>

              <button type="button" onClick={() => window.speechSynthesis?.cancel()}>
                ☐ Parar leitura
              </button>
            </section>

            <button type="button" className="reset-accessibility" onClick={resetAccessibility}>
              ↻ Restaurar configurações
            </button>
          </div>
        </div>
      )}

      {settings.readingGuide && <div className="reading-guide" aria-hidden="true" />}
      {settings.readingMask && <div className="reading-mask" aria-hidden="true" />}

      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active vlibras-button-wrapper" />
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
    </>
  );
}