"use client";

import React from "react";
import {
  Sparkles,
  HeartPulse,
  Landmark,
  Trophy,
  Waves,
  Trees,
  Store,
  Zap,
  ShieldCheck,
  Shield,
  ShieldAlert,
  Fuel,
  Dumbbell,
  MapPin,
  Building,
  Building2,
  Home,
  CheckCircle2,
  CheckCircle,
  Check,
  Star,
  Key,
  KeyRound,
  Calendar,
  FileText,
  FileCheck2,
  Phone,
  Mail,
  Award,
  Ruler,
  Compass,
  Layers,
  Users,
  Car,
  Clock,
  Globe,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Info,
  HelpCircle,
  AlertCircle,
  Search,
  Filter,
  SlidersHorizontal,
  Image as ImageIcon,
  Video,
  Truck,
  Ship,
  Anchor,
  Handshake,
  TrendingUp,
  DollarSign,
  Percent,
  Banknote,
  School,
  GraduationCap,
  Utensils,
  Coffee,
  ShoppingBag,
  Navigation,
  LocateFixed,
  Activity,
  Wifi,
  Tv,
  Bath,
  Bed,
  Maximize,
  Minimize,
  Maximize2,
  Sun,
  Moon,
  CloudRain,
  Wind,
  Flame,
  FileSignature,
  Scale,
  Headphones,
} from "lucide-react";

interface DynamicIconProps {
  name?: string | null;
  className?: string;
  fallback?: React.ComponentType<{ className?: string }>;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  sparkles: Sparkles,
  heartpulse: HeartPulse,
  landmark: Landmark,
  trophy: Trophy,
  waves: Waves,
  trees: Trees,
  store: Store,
  zap: Zap,
  shieldcheck: ShieldCheck,
  shield: Shield,
  shieldalert: ShieldAlert,
  fuel: Fuel,
  dumbbell: Dumbbell,
  mappin: MapPin,
  building: Building,
  building2: Building2,
  home: Home,
  checkcircle2: CheckCircle2,
  checkcircle: CheckCircle,
  check: Check,
  star: Star,
  key: Key,
  keyround: KeyRound,
  calendar: Calendar,
  filetext: FileText,
  filecheck2: FileCheck2,
  phone: Phone,
  mail: Mail,
  award: Award,
  ruler: Ruler,
  compass: Compass,
  layers: Layers,
  users: Users,
  car: Car,
  clock: Clock,
  globe: Globe,
  arrowright: ArrowRight,
  arrowupright: ArrowUpRight,
  briefcase: Briefcase,
  info: Info,
  helpcircle: HelpCircle,
  alertcircle: AlertCircle,
  search: Search,
  filter: Filter,
  slidershorizontal: SlidersHorizontal,
  image: ImageIcon,
  video: Video,
  truck: Truck,
  ship: Ship,
  anchor: Anchor,
  handshake: Handshake,
  trendingup: TrendingUp,
  dollarsign: DollarSign,
  percent: Percent,
  banknote: Banknote,
  school: School,
  graduationcap: GraduationCap,
  utensils: Utensils,
  coffee: Coffee,
  shoppingbag: ShoppingBag,
  navigation: Navigation,
  locatefixed: LocateFixed,
  activity: Activity,
  wifi: Wifi,
  tv: Tv,
  bath: Bath,
  bed: Bed,
  maximize: Maximize,
  minimize: Minimize,
  maximize2: Maximize2,
  sun: Sun,
  moon: Moon,
  cloudrain: CloudRain,
  wind: Wind,
  flame: Flame,
  filesignature: FileSignature,
  scale: Scale,
  headphones: Headphones,
};

export default function DynamicIcon({
  name,
  className = "h-5 w-5",
  fallback: FallbackIcon = Sparkles,
}: DynamicIconProps) {
  if (!name) {
    return <FallbackIcon className={className} />;
  }

  // Handle custom SVG string
  if (typeof name === "string" && name.trim().startsWith("<svg")) {
    return (
      <span
        className={`inline-flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: name }}
      />
    );
  }

  // Normalize key: lowercase, stripped of hyphens and underscores
  const normalizedKey = name.toLowerCase().replace(/[-_\s]+/g, "");
  const Comp = ICON_MAP[normalizedKey];

  if (Comp) {
    return <Comp className={className} />;
  }

  return <FallbackIcon className={className} />;
}
