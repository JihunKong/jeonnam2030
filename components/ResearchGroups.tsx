import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Loader2, AlertCircle, BookOpen, LayoutGrid, List, Search, ExternalLink } from "lucide-react";
import { ResearchGroup, getAllResearchGroups, deleteResearchGroup } from "../services/api";
import { ResearchGroupCard } from "./ResearchGroupCard";
import { ResearchGroupListItem } from "./ResearchGroupListItem";
import { ResearchGroupForm } from "./ResearchGroupForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type ViewMode = 'grid' | 'list';
type SortOption = 'latest' | 'oldest' | 'name';

export function ResearchGroups() {
  const [groups, setGroups] = useState<ResearchGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ResearchGroup | null>(null);

  // View mode state with localStorage
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const saved = localStorage.getItem('researchGroupsViewMode');
    return (saved === 'list' ? 'list' : 'grid') as ViewMode;
  });

  // Search and sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('latest');

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

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem('researchGroupsViewMode', viewMode);
  }, [viewMode]);

  // Filtered and sorted groups
  const filteredAndSortedGroups = useMemo(() => {
    let result = [...groups];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        group =>
          group.name.toLowerCase().includes(query) ||
          group.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name, 'ko-KR');
        default:
          return 0;
      }
    });

    return result;
  }, [groups, searchQuery, sortOption]);

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
      await deleteResearchGroup(deleteConfirm.group.id, deleteConfirm.password);
      setDeleteConfirm({ group: null, password: '', error: null, loading: false });
      loadGroups();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.';
      setDeleteConfirm(prev => ({
        ...prev,
        error: errorMessage,
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
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">교과 연구회 배움 마당</h2>
            <p className="text-base sm:text-lg text-muted-foreground mb-6">
              교과별 연구회의 활동을 나누고 함께 성장하는 공간입니다
            </p>
            <Button onClick={() => setIsFormOpen(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              새 연구회 등록
            </Button>
          </div>

          {/* Search, Sort, and View Controls */}
          {groups.length > 0 && (
            <div className="mb-6 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="연구회명 또는 설명으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => setSearchQuery('')}
                    >
                      ×
                    </Button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                    <SelectItem value="name">이름순</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    title="카드형"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    title="리스트형"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                총 {groups.length}개 중 {filteredAndSortedGroups.length}개
                {searchQuery && ` 검색됨`}
              </div>
            </div>
          )}

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
          ) : filteredAndSortedGroups.length === 0 ? (
            /* No Search Results */
            <div className="text-center py-20">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground mb-6">
                다른 검색어를 사용해보세요
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                검색어 지우기
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredAndSortedGroups.map((group) => (
                <ResearchGroupCard
                  key={group.id}
                  group={group}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredAndSortedGroups.map((group) => (
                <ResearchGroupListItem
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
            <h3 className="font-semibold mb-4">연구회 등록 안내</h3>

            {/* Template Button */}
            <div className="mb-4 p-4 bg-primary/10 rounded-md border-2 border-primary/20">
              <p className="text-sm font-medium mb-2">📄 연구회 자료 작성을 위한 양식</p>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.open('https://docs.google.com/document/d/1ag2IBUiHhpPGLCmpMnsRFZHnhjCpk_YLC52DJyrGJCc/copy', '_blank')}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                구글 문서 양식 사본 만들기
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                * 위 버튼을 클릭하면 자동으로 양식 사본이 생성됩니다
              </p>
            </div>

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
