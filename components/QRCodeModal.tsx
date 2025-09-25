import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { QrCode, ExternalLink } from "lucide-react";

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

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  classData: ClassData | null;
}

export function QRCodeModal({ isOpen, onClose, classData }: QRCodeModalProps) {
  if (!classData) return null;

  // QR 코드는 실제로는 생성 라이브러리를 사용해야 하지만, 여기서는 placeholder를 사용
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`수업영상: ${classData.title}`)}`;
  const videoLink = `https://example.com/video/${classData.id}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            수업 영상 QR 코드
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">{classData.title}</h3>
            <p className="text-sm text-muted-foreground">{classData.teacher} 선생님</p>
            <p className="text-sm text-muted-foreground">{classData.date} | {classData.time}</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <img 
              src={qrCodeUrl} 
              alt="수업 영상 QR 코드"
              className="w-48 h-48"
            />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              QR 코드를 스캔하여 수업 영상을 시청하세요
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(videoLink, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              직접 링크로 이동
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}