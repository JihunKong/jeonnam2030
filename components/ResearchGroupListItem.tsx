import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { ResearchGroup } from "../services/api";

interface ResearchGroupListItemProps {
  group: ResearchGroup;
  onEdit: (group: ResearchGroup) => void;
  onDelete: (group: ResearchGroup) => void;
}

export function ResearchGroupListItem({ group, onEdit, onDelete }: ResearchGroupListItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{group.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {group.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>등록일: {group.createdAt.toLocaleDateString('ko-KR')}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex sm:flex-col gap-2 sm:items-end">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 sm:flex-none sm:w-32"
            onClick={() => window.open(group.docsLink, '_blank')}
          >
            <ExternalLink className="mr-2 h-3 w-3" />
            자료 보기
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(group)}
            >
              <Edit className="h-3 w-3" />
              <span className="ml-1 hidden sm:inline">수정</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(group)}
            >
              <Trash2 className="h-3 w-3" />
              <span className="ml-1 hidden sm:inline">삭제</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
