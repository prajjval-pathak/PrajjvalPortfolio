import React from "react";
import { Info, Lightbulb, AlertTriangle, Layers } from "lucide-react";
import { CalloutBox } from "../../data/learningsData";

interface CalloutBlockProps {
  callout: CalloutBox;
}

export const CalloutBlock: React.FC<CalloutBlockProps> = ({ callout }) => {
  const getIconAndStyles = () => {
    switch (callout.type) {
      case "tip":
        return {
          icon: <Lightbulb className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />,
          containerClass: "border-amber-400/30 bg-amber-400/5 text-amber-100",
          titleClass: "text-amber-300",
          defaultTitle: "Pro Tip",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />,
          containerClass: "border-rose-400/30 bg-rose-400/5 text-rose-100",
          titleClass: "text-rose-300",
          defaultTitle: "Critical Gotcha",
        };
      case "architecture":
        return {
          icon: <Layers className="h-5 w-5 text-teal shrink-0 mt-0.5" />,
          containerClass: "border-teal/30 bg-teal/5 text-slate-lightest",
          titleClass: "text-teal",
          defaultTitle: "Architecture Insight",
        };
      case "note":
      default:
        return {
          icon: <Info className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />,
          containerClass: "border-cyan-400/30 bg-cyan-400/5 text-cyan-100",
          titleClass: "text-cyan-300",
          defaultTitle: "Engineering Note",
        };
    }
  };

  const { icon, containerClass, titleClass, defaultTitle } = getIconAndStyles();

  return (
    <div className={`my-6 rounded-lg border p-4 sm:p-5 flex gap-3.5 ${containerClass}`}>
      {icon}
      <div className="text-sm leading-relaxed">
        <h4 className={`font-mono text-xs font-bold uppercase tracking-wider mb-1 ${titleClass}`}>
          {callout.title || defaultTitle}
        </h4>
        <p className="text-slate-light leading-relaxed">{callout.text}</p>
      </div>
    </div>
  );
};
