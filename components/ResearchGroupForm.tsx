import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { ResearchGroup, createResearchGroup, updateResearchGroup } from "../services/api";

interface ResearchGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingGroup?: ResearchGroup | null;
}

export function ResearchGroupForm({ isOpen, onClose, onSuccess, editingGroup }: ResearchGroupFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    howToJoin: '',
    docsLink: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingGroup) {
      setFormData({
        name: editingGroup.name,
        description: editingGroup.description,
        howToJoin: editingGroup.howToJoin,
        docsLink: editingGroup.docsLink,
        password: ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        howToJoin: '',
        docsLink: '',
        password: ''
      });
    }
    setError(null);
  }, [editingGroup, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.password) {
        setError('비밀번호를 입력해주세요.');
        setLoading(false);
        return;
      }

      if (editingGroup) {
        // Update existing group - backend will verify password
        await updateResearchGroup(editingGroup.id, {
          name: formData.name,
          description: formData.description,
          howToJoin: formData.howToJoin,
          docsLink: formData.docsLink,
          password: formData.password
        });
      } else {
        // Create new group
        await createResearchGroup(formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '저장 중 오류가 발생했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      howToJoin: '',
      docsLink: '',
      password: ''
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingGroup ? '연구회 정보 수정' : '새 연구회 등록'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">교과연구회명 *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="예: 전남 수학교과 연구회"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">연구회 소개 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="연구회의 목표, 활동 내용, 특징 등을 자유롭게 작성해주세요."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="howToJoin">연구회 참여 방법 *</Label>
              <Textarea
                id="howToJoin"
                value={formData.howToJoin}
                onChange={(e) => handleChange('howToJoin', e.target.value)}
                placeholder="연구회 가입 방법, 연락처, 활동 일정 등을 안내해주세요."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="docsLink">Google Docs 링크 *</Label>
              <Input
                id="docsLink"
                type="url"
                value={formData.docsLink}
                onChange={(e) => handleChange('docsLink', e.target.value)}
                placeholder="https://docs.google.com/..."
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                * 모든 사용자 - 뷰어 권한으로 설정된 링크를 입력해주세요
              </p>
            </div>

            <div>
              <Label htmlFor="password">비밀번호 *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder={editingGroup ? "연구회 등록 시 사용한 비밀번호" : "수정/삭제 시 사용할 비밀번호"}
                required
              />
              {!editingGroup && (
                <p className="text-xs text-muted-foreground mt-1">
                  * 이 비밀번호로 나중에 수정/삭제가 가능합니다
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingGroup ? '수정하기' : '등록하기'}
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
