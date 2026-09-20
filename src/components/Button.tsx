import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
export default function Button({
  to = "/contacto",
  children = "Iniciar proyecto",
  variant = "",
  className = "",
}: {
  to?: string;
  children?: ReactNode;
  variant?: string;
  className?: string;
}) {
  return (
    <Link to={to} className={`button ${variant} ${className}`}>
      {children}
      <span>
        <ArrowUpRight size={18} strokeWidth={1.6} />
      </span>
    </Link>
  );
}
