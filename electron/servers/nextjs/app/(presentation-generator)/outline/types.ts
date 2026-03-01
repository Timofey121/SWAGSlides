export interface ChartData {
    seriesTitles: string[];
    label: string;
    values: string[];
    
}

// Presentation generator UI types (kept here because imports use "../types")
export interface Template {
    id: string;
    name: string;
    description: string;
    ordered: boolean;
    default?: boolean;
    slides?: any;
}

export interface LoadingState {
    message: string;
    isLoading: boolean;
    showProgress: boolean;
    duration: number;
}

export const TABS = {
    OUTLINE: "outline",
    LAYOUTS: "layouts",
} as const;

export type TabType = (typeof TABS)[keyof typeof TABS];

// Configuration for a single chart
export interface ChartConfig {
    id: string;         
    chartTitle: string;     
    type: 'Pie chart' | 'Bar Graph' | 'Line Graph';
    data: ChartData[];
   
   
}

// API Chart Response Type
export interface APIChartResponse {
    id: string | null;
    name: string;
    type: string;
    presentation: string | null;
    postfix: string | null;
    data: {
        categories: string[];
        series: {
            name: string;
            data: number[];
        }[];
    };
}

// Represents a single outline item in the presentation
export interface OutlineItem {
    id: string;         
    slideTitle: string;     
    number: number;     
    charts: ChartConfig[]; 
}


