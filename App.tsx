import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { About2030 } from "./components/About2030";
import { ClassSchedule } from "./components/ClassSchedule";
import { FestivalInfo } from "./components/FestivalInfo";
import { ContactUs } from "./components/ContactUs";

export default function App() {
  const [currentTab, setCurrentTab] = useState("about");

  const renderContent = () => {
    switch (currentTab) {
      case "about":
        return <About2030 />;
      case "schedule":
        return <ClassSchedule />;
      case "festival":
        return <FestivalInfo />;
      case "contact":
        return <ContactUs />;
      default:
        return <About2030 />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={currentTab} onTabChange={setCurrentTab} />
      <main className="pt-4">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">전라남도교육청 2030 수업 축제</h3>
            <p className="text-sm text-muted-foreground">
              주소: 전라남도 무안군 삼향읍 어진누리길 10 | 전화: 061-260-0425
            </p>
            <p className="text-xs text-muted-foreground">
              Made by 완도고등학교 공지훈 © 2025 전라남도교육청. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}