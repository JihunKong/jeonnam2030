import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { ClassCard } from "./ClassCard";
import { ClassListItem } from "./ClassListItem";
import { QRCodeModal } from "./QRCodeModal";
import { SearchFilters, FilterState } from "./SearchFilters";
import { Badge } from "./ui/badge";
import { Calendar, FileText, Users, ExternalLink } from "lucide-react";
import { calculateClassStatus, isDateInRange } from "./utils/dateUtils";


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
  region: string;
}

interface ClassDataWithStatus extends ClassData {
  status: "upcoming" | "ongoing" | "completed";
}

export function ClassSchedule() {
  const [selectedClass, setSelectedClass] = useState<ClassDataWithStatus | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    subjects: [],
    grades: [],
    regions: [],
    startDate: "",
    endDate: "",
    status: []
  });

  // 1분마다 현재 시간을 업데이트하여 수업 상태를 실시간으로 갱신
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, []);

  const baseClasses: ClassData[] = [
  {
    "id": "1",
    "title": "디지털 리터러시 역량을 기르기 위한 온라인 공동 협업 프로젝트",
    "teacher": "손O지",
    "subject": "영어",
    "grade": "중학교",
    "date": "2025년 11월 6일",
    "time": "09:55 - 10:40",
    "location": "목포 목포중앙여중 2030교실",
    "description": "Technology in Our Lives - 디지털 리터러시 역량 강화",
    "driveLink": "qr코드 미인식",
    "region": "목포시"
  },
  {
    "id": "2",
    "title": "인공지능(AI)을 활용한 미래 학교 시설 홍보 프로젝트",
    "teacher": "조O라",
    "subject": "영어",
    "grade": "중학교",
    "date": "2025년 10월 17일",
    "time": "10:40 - 11:25",
    "location": "목포 목포덕인중 2030 DEOGIN CENTER",
    "description": "Living in the AI World",
    "driveLink": "https://abit.ly/덕인중2030",
    "region": "목포시"
  },
  {
    "id": "3",
    "title": "직업 세계의 변화",
    "teacher": "박O홍",
    "subject": "진로",
    "grade": "중학교",
    "date": "2025년 10월 30일",
    "time": "15:20 - 16:10",
    "location": "목포 목포홍일중 진로커리어존",
    "description": "직업 정보를 탐색하고 활용",
    "driveLink": "https://abit.ly/홍일중2030",
    "region": "목포시"
  },
  {
    "id": "4",
    "title": "디지털 탐구와 기후 자료로 보는 기후 변화와 대응",
    "teacher": "이O연",
    "subject": "과학",
    "grade": "중학교",
    "date": "2025년 10월 31일",
    "time": "11:25 - 12:10",
    "location": "여수 여수종고중 2030스마트 과학실",
    "description": "기후 변화와 대응 디지털 탐구",
    "driveLink": "없음",
    "region": "여수시"
  },
  {
    "id": "5",
    "title": "윤동주 시를 읽고 나만의 별을 찾아, 삶과 연결된 시 쓰기",
    "teacher": "이O주",
    "subject": "영어",
    "grade": "중학교",
    "date": "2025년 10월 31일",
    "time": "08:50 - 09:35",
    "location": "나주 노안중 1층 디지털공작소",
    "description": "Finding My Star, Writing My Story",
    "driveLink": "https://abit.ly/노안중2030",
    "region": "나주시"
  },
  {
    "id": "6",
    "title": "인구 통계 자료 분석 및 미래 인구 예측 활동",
    "teacher": "박O환",
    "subject": "수학",
    "grade": "중학교",
    "date": "2025년 10월 15일",
    "time": "13:20 - 14:05",
    "location": "광양 광양골약중 수학2실",
    "description": "인구 통계 자료 분석 및 미래 인구 예측",
    "driveLink": "https://abit.ly/광양골약중2030",
    "region": "광양시"
  },
  {
    "id": "7",
    "title": "디지털 기기를 이용한 학생과 소통 수업",
    "teacher": "정O범",
    "subject": "수학",
    "grade": "중학교",
    "date": "2025년 10월 31일",
    "time": "09:55 - 10:40",
    "location": "광양 광양제철중 수다방",
    "description": "산점도와 상관관계",
    "driveLink": "https://abit.ly/광양제철중2030",
    "region": "광양시"
  },
  {
    "id": "8",
    "title": "탄소발자국과 친환경 생활",
    "teacher": "안O희",
    "subject": "영어",
    "grade": "중학교",
    "date": "2025년 10월 27일",
    "time": "14:00 - 14:45",
    "location": "고흥 고흥대서중 글로컬교실",
    "description": "Think Green, Live Green",
    "driveLink": "https://abit.ly/고흥대서중2030",
    "region": "고흥군"
  },
  {
    "id": "9",
    "title": "우리 마을 조례 제정, 시민 참여",
    "teacher": "김O경",
    "subject": "사회",
    "grade": "중학교",
    "date": "2025년 10월 20일",
    "time": "13:00 - 13:45",
    "location": "함평 함평월야중 교과교실",
    "description": "정치과정과 시민 참여",
    "driveLink": "https://abit.ly/함평월야중2030",
    "region": "함평군"
  },
  {
    "id": "10",
    "title": "에너지 전환과 보존",
    "teacher": "박O운",
    "subject": "과학",
    "grade": "중학교",
    "date": "2025년 10월 21일",
    "time": "10:40 - 11:25",
    "location": "영광 해룡중 3학년1반",
    "description": "여러가지 에너지 전환과 보존",
    "driveLink": "https://abit.ly/해룡중2030",
    "region": "영광군"
  },
  {
    "id": "11",
    "title": "사회 문제 해결을 위한 온라인 정책 전시회",
    "teacher": "김O은",
    "subject": "사회",
    "grade": "중학교",
    "date": "2025년 10월 17일",
    "time": "11:45 - 12:30",
    "location": "완도 노화중 AI 교실",
    "description": "사회 문제 해결을 위한 온라인 정책 전시회",
    "driveLink": "https://abit.ly/노화중2030",
    "region": "완도군"
  },
  {
    "id": "12",
    "title": "지능 에이전트를 활용한 환경보호 캠페인 노래앨범 만들기",
    "teacher": "김O훈",
    "subject": "정보",
    "grade": "고등학교",
    "date": "2025년 10월 27일",
    "time": "13:30 - 14:20",
    "location": "목포 목포중앙고 AI융합정보실",
    "description": "지능 에이전트를 활용한 환경보호 캠페인",
    "driveLink": "https://abit.ly/목포중앙고2030",
    "region": "목포시"
  },
  {
    "id": "13",
    "title": "생활 속 물질의 pH 웹 노선도 만들기",
    "teacher": "문O별",
    "subject": "과학",
    "grade": "고등학교",
    "date": "2025년 10월 30일",
    "time": "11:00 - 11:50",
    "location": "여수 부영여고 2030 화학실",
    "description": "생활 속 물질의 pH 웹 노선도 만들기",
    "driveLink": "https://abit.ly/부영여고2030",
    "region": "여수시"
  },
  {
    "id": "14",
    "title": "출처와 근거에 따라 AI질문 적합성 검토하고 독서 토론하기",
    "teacher": "김O현, 이O옥",
    "subject": "국어",
    "grade": "고등학교",
    "date": "2025년 10월 21일",
    "time": "13:50 - 14:40",
    "location": "여수 여천고 AI실",
    "description": "독서의 방법 - AI질문 적합성 검토와 독서토론",
    "driveLink": "https://abit.ly/여천고2030",
    "region": "여수시"
  },
  {
    "id": "15",
    "title": "오염 물질측정 장치를 활용한 학교 주변 환경 탐구하기",
    "teacher": "송O지",
    "subject": "과학",
    "grade": "고등학교",
    "date": "2025년 10월 15일",
    "time": "18:40 - 20:10",
    "location": "순천 순천매산여고 2030 천지실",
    "description": "생활 속의 과학 탐구",
    "driveLink": "지도안 없음",
    "region": "순천시"
  },
  {
    "id": "16",
    "title": "인간의 본성에 대한 탐구 [단편 소설에 나타난 인간의 심리]",
    "teacher": "윤O근",
    "subject": "영어",
    "grade": "고등학교",
    "date": "2025년 10월 24일",
    "time": "10:40 - 11:30",
    "location": "순천 순천매산여고 4층 링커스실",
    "description": "Knowing Ourselves, Knowing Others",
    "driveLink": "https://abit.ly/순천매산여고2030",
    "region": "순천시"
  },
  {
    "id": "17",
    "title": "우리 지역 산수화 미디어아트 프로젝트",
    "teacher": "조O희",
    "subject": "미술",
    "grade": "고등학교",
    "date": "2025년 10월 22일",
    "time": "09:50 - 10:40",
    "location": "나주 전남미용고 2층 상상아뜰리에(2030교실)",
    "description": "우리 지역 산수화 미디어아트 프로젝트",
    "driveLink": "없음",
    "region": "나주시"
  },
  {
    "id": "18",
    "title": "한일 협동 생태 토론 프로젝트",
    "teacher": "전O은",
    "subject": "일본어",
    "grade": "고등학교",
    "date": "2025년 10월 31일",
    "time": "16:20 - 17:10",
    "location": "광양 광양제철고 일본어미래교실",
    "description": "한일 공동 생태 토론",
    "driveLink": "https://abit.ly/광양제철고2030",
    "region": "광양시"
  },
  {
    "id": "19",
    "title": "교과서에서 나만의 탐구 주제 찾기: '세대 간 가치와 인식'을 모델로",
    "teacher": "김O성",
    "subject": "영어",
    "grade": "고등학교",
    "date": "2025년 10월 16일",
    "time": "11:40 - 12:30",
    "location": "곡성 옥과고 2030 OK 딥러닝 영어 교실",
    "description": "Treasure in My Life & In Someone Else's Shoes 융합 재구성",
    "driveLink": "없음",
    "region": "곡성군"
  },
  {
    "id": "20",
    "title": "다산 정약용의 사상으로 알아 보는 지방자치제도",
    "teacher": "이O민",
    "subject": "일반사회",
    "grade": "고등학교",
    "date": "2025년 10월 27일",
    "time": "10:50 - 11:30",
    "location": "보성 예당고 2030교실(AI아고라)",
    "description": "AI정약용과 함께 목민심서로 살펴보는 지방자치제도",
    "driveLink": "https://abit.ly/예당고2030",
    "region": "보성군"
  },
  {
    "id": "21",
    "title": "기후변화 독서 토론",
    "teacher": "박O성",
    "subject": "생물",
    "grade": "고등학교",
    "date": "2025년 10월 31일",
    "time": "14:00 - 14:50",
    "location": "무안 무안고 주제발표실(중강의실 307)",
    "description": "생태계와 환경 변화 - 기후 변화 독서 토론",
    "driveLink": "https://abit.ly/무안고2030",
    "region": "무안군"
  },
  {
    "id": "22",
    "title": "사상가와 함께하는 평화 포럼, 평화를 묻고 윤리로 답하다",
    "teacher": "강O",
    "subject": "윤리",
    "grade": "고등학교",
    "date": "2025년 10월 15일",
    "time": "15:00 - 15:50",
    "location": "무안 남악고 민주시민교실",
    "description": "평화포럼, 평화를 묻고 윤리로 답하다",
    "driveLink": "https://abit.ly/남악고2030",
    "region": "무안군"
  },
  {
    "id": "23",
    "title": "수학적 모델링을 통한 무안 낙지 관련 정책 제안 프로젝트",
    "teacher": "김O비",
    "subject": "수학",
    "grade": "고등학교",
    "date": "2025년 10월 28일",
    "time": "14:50 - 15:40",
    "location": "무안 백제고 2030 SMART 수학연구실(백제고 2층)",
    "description": "삼각함수, 수학적 모델링을 통한 무안 낙지 관련 정책 제안",
    "driveLink": "https://abit.ly/백제고2030",
    "region": "무안군"
  },
  {
    "id": "24",
    "title": "다양한 교과 활동을 통해 자신의 감정을 인지하고 바르게 표현하기",
    "teacher": "최O",
    "subject": "특수",
    "grade": "중학교",
    "date": "2025년 10월 29일",
    "time": "10:30 - 11:10",
    "location": "함평 함평영화학교 초6 교실",
    "description": "마음을 이해해요",
    "driveLink": "https://abit.ly/함평영화학교2030",
    "region": "함평군"
  },
  {
    "id": "25",
    "title": "우리 지역에서 열리는 축제 알아보며 축제의 특징과 좋은 점을 소개",
    "teacher": "김O실",
    "subject": "특수",
    "grade": "중학교",
    "date": "2025년 10월 28일",
    "time": "09:45 - 10:25",
    "location": "함평 함평영화학교 초3 교실",
    "description": "함께 사는 우리 동네",
    "driveLink": "https://abit.ly/함평영화학교특수2030",
    "region": "함평군"
  },
  {
    "id": "26",
    "title": "생활 속 디지털 음악 도구와 실시간 협업 창작 프로젝트 학습",
    "teacher": "박O",
    "subject": "음악",
    "grade": "중학교",
    "date": "2025년 10월 27일",
    "time": "11:45 - 12:30",
    "location": "목포 목포항도여중 AI교실",
    "description": "디지털 음악 도구와 실시간 협업 창작 프로젝트",
    "driveLink": "없음",
    "region": "목포시"
  },
  {
    "id": "27",
    "title": "영어 수업",
    "teacher": "김O은",
    "subject": "영어",
    "grade": "중학교",
    "date": "2025년 11월 5일",
    "time": "14:40 - 15:25",
    "location": "목포 목포홍일중",
    "description": "영어 수업",
    "driveLink": "지도안 없음",
    "region": "목포시"
  },
  {
    "id": "28",
    "title": "수자원과 관련된 자료 조사하여 발표하기",
    "teacher": "김O영",
    "subject": "과학",
    "grade": "중학교",
    "date": "2025년 11월 5일",
    "time": "13:10 - 13:55",
    "location": "담양 담양여중 2030교실",
    "description": "수권과 해수의 순환",
    "driveLink": "https://abit.ly/담양여중2030",
    "region": "담양군"
  },
  {
    "id": "29",
    "title": "협동 책 만들기 프로젝트",
    "teacher": "송O선",
    "subject": "국어",
    "grade": "중학교",
    "date": "2025년 10월 29일",
    "time": "10:30 - 11:15",
    "location": "보성 용정중 AI실",
    "description": "분류하고 활용하기 - 자료를 활용하여 글쓰기",
    "driveLink": "https://abit.ly/용정중2030",
    "region": "보성군"
  },
  {
    "id": "30",
    "title": "데이터 속 숨은 관계를 찾기:AI와 함께 하는 상관관계 분석",
    "teacher": "국O",
    "subject": "수학",
    "grade": "중학교",
    "date": "2025년 10월 23일",
    "time": "11:30 - 12:15",
    "location": "강진 도암중 AI실",
    "description": "산점도와 상관관계 - AI와 함께 하는 상관관계 분석",
    "driveLink": "https://abit.ly/도암중2030",
    "region": "강진군"
  },
  {
    "id": "31",
    "title": "삼각형의 닮음 (닮음비)",
    "teacher": "문O숙",
    "subject": "수학",
    "grade": "중학교",
    "date": "2025년 10월 30일",
    "time": "11:35 - 12:20",
    "location": "함평 함평중 AI 퓨처 클래스",
    "description": "도형의 닮음 - 삼각형의 닮음",
    "driveLink": "https://abit.ly/함평중2030",
    "region": "함평군"
  },
  {
    "id": "32",
    "title": "AI(인공지능) 및 에듀테크를 활용한 기술적 문제 해결 활동",
    "teacher": "이O영",
    "subject": "기술",
    "grade": "중학교",
    "date": "2025년 10월 22일",
    "time": "13:20 - 14:05",
    "location": "신안 신안신의중 AI 교실",
    "description": "정보통신기술문제해결활동",
    "driveLink": "https://abit.ly/신안신의중2030",
    "region": "신안군"
  },
  {
    "id": "33",
    "title": "기후변화 그래프로 나타내기",
    "teacher": "정O영",
    "subject": "수학",
    "grade": "고등학교",
    "date": "2025년 10월 30일",
    "time": "13:50 - 14:40",
    "location": "여수 여천고 SMART LAB",
    "description": "기후변화와 통계분석 - 기후변화 통계포스터 발표 및 미래예측",
    "driveLink": "https://abit.ly/여천고수학2030",
    "region": "여수시"
  },
  {
    "id": "34",
    "title": "화성 탐사: 인류의 미래를 향한 도전",
    "teacher": "나O경",
    "subject": "영어",
    "grade": "고등학교",
    "date": "2025년 10월 29일",
    "time": "10:50 - 11:40",
    "location": "나주 매성고 AI 실",
    "description": "영어 에세이 쓰기 - 만약 우리가 화성으로 이주한다면",
    "driveLink": "없음",
    "region": "나주시"
  },
  {
    "id": "35",
    "title": "스케일 사고(scale thinking)를 통한 나와 지역을 잇는 수업",
    "teacher": "양O영",
    "subject": "지리",
    "grade": "고등학교",
    "date": "2025년 10월 20일",
    "time": "15:50 - 16:40",
    "location": "나주 봉황고 2030교실",
    "description": "스케일 사고를 통한 나와 지역을 잇는 수업",
    "driveLink": "https://abit.ly/봉황고2030",
    "region": "나주시"
  },
  {
    "id": "36",
    "title": "신나는 우쿨렐로'캔디'함께 연주하기!",
    "teacher": "김O지",
    "subject": "음악",
    "grade": "고등학교",
    "date": "2025년 10월 16일",
    "time": "10:50 - 11:40",
    "location": "나주 나주공고 2030 AI교실",
    "description": "우리가 직접 만든 악기(우쿨렐레)로 연주해봐요",
    "driveLink": "https://abit.ly/나주공고2030",
    "region": "나주시"
  },
  {
    "id": "37",
    "title": "도형의 방정식을 활용한 15분 도시 설계",
    "teacher": "박O경",
    "subject": "수학",
    "grade": "고등학교",
    "date": "2025년 11월 5일",
    "time": "15:00 - 15:50",
    "location": "고흥 녹동고 2030교실",
    "description": "도형의 방정식을 활용한 15분 도시 설계",
    "driveLink": "https://abit.ly/녹동고2030",
    "region": "고흥군"
  },
  {
    "id": "38",
    "title": "문학, 여행이 되다!",
    "teacher": "김O진",
    "subject": "국어",
    "grade": "고등학교",
    "date": "2025년 10월 28일",
    "time": "09:00 - 09:50",
    "location": "무안 무안고 AI수업실(중강의실 306)",
    "description": "현대 문학의 특질과 전개 - 문학, 여행이 되다!",
    "driveLink": "https://abit.ly/무안고국어2030",
    "region": "무안군"
  },
  {
    "id": "39",
    "title": "글로벌 피드백을 반영한 사이트 유지보수",
    "teacher": "백O숙",
    "subject": "상업",
    "grade": "고등학교",
    "date": "2025년 10월 28일",
    "time": "13:20 - 14:10",
    "location": "영광 법성고 2030AI교실",
    "description": "글로벌 피드백을 반영한 사이트 유지보수",
    "driveLink": "https://abit.ly/법성고2030",
    "region": "영광군"
  },
  {
    "id": "40",
    "title": "AI 판사를 설득하라 ! (비판적으로 추론하기)",
    "teacher": "신O령",
    "subject": "국어",
    "grade": "중학교",
    "date": "2025년 10월 22일",
    "time": "10:45 - 11:30",
    "location": "나주 나주금천중 1층 진로카페",
    "description": "추론하며 읽기 - AI 판사를 설득하라!",
    "driveLink": "없음",
    "region": "나주시"
  },
  {
    "id": "41",
    "title": "국제 정세를 통한 관세 정책을 경제 수학적으로 분석하기",
    "teacher": "문O인",
    "subject": "수학",
    "grade": "고등학교",
    "date": "2025년 10월 23일",
    "time": "09:00 - 09:50",
    "location": "함평 함평학다리고",
    "description": "국제 정세를 통한 관세 정책 경제 수학적 분석",
    "driveLink": "https://abit.ly/학다리고2030",
    "region": "함평군"
  },
  {
    "id": "42",
    "title": "환경 문제 해결을 위한 영어 웹툰 제작하기",
    "teacher": "정O희",
    "subject": "영어",
    "grade": "중학교",
    "date": "2025년 10월 27일",
    "time": "14:35 - 15:20",
    "location": "무안 무안행복중 1-8 교실",
    "description": "환경 문제 관련 영어 웹툰 제작하기",
    "driveLink": "https://abit.ly/무안행복중2030",
    "region": "무안군"
  },
  {
    "id": "43",
    "title": "아메리카의 위치와 자연환경",
    "teacher": "강O구",
    "subject": "사회",
    "grade": "중학교",
    "date": "2025년 10월 27일",
    "time": "10:50 - 11:35",
    "location": "신안 장산중 1-1 교실",
    "description": "아메리카의 위치와 자연 환경",
    "driveLink": "https://abit.ly/장산중2030",
    "region": "신안군"
  },
  {
    "id": "44",
    "title": "환경·에너지 문제 해결을 위한 국제기구의 노력 및 우리의 대응",
    "teacher": "최O망",
    "subject": "통합사회",
    "grade": "고등학교",
    "date": "2025년 10월 21일",
    "time": "14:20 - 15:10",
    "location": "곡성 옥과고",
    "description": "환경·에너지 문제 해결을 위한 국제기구의 노력",
    "driveLink": "https://abit.ly/옥과고2030",
    "region": "곡성군"
  },
  {
    "id": "45",
    "title": "생식세포가 만들어지는 과정",
    "teacher": "전O미",
    "subject": "과학",
    "grade": "중학교",
    "date": "2025년 10월 22일",
    "time": "13:40 - 14:25",
    "location": "광양 광양마동중 1과학실",
    "description": "생식세포가 만들어지는 과정",
    "driveLink": "코드가 비공개",
    "region": "광양시"
  },
  {
    "id": "46",
    "title": "기후변화와 생물다양성",
    "teacher": "구O빈",
    "subject": "생물",
    "grade": "고등학교",
    "date": "2025년 10월 28일",
    "time": "11:00 - 11:50",
    "location": "무안 남악고 AI실",
    "description": "기후변화와 생물다양성(전남형 미네르바 토론 수업)",
    "driveLink": "없음",
    "region": "무안군"
  },
  {
    "id": "47",
    "title": "음악과 미디어: 음악 교과에서 k-pop의 활용과 지역 연계 버스킹 실천 수업",
    "teacher": "김O주",
    "subject": "음악",
    "grade": "고등학교",
    "date": "2025년 10월 23일",
    "time": "13:40 - 14:30",
    "location": "나주 봉황고 음악실",
    "description": "음악 교과에서 K-pop의 활용과 지역 연계 버스킹 실천",
    "driveLink": "없음",
    "region": "나주시"
  },
  {
    "id": "48",
    "title": "그림책에서 굿즈로 : 지역의 이야기를 담은 디자인 프로젝트",
    "teacher": "한O하",
    "subject": "미술",
    "grade": "중학교",
    "date": "2025년 11월 3일",
    "time": "14:25 - 15:10",
    "location": "여수 여수아리울중 미래교실",
    "description": "그림책에서 굿즈로 - 지역의 이야기를 담은 디자인 프로젝트",
    "driveLink": "https://abit.ly/여수아리울중",
    "region": "여수시"
  },
  {
    "id": "49",
    "title": "내 고장 문화재를 창작 한시로 소개하기",
    "teacher": "이O미",
    "subject": "한문",
    "grade": "중학교",
    "date": "2025년 10월 30일",
    "time": "09:55 - 10:40",
    "location": "화순 화순제일중 기술실",
    "description": "내 고장 문화재를 창작 한시로 소개하기",
    "driveLink": "없음",
    "region": "화순군"
  },
  {
    "id": "50",
    "title": "숏폼 미디어와 음악 : 디지털 시대의 표현",
    "teacher": "고O하",
    "subject": "음악",
    "grade": "고등학교",
    "date": "2025년 10월 30일",
    "time": "13:40 - 14:30",
    "location": "무안 전남예술고 1-5교실",
    "description": "숏폼 미디어와 음악 - 디지털 시대의 표현",
    "driveLink": "https://abit.ly/전남예술고2030",
    "region": "무안군"
  }
  ];

  // 상태가 포함된 수업 데이터 생성 (currentTime이 변경될 때마다 재계산)
  const classesWithStatus = useMemo((): ClassDataWithStatus[] => {
    return baseClasses.map(classData => ({
      ...classData,
      status: calculateClassStatus(classData.date, classData.time)
    }));
  }, [currentTime]);

  // 필터링된 수업 목록
  const filteredClasses = useMemo(() => {
    return classesWithStatus.filter(classData => {
      // 검색어 필터
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          classData.title.toLowerCase().includes(query) ||
          classData.teacher.toLowerCase().includes(query) ||
          classData.description.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 과목 필터
      if (filters.subjects.length > 0 && !filters.subjects.includes(classData.subject)) {
        return false;
      }

      // 학교급 필터
      if (filters.grades.length > 0 && !filters.grades.includes(classData.grade)) {
        return false;
      }

      // 지역 필터
      if (filters.regions.length > 0 && !filters.regions.includes(classData.region)) {
        return false;
      }

      // 상태 필터
      if (filters.status.length > 0 && !filters.status.includes(classData.status)) {
        return false;
      }

      // 날짜 필터 (개선된 날짜 비교)
      if (filters.startDate || filters.endDate) {
        if (!isDateInRange(classData.date, filters.startDate, filters.endDate)) {
          return false;
        }
      }

      return true;
    });
  }, [classesWithStatus, filters]);

  const handleViewQR = (classData: ClassDataWithStatus) => {
    setSelectedClass(classData);
    setIsQRModalOpen(true);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex h-full">
      {/* 좌측 사이드바 */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">수업 공개</h3>
            <nav className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => {/* 수업공개일정 */}}
              >
                <Calendar className="mr-2 h-4 w-4" />
                수업공개일정
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => window.open("https://forms.google.com/example", "_blank")}
              >
                <FileText className="mr-2 h-4 w-4" />
                참관 신청
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">수업 공개 일정</h2>
              <p className="text-muted-foreground">2030교실의 혁신적인 수업을 참관해보세요</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open("https://forms.google.com/example", "_blank")}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                참관 신청하기
                <ExternalLink className="h-3 w-3" />
              </Button>
              
              <Tabs value={viewMode} onValueChange={(value: string) => setViewMode(value as "list" | "card")}>
                <TabsList>
                  <TabsTrigger value="card">카드형</TabsTrigger>
                  <TabsTrigger value="list">리스트형</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* 검색 및 필터 */}
          <SearchFilters onFiltersChange={handleFiltersChange} />

          {/* 검색 결과 요약 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                총 {filteredClasses.length}개의 수업이 검색되었습니다
              </span>
              {filteredClasses.length !== classesWithStatus.length && (
                <Badge variant="outline" className="text-xs">
                  전체 {classesWithStatus.length}개 중
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                마지막 업데이트: {currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* 수업 목록 */}
          {filteredClasses.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-muted-foreground mb-2">검색 조건에 맞는 수업이 없습니다.</p>
                <p className="text-sm text-muted-foreground">필터를 조정하거나 검색어를 변경해보세요.</p>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "card" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {filteredClasses.map((classData) => (
                viewMode === "card" ? (
                  <ClassCard 
                    key={classData.id}
                    classData={classData}
                    onViewQR={handleViewQR}
                  />
                ) : (
                  <ClassListItem
                    key={classData.id}
                    classData={classData}
                    onViewQR={handleViewQR}
                  />
                )
              ))}
            </div>
          )}

          {/* 안내 사항 */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>참관 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">📝 참관 신청 방법</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 온라인 신청서 작성 (참관 3일 전까지)</li>
                    <li>• 신분증 지참 필수</li>
                    <li>• 참관 확인증 발급</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">⏰ 참관 시간</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 수업 시작 10분 전 입실</li>
                    <li>• 수업 중 휴대폰 무음 모드</li>
                    <li>• 수업 후 질의응답 시간</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR 코드 모달 */}
      <QRCodeModal 
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        classData={selectedClass}
      />
    </div>
  );
}