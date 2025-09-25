import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MapPin, ExternalLink, QrCode, ChevronDown, ChevronUp } from "lucide-react";

interface ClassData {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  grade: string;
  date: string;
  time: string;
  location: string;
  description: string;
  driveLink: string;
  status: "upcoming" | "ongoing" | "completed";
  region: string;
}

interface ClassListItemProps {
  classData: ClassData;
  onViewQR: (classData: ClassData) => void;
}

export function ClassListItem({ classData, onViewQR }: ClassListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "ongoing": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming": return "예정";
      case "ongoing": return "진행중";
      case "completed": return "완료";
      default: return "미정";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* 항상 표시되는 기본 정보 */}
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{classData.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">{classData.teacher} 선생님</p>
                  <Badge variant="outline" className="text-xs">{classData.subject}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(classData.status)}>
                  {getStatusText(classData.status)}
                </Badge>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 확장 시 표시되는 상세 정보 */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {/* 기본 정보 */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{classData.subject}</Badge>
              <Badge variant="outline">{classData.grade}</Badge>
              <Badge variant="secondary" className="text-xs">{classData.region}</Badge>
            </div>

            {/* 일정 정보 */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{classData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{classData.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{classData.location}</span>
              </div>
            </div>

            {/* 설명 */}
            {classData.description && (
              <div className="text-sm text-muted-foreground">
                {classData.description}
              </div>
            )}

            {/* 액션 버튼들 */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(classData.driveLink, "_blank");
                }}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                수업 영상
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewQR(classData);
                }}
                className="flex items-center gap-2"
              >
                <QrCode className="h-3 w-3" />
                QR코드
              </Button> */}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}