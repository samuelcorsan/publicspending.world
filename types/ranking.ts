import { SVGProps } from "react";

export interface RankingListProps {
  topic: ValidTopic;
  showHeader?: boolean;
}

export interface RankingHeaderProps {
  TopicIcon: React.ComponentType<SVGProps<SVGSVGElement>>;
  topicTitle: string;
}

export interface LoadingStateProps {
  showHeader: boolean;
  TopicIcon: React.ComponentType<SVGProps<SVGSVGElement>>;
  topicTitle: string;
}

export interface RankingErrorStateProps {
  TopicIcon: React.ComponentType<SVGProps<SVGSVGElement>>;
  topicTitle: string;
  showHeader: boolean;
  onRetry?: () => void;
}

export type ValidTopic = "population" | "gdp-nominal" | "world-gdp-share";

export const TopicTitles: Record<ValidTopic, string> = {
  population: "Population",
  "gdp-nominal": "GDP (Nominal)",
  "world-gdp-share": "World GDP Share",
};
