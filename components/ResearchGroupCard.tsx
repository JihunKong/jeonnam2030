import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { ResearchGroup } from "../services/api";

interface ResearchGroupCardProps {
  group: ResearchGroup;
  onEdit: (group: ResearchGroup) => void;
  onDelete: (group: ResearchGroup) => void;
}

export function ResearchGroupCard({ group, onEdit, onDelete }: ResearchGroupCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{group.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="space-y-3 flex-1">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">연구회 소개</h4>
            <p className="text-sm whitespace-pre-wrap">{group.description}</p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">참여 방법</h4>
            <p className="text-sm whitespace-pre-wrap">{group.howToJoin}</p>
          </div>
        </div>

        <div className="space-y-2 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open(group.docsLink, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            연구회 자료 보기
          </Button>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(group)}
            >
              <Edit className="mr-2 h-3 w-3" />
              수정
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 text-destructive hover:text-destructive"
              onClick={() => onDelete(group)}
            >
              <Trash2 className="mr-2 h-3 w-3" />
              삭제
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            등록일: {group.createdAt.toLocaleDateString('ko-KR')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
