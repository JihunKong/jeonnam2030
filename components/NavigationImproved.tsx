import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "./ui/utils";

interface NavigationProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

// Tab configuration with full and short labels
const tabs = [
  { value: "about", label: "About 2030교실", shortLabel: "2030교실" },
  { value: "schedule", label: "수업나눔 일정 및 신청", shortLabel: "일정/신청" },
  { value: "festival", label: "수업나눔한마당", shortLabel: "한마당" },
  { value: "contact", label: "Contact Us", shortLabel: "Contact" },
];

export function NavigationImproved({ activeTab, onTabChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (value: string) => {
    onTabChange(value);
    setMobileMenuOpen(false);
  };

  const getActiveTabLabel = () => {
    const activeTabConfig = tabs.find(tab => tab.value === activeTab);
    return activeTabConfig?.shortLabel || "Menu";
  };

  return (
    <div className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">2030수업축제</h1>
            <span className="text-xs sm:text-sm text-muted-foreground">전라남도교육청</span>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden sm:block">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-12">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Mobile Navigation - Dropdown Menu */}
        <div
          className={cn(
            "sm:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <nav className="space-y-1" role="navigation" aria-label="주 메뉴">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
                aria-current={activeTab === tab.value ? "page" : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Mobile Current Tab Indicator - Shows when menu is closed */}
        {!mobileMenuOpen && (
          <div className="sm:hidden pb-2">
            <div className="bg-muted rounded-lg px-3 py-1.5 inline-flex items-center">
              <span className="text-xs text-muted-foreground">현재 페이지:</span>
              <span className="text-xs font-medium ml-1">{getActiveTabLabel()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Alternative Solution: Horizontal Scrolling Tabs for Mobile
export function NavigationHorizontalScroll({ activeTab, onTabChange }: NavigationProps) {
  return (
    <div className="w-full bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">2030수업축제</h1>
            <span className="text-xs sm:text-sm text-muted-foreground">전라남도교육청</span>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="relative">
          {/* Scroll indicators for mobile */}
          <div className="sm:hidden absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-x-auto scrollbar-hide pb-2">
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
              <TabsList className="inline-flex sm:grid sm:grid-cols-4 sm:w-full h-12 min-w-max">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="text-sm px-4 sm:px-2 whitespace-nowrap"
                  >
                    <span className="sm:hidden">{tab.shortLabel}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}