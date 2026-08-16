import { useState, useCallback } from "react";
import { InsertUtils } from "../../services/text/insertUtils";
import { useI18n } from "../../stores/i18nStore";

interface ColorPickerDialogProps {
  onInsert: (color: string) => void;
  onClose: () => void;
}

export function ColorPickerDialog({ onInsert, onClose }: ColorPickerDialogProps) {
  const { t } = useI18n();
  const [r, setR] = useState(0);
  const [g, setG] = useState(122);
  const [b, setB] = useState(255);
  const [hex, setHex] = useState("#007aff");
  const [format, setFormat] = useState<"hex" | "rgb" | "hsl">("hex");

  const updateFromRgb = useCallback((nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    setHex(InsertUtils.colorToHex(nr, ng, nb));
  }, []);

  const updateFromHex = useCallback((newHex: string) => {
    setHex(newHex);
    const rgb = InsertUtils.hexToRgb(newHex);
    if (rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
  }, []);

  const hsl = InsertUtils.rgbToHsl(r, g, b);

  const getColorString = useCallback(() => {
    switch (format) {
      case "hex": return hex;
      case "rgb": return `rgb(${r}, ${g}, ${b})`;
      case "hsl": return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    }
  }, [format, hex, r, g, b, hsl]);

  const presetColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff",
    "#808080", "#c0c0c0", "#800000", "#008000", "#000080", "#808000", "#800080", "#008080",
    "#ff6600", "#ff9900", "#ffcc00", "#ffff00", "#ccff00", "#99ff00", "#66ff00", "#00ff66",
    "#007aff", "#5856d6", "#af52de", "#ff2d55", "#ff3b30", "#ff9500", "#ffcc00", "#34c759",
  ];

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog color-picker-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h3>{t("dialog.colorPicker")}</h3>
          <button className="dialog-close" onClick={onClose}>×</button>
        </div>
        <div className="dialog-body">
          <div className="color-preview" style={{ background: hex }} />

          <div className="color-controls">
            <div className="color-channel">
              <label>R: {r}</label>
              <input type="range" min={0} max={255} value={r} onChange={(e) => updateFromRgb(+e.target.value, g, b)} />
            </div>
            <div className="color-channel">
              <label>G: {g}</label>
              <input type="range" min={0} max={255} value={g} onChange={(e) => updateFromRgb(r, +e.target.value, b)} />
            </div>
            <div className="color-channel">
              <label>B: {b}</label>
              <input type="range" min={0} max={255} value={b} onChange={(e) => updateFromRgb(r, g, +e.target.value)} />
            </div>
          </div>

          <div className="color-hex-input">
            <label>HEX:</label>
            <input type="text" value={hex} onChange={(e) => updateFromHex(e.target.value)} />
          </div>

          <div className="color-presets">
            <h4>{t("colorPicker.presets")}</h4>
            <div className="preset-grid">
              {presetColors.map((color) => (
                <button
                  key={color}
                  className="preset-color"
                  style={{ background: color }}
                  title={color}
                  onClick={() => updateFromHex(color)}
                />
              ))}
            </div>
          </div>

          <div className="color-format">
            <label>{t("colorPicker.outputFormat")}</label>
            <select value={format} onChange={(e) => setFormat(e.target.value as "hex" | "rgb" | "hsl")}>
              <option value="hex">HEX (#rrggbb)</option>
              <option value="rgb">RGB (r, g, b)</option>
              <option value="hsl">HSL (h, s%, l%)</option>
            </select>
          </div>

          <div className="color-output">
            <code>{getColorString()}</code>
            <button className="btn btn-primary" onClick={() => { onInsert(getColorString()); onClose(); }}>
              {t("common.insert")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
