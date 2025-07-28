import { LucideDollarSign, LucideUsers, LucideTrendingUp, LucideBarChart3 } from "lucide-react";

export type MetricChangeType = "up" | "down";

export interface MetricData {
  icon: React.ElementType;
  iconClass?: string;
  label: string;
  value: string;
  change?: string;
  changeType?: MetricChangeType;
  subLabel?: string;
  progress?: number;
}

export const metricsData: MetricData[] = [
  {
    icon: LucideDollarSign,
    iconClass: "text-blue-500",
    label: "Total Revenue",
    value: "$128,430",
    change: "+24.5%",
    changeType: "up",
    subLabel: "Monthly Target",
    progress: 78,
  },
  {
    icon: LucideUsers,
    iconClass: "text-purple-500",
    label: "Total Users",
    value: "24,718",
    change: "+12.1%",
    changeType: "up",
    subLabel: "Monthly Target",
    progress: 65,
  },
  {
    icon: LucideBarChart3,
    iconClass: "text-green-500",
    label: "Conversions",
    value: "3,428",
    change: "-3.2%",
    changeType: "down",
    subLabel: "Monthly Target",
    progress: 42,
  },
  {
    icon: LucideTrendingUp,
    iconClass: "text-orange-500",
    label: "Growth Rate",
    value: "18.2%",
    change: "+5.1%",
    changeType: "up",
    subLabel: "Monthly Target",
    progress: 91,
  },
]; 