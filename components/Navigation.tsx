import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface NavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">2030수업축제</h1>
            <span className="text-sm text-muted-foreground">전라남도교육청</span>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 sm:gap-0 sm:h-12">
            <TabsTrigger value="about" className="text-xs sm:text-sm py-2 sm:py-0">About 2030교실</TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs sm:text-sm py-2 sm:py-0">수업나눔 일정 및 신청</TabsTrigger>
            <TabsTrigger value="festival" className="text-xs sm:text-sm py-2 sm:py-0">수업나눔한마당</TabsTrigger>
            <TabsTrigger value="contact" className="text-xs sm:text-sm py-2 sm:py-0">Contact Us</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}