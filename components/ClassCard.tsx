import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MapPin, ExternalLink, QrCode } from "lucide-react";

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

interface ClassCardProps {
  classData: ClassData;
  onViewQR: (classData: ClassData) => void;
}

export function ClassCard({ classData, onViewQR }: ClassCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
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
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{classData.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{classData.teacher} 선생님</p>
          </div>
          <Badge className={getStatusColor(classData.status)}>
            {getStatusText(classData.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1 text-sm">
          <Badge variant="outline">{classData.subject}</Badge>
          <Badge variant="outline">{classData.grade}</Badge>
          <Badge variant="secondary" className="text-xs">{classData.region}</Badge>
        </div>
        
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
        
        <p className="text-sm text-muted-foreground">{classData.description}</p>
        
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(classData.driveLink, '_blank')}
            className="flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            수업영상
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onViewQR(classData)}
            className="flex items-center gap-1"
          >
            <QrCode className="h-3 w-3" />
            QR코드
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}