import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FileText } from "lucide-react";

// PDF를 Google Docs Viewer로 열기 (카카오톡, Edge 등 모든 브라우저 호환)
const openPdfInViewer = (pdfPath: string) => {
  const fullUrl = `https://xn--2030-kc8ph53i.kr${pdfPath}`;
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
  window.open(viewerUrl, '_blank');
};

export function About2030() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">2030교실</h2>
          <p className="text-lg text-muted-foreground">미래수업을 연구하고 실천하는 교실</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <ImageWithFallback 
              src="/images/about-2030.png" 
              alt="2030교실 환경 - 현대적인 교실에서 기술을 활용하는 학생들"
              className="w-full h-64 object-cover rounded-lg mb-4"
              />
          </div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>2030교실이란?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  전라남도교육청에서 추진하는 미래형 교실 환경으로,<br/>
                  전남이 직면한 2030년 교육 상황을 대비하고,<br/>
                  수업 대전환을 촉진하며, K-에듀를 선도하는,<br/>
                  학생들의 역량을 키우는 혁신적인 교육 공간입니다.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openPdfInViewer('/leaflet.pdf')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  중등 2030교실 리플릿
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openPdfInViewer('/guidemap-leaflet.pdf')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  중등 수업 맛집 가이드맵 리플릿
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle><span style={{fontWeight: 'bold'}}>미래수업</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p>학생 주도성 키움 수업<br/>전남 미래 대비 수업</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><span style={{fontWeight: 'bold'}}>교실 환경</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p>공간 환경<br/>디지털 환경</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle><span style={{fontWeight: 'bold'}}>2030교실</span></CardTitle>
            </CardHeader>
            <CardContent>
              <p>수업 대전환을 촉진하고<br/> K-에듀를 선도하는 교실</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>2030교실의 특징</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">🔧 첨단 교실 환경</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 최첨단 디지털 기기 활용 교육</li>
                    <li>• 2030교실 맞춤형 플랫폼</li>
                    <li>• 시공간을 초월하는 네트워킹 플랫폼</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">👥 협력 학습 공간</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• 유연한 교실 공간 구성</li>
                    <li>• 소그룹 활동 지원</li>
                    <li>• 발표, 토론, 공유에 최적화</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}