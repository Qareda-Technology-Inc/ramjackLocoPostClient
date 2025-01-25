import { icons } from "lucide-react";
import { LucideIcon } from 'lucide-react';
import React from 'react';

export type LucideProps = {
  icon: keyof typeof icons;
  onClick?: () => void;
  className?: string;
};

function Lucide({ icon, onClick, className }: LucideProps) {
  const Icon: LucideIcon = icons[icon];
  return Icon ? <Icon className={className} onClick={onClick} /> : null;
}

export default Lucide;