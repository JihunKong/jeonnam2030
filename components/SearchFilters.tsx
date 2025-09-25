import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Search, Filter, X, ChevronDown, ChevronUp, Calendar } from "lucide-react";

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchQuery: string;
  subjects: string[];
  grades: string[];
  regions: string[];
  startDate: string;
  endDate: string;
  status: string[];
}

const SUBJECTS = [
  "영어", "수학", "과학", "국어", "음악", "사회", "미술", "생물", "특수", "진로", "정보", "일본어", "일반사회", "윤리", "기술", "지리", "상업", "통합사회", "한문"
];

const GRADES = [
  "중학교", "고등학교"
];

const REGIONS = [
  // 시
  "목포시", "여수시", "순천시", "나주시", "광양시",
  // 군
  "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", 
  "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", 
  "완도군", "진도군", "신안군"
];

const STATUS_OPTIONS = [
  { key: "upcoming", label: "예정" },
  { key: "ongoing", label: "진행중" },
  { key: "completed", label: "완료" }
];

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    subjects: [],
    grades: [],
    regions: [],
    startDate: "",
    endDate: "",
    status: []
  });

  const [expandedSections, setExpandedSections] = useState({
    subjects: false,
    grades: false,
    regions: false,
    date: false,
    status: false
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string, checked: boolean) => {
    const currentArray = filters[category] as string[];
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value);
    
    updateFilters({ [category]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      searchQuery: "",
      subjects: [],
      grades: [],
      regions: [],
      startDate: "",
      endDate: "",
      status: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return filters.subjects.length + 
           filters.grades.length + 
           filters.regions.length + 
           filters.status.length +
           (filters.searchQuery ? 1 : 0) +
           (filters.startDate ? 1 : 0) +
           (filters.endDate ? 1 : 0);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            검색 및 필터
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              전체 초기화
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 검색창 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="수업명이나 교사명으로 검색..."
            value={filters.searchQuery}
            onChange={(e) => updateFilters({ searchQuery: e.target.value })}
            className="pl-10"
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 과목 필터 */}
          <Collapsible open={expandedSections.subjects} onOpenChange={() => toggleSection("subjects")}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>과목 {filters.subjects.length > 0 && `(${filters.subjects.length})`}</span>
                {expandedSections.subjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={filters.subjects.includes(subject)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("subjects", subject, checked as boolean)
                    }
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-sm">{subject}</Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* 학교급 필터 */}
          <Collapsible open={expandedSections.grades} onOpenChange={() => toggleSection("grades")}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>학교급 {filters.grades.length > 0 && `(${filters.grades.length})`}</span>
                {expandedSections.grades ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
              {GRADES.map((grade) => (
                <div key={grade} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grade-${grade}`}
                    checked={filters.grades.includes(grade)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("grades", grade, checked as boolean)
                    }
                  />
                  <Label htmlFor={`grade-${grade}`} className="text-sm">{grade}</Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* 상태 필터 */}
          <Collapsible open={expandedSections.status} onOpenChange={() => toggleSection("status")}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <span>상태 {filters.status.length > 0 && `(${filters.status.length})`}</span>
                {expandedSections.status ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2 border rounded-md p-3">
              {STATUS_OPTIONS.map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${option.key}`}
                    checked={filters.status.includes(option.key)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange("status", option.key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${option.key}`} className="text-sm">{option.label}</Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* 지역 필터 (전체 너비) */}
        <Collapsible open={expandedSections.regions} onOpenChange={() => toggleSection("regions")}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>지역 (전라남도) {filters.regions.length > 0 && `(${filters.regions.length})`}</span>
              {expandedSections.regions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="border rounded-md p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {REGIONS.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={filters.regions.includes(region)}
                      onCheckedChange={(checked) => 
                        handleCheckboxChange("regions", region, checked as boolean)
                      }
                    />
                    <Label htmlFor={`region-${region}`} className="text-sm truncate">{region}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* 날짜 필터 */}
        <Collapsible open={expandedSections.date} onOpenChange={() => toggleSection("date")}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                날짜 필터 {(filters.startDate || filters.endDate) && "(설정됨)"}
              </span>
              {expandedSections.date ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="border rounded-md p-3 space-y-3">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="start-date" className="text-sm">시작 날짜</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => updateFilters({ startDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="end-date" className="text-sm">종료 날짜</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => updateFilters({ endDate: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* 선택된 필터 표시 */}
        {getActiveFiltersCount() > 0 && (
          <div className="pt-3 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {filters.searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  검색: {filters.searchQuery}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFilters({ searchQuery: "" });
                    }}
                  />
                </Badge>
              )}
              {filters.subjects.map(subject => (
                <Badge key={subject} variant="secondary" className="gap-1">
                  {subject}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange("subjects", subject, false);
                    }}
                  />
                </Badge>
              ))}
              {filters.grades.map(grade => (
                <Badge key={grade} variant="secondary" className="gap-1">
                  {grade}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCheckboxChange("grades", grade, false);
                    }}
                  />
                </Badge>
              ))}
              {filters.regions.map(region => (
                <Badge key={region} variant="secondary" className="gap-1">
                  {region}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={() => handleCheckboxChange("regions", region, false)}
                  />
                </Badge>
              ))}
              {filters.status.map(status => (
                <Badge key={status} variant="secondary" className="gap-1">
                  {STATUS_OPTIONS.find(opt => opt.key === status)?.label}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={() => handleCheckboxChange("status", status, false)}
                  />
                </Badge>
              ))}
              {filters.startDate && (
                <Badge variant="secondary" className="gap-1">
                  시작: {filters.startDate}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFilters({ startDate: "" });
                    }}
                  />
                </Badge>
              )}
              {filters.endDate && (
                <Badge variant="secondary" className="gap-1">
                  종료: {filters.endDate}
                  <X 
                    className="h-3 w-3 cursor-pointer hover:text-foreground" 
                    onClick={(e) => {
                      e.stopPropagation();
                      updateFilters({ endDate: "" });
                    }}
                  />
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}