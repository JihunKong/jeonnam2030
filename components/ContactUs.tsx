import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Phone, Mail, User, Users, Clock } from "lucide-react";

export function ContactUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-lg text-muted-foreground">
            2030수업축제 관련 문의사항이 있으시면 언제든 연락해주세요
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 담당 장학사 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                담당 장학사
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center pb-4 border-b border-border">
              {/* 기존 원형 프레임에 imgur 이미지 추가 */}
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  <img 
                    src="/images/contact-image1.png"
                    alt="박현정 장학사"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">축제 문의</h3>
                <Badge variant="outline" className="mt-1">장학사 박현정</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">직통전화</p>
                    <p className="text-sm">061-260-0425</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">이메일</p>
                    <p className="text-sm">hyoun99@korea.kr</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">근무시간</p>
                    <p className="text-sm">평일 09:00 - 18:00</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="font-medium mb-2">담당 업무</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 2030교실 운영 총괄</li>
                  <li>• 수업 공개 관련 업무</li>
                  <li>• 교사 연수 및 지원</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 홍보팀 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                홍보팀
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
                  <img 
                    src="/images/contact-image2.png"
                    alt="교사 공지훈"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">홈페이지 문의</h3>
                <Badge variant="outline" className="mt-1">교사 공지훈</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">대표전화</p>
                    <p className="text-sm">061-550-0420</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">이메일</p>
                    <p className="text-sm">purusil55@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">근무시간</p>
                    <p className="text-sm">평일 09:00 - 17:00</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <h4 className="font-medium mb-2">담당 업무</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• 축제 홍보 및 마케팅</li>
                  <li>• 축제 일정 안내</li>
                  <li>• 참가 신청 관리</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 일반 문의 */}

        {/* 자주 묻는 질문 */}
        <Card>
          <CardHeader>
            <CardTitle>자주 묻는 질문</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Q. 수업 참관 신청은 어떻게 하나요?</h4>
                <p className="text-sm text-muted-foreground">
                  A. '수업 나눔 일정 및 신청' 탭에서 온라인으로 신청하실 수 있습니다. 
                  참관 희망일 3일 전까지 신청해주세요.
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Q. 축제 당일 주차는 가능한가요?</h4>
                <p className="text-sm text-muted-foreground">
                  A. 학교 주차장을 이용하실 수 있으나, 주차 공간이 제한적이므로 
                  대중교통 이용을 권장합니다.
                </p>
              </div>
              
              <div className="border border-border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Q. 축제 참가비가 있나요?</h4>
                <p className="text-sm text-muted-foreground">
                  A. 모든 프로그램은 무료로 참가하실 수 있습니다. 
                  다만 사전 신청이 필요한 프로그램이 있으니 확인해주세요.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                더 궁금한 사항이 있으시면 언제든 홍보팀에 연락해주세요!<br/>
              </p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  남악고 수석교사 강정
                </Button>
                <Button variant="outline" size="sm">
                  완도고 교사 봉창훈
                </Button>
                <Button variant="outline" size="sm">
                  순천미래과학고 교사 강대혁
                </Button>
                <Button variant="outline" size="sm">
                  문태중 교사 김현수
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}