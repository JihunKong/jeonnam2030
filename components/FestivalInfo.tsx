import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, MapPin, Clock, Star, Users, Award, ExternalLink } from "lucide-react";

export function FestivalInfo() {
  const [activeSection, setActiveSection] = useState("about");

  const scheduleData = [
    {
      time: "10:00 - 10:30",
      title: "개회식",
      location: "시청각실",
      description: "교육감 환영사와 개막 행사"
    },
    {
      time: "10:30 - 12:00",
      title: "컨퍼런스 마당",
      location: "시청각실",
      description: "기조강연 및 수업혁신 사례 발표"
    },
    {
      time: "10:30 - 15:30",
      title: "에듀테크/독서인문 사례 나눔",
      location: "1층, 3학년 6~8반",
      description: "에듀테크/독서인문 수업 운영 사례 나눔"
    },
    {
      time: "10:30 - 15:30",
      title: "대표 수업 공개",
      location: "3층, 2-1, 2-3, 2-5",
      description: "대표 수업 시연 참관 및 질의응답"
    },
    {
      time: "10:30 - 15:30",
      title: "2030 수업연구 사례 나눔",
      location: "2층 3학년 1~4반, 3층 2학년 7~9반",
      description: "2030 교실을 활용한 수업연구 및 구축 과정 발표"
    },
    {
      time: "10:30 - 16:00",
      title: "중등교과교육연구회",
      location: "4층 1학년 1~9반, 음악실, 미술실",
      description: "교과별 연수 운영"
    },
    {
      time: "10:30 - 15:30",
      title: "질문하는 학교 선도학교 운영 사례 나눔",
      location: "4층 홈베이스",
      description: "질문하는 학교 선도학교 운영 성과 나눔"
    },
    {
      time: "13:30 - 15:30",
      title: "2030 국제교육교류 성과 공유",
      location: "3층 과학실습실",
      description: "2030 국제교육교류 성과 및 발전 방안 발표"
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">2030수업나눔한마당</h2>
              <p className="text-lg text-muted-foreground">
                미래교육의 새로운 패러다임을 제시하는 2030수업나눔한마당
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <ImageWithFallback 
                  src="/images/festival-scene.png"
                  alt="수업나눔한마당 현장"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      수업나눔한마당 개요
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      전라남도교육청이 주관하는 2030수업나눔한마당은 미래형 교실에서 
                      이루어지는 혁신적인 수업 사례를 공유하고, 전남의 선생님들과 
                      함께 소통하는 교육 박람회입니다.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>2025년 11월 29일 (토)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>09:00 - 17:00</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>순천삼산중학교</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    참가 대상
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• 도내 초·중·고 교사</li>
                    <li>• 교육 전문가</li>
                    <li>• 학부모 및 지역 주민</li>
                    <li>• 교육 관련 기관 관계자</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    주요 프로그램
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• 수업 공개 및 참관</li>
                    <li>• 체험 부스 운영</li>
                    <li>• 우수 사례 발표</li>
                    <li>• 네트워킹 세션</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-500" />
                    기대 효과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    <li>• 교육 혁신 사례 공유</li>
                    <li>• 교사 역량 강화</li>
                    <li>• 네트워크 구축</li>
                    <li>• 미래교육 비전 제시</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "poster":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">축제 포스터</h2>
            <div className="max-w-2xl mx-auto">
              <ImageWithFallback
                src="/images/festival-poster.png?v=20251001"
                alt="2030수업축제 포스터"
                className="w-full rounded-lg shadow-lg"
              />
              <div className="mt-4 text-center">
                <Button variant="outline">포스터 다운로드</Button>
              </div>
            </div>
          </div>
        );

      case "schedule":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">수업나눔한마당 일정</h2>
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-4">
                {scheduleData.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Badge variant="outline" className="shrink-0 mt-1">
                          {item.time}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                          <p className="text-sm">{item.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case "directions":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">찾아오시는 길</h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>주소 및 연락처</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <h4 className="font-semibold mb-1">주소</h4>
                        <p className="text-sm">전라남도 순천시 해룡면 매안로 84</p>
                        <p className="text-sm">순천삼산중학교</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">전화번호</h4>
                        <p className="text-sm">061-752-2982</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">주차 안내</h4>
                        <p className="text-sm">학교 주차장 이용 가능</p>
                        <p className="text-sm text-muted-foreground">
                          주차 공간이 제한적이니 대중교통 이용을 권장합니다.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>교통편</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">🚌 버스</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• 순천종합터미널에서 시내버스 이용</li>
                          <li>• 순천삼산중학교 하차</li>
                          <li>• 소요시간: 약 30분</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">🚗 자가용</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• 신대IC에서 20분</li>
                          <li>• 네비게이션: "순천삼산중학교"</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="mt-8">
                <Card>
                  <CardContent className="p-6">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=순천삼산중학교&zoom=15&maptype=roadmap`}
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="순천삼산중학교 위치"
                      className="rounded-lg"
                    ></iframe>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* 좌측 사이드바 */}
      <div className="w-64 bg-sidebar border-r border-sidebar-border p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">수업축제</h3>
            <nav className="space-y-2">
              <Button 
                variant={activeSection === "about" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("about")}
              >
                <Star className="mr-2 h-4 w-4" />
                About 수업나눔한마당
              </Button>
              <Button 
                variant={activeSection === "poster" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("poster")}
              >
                <Award className="mr-2 h-4 w-4" />
                포스터
              </Button>
              <Button 
                variant={activeSection === "schedule" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("schedule")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                축제일정
              </Button>
              <Button
                variant={activeSection === "directions" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("directions")}
              >
                <MapPin className="mr-2 h-4 w-4" />
                찾아오시는 길
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSej9IOErowF-Fy3YGcEUL3x1Qks6FVb2QzhF54eqqmDn5Becw/formResponse", "_blank")}
              >
                <Users className="mr-2 h-4 w-4" />
                신청하기
                <ExternalLink className="ml-auto h-3 w-3" />
              </Button>
            </nav>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
}