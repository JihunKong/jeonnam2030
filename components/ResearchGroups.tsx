import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { ResearchGroup, getAllResearchGroups, deleteResearchGroup, verifyPassword } from "../services/firebase";
import { ResearchGroupCard } from "./ResearchGroupCard";
import { ResearchGroupForm } from "./ResearchGroupForm";

export function ResearchGroups() {
  const [groups, setGroups] = useState<ResearchGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ResearchGroup | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    group: ResearchGroup | null;
    password: string;
    error: string | null;
    loading: boolean;
  }>({
    group: null,
    password: '',
    error: null,
    loading: false
  });

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllResearchGroups();
      setGroups(data);
    } catch (err) {
      setError('연구회 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (group: ResearchGroup) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleDelete = (group: ResearchGroup) => {
    setDeleteConfirm({
      group,
      password: '',
      error: null,
      loading: false
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.group) return;

    setDeleteConfirm(prev => ({ ...prev, loading: true, error: null }));

    try {
      const isValid = await verifyPassword(deleteConfirm.password, deleteConfirm.group.passwordHash);

      if (!isValid) {
        setDeleteConfirm(prev => ({
          ...prev,
          error: '비밀번호가 일치하지 않습니다.',
          loading: false
        }));
        return;
      }

      await deleteResearchGroup(deleteConfirm.group.id);
      setDeleteConfirm({ group: null, password: '', error: null, loading: false });
      loadGroups();
    } catch (err) {
      setDeleteConfirm(prev => ({
        ...prev,
        error: '삭제 중 오류가 발생했습니다.',
        loading: false
      }));
      console.error(err);
    }
  };

  const handleFormSuccess = () => {
    loadGroups();
    setEditingGroup(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingGroup(null);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">교과 연구회 배움 마당</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              교과별 연구회의 활동을 나누고 함께 성장하는 공간입니다
            </p>
            <Button onClick={() => setIsFormOpen(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              새 연구회 등록
            </Button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : groups.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">등록된 연구회가 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                첫 번째 연구회를 등록해보세요!
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                연구회 등록하기
              </Button>
            </div>
          ) : (
            /* Research Groups Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {groups.map((group) => (
                <ResearchGroupCard
                  key={group.id}
                  group={group}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Guide Section */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold mb-3">연구회 등록 안내</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 연구회 정보를 입력하고 Google Docs 자료 링크를 첨부해주세요</li>
              <li>• 등록 시 설정한 비밀번호로 수정/삭제가 가능합니다</li>
              <li>• Google Docs는 "모든 사용자 - 뷰어" 권한으로 설정해주세요</li>
              <li>• 문의사항은 Contact Us 페이지를 이용해주세요</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Dialog */}
      <ResearchGroupForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editingGroup={editingGroup}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.group !== null}
        onOpenChange={() => setDeleteConfirm({ group: null, password: '', error: null, loading: false })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>연구회 삭제 확인</DialogTitle>
          </DialogHeader>

          {deleteConfirm.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{deleteConfirm.error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              "{deleteConfirm.group?.name}"를 삭제하시겠습니까?
            </p>
            <div>
              <Label htmlFor="delete-password">비밀번호 확인</Label>
              <Input
                id="delete-password"
                type="password"
                placeholder="연구회 등록 시 사용한 비밀번호"
                value={deleteConfirm.password}
                onChange={(e) =>
                  setDeleteConfirm(prev => ({ ...prev, password: e.target.value }))
                }
                onKeyDown={(e) => e.key === 'Enter' && confirmDelete()}
              />
              <p className="text-xs text-muted-foreground mt-1">
                * 관리자 비밀번호로도 삭제 가능합니다
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm({ group: null, password: '', error: null, loading: false })}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteConfirm.loading}
            >
              {deleteConfirm.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
