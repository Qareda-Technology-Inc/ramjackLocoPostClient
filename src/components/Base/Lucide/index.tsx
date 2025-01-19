import { icons } from "lucide-react";
import { LucideIcon } from 'lucide-react';

interface LucideProps {
  icon: keyof typeof icons;
  className?: string;
}

function Lucide({ icon, className }: LucideProps) {
  const Icon: LucideIcon = icons[icon];
  return Icon ? <Icon className={className} /> : null;
}

export default Lucide;
