import { Link } from "react-router-dom";
import logo from "@/assets/logo.jpg";

// Single swap-point for branding. To use the new Intern.ca logos, overwrite
// src/assets/logo.jpg with the wordmark (or drop in logo.png and update the
// import above). An optional orb icon can be added as logo-icon.png.
interface LogoProps {
  className?: string;
  withLink?: boolean;
}

const Logo = ({ className = "h-8 w-auto", withLink = true }: LogoProps) => {
  const img = <img src={logo} alt="Intern.ca" className={className} />;
  return withLink ? <Link to="/">{img}</Link> : img;
};

export default Logo;
