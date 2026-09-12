# 반려문화증진위원회

반려동물 업종 전용 동네 디렉터리 랜딩 (동물병원·펫샵·미용·호텔·카페·훈련소·시터·용품 등).

## 무엇을 클론했나

| 항목 | 출처 | 적용 방식 |
|------|------|-----------|
| **구조·섹션 순서·카피 흐름** | [banananx.com](https://banananx.com/) (바나나스페이스) | 홈페이지 섹션 순서·역할 동일, 문구는 펫 니치로 재작성 |
| **색감·비주얼 톤** | [magazine.onenonly.ai.kr](https://magazine.onenonly.ai.kr/) | 다크 배경 `#05050a`, 시안 액센트 `#00e5ff`, 퍼플 `#bf5af2` 등 **색만** 참고 (매거진 구조는 미사용) |

### banananx 섹션 대응표

1. Hero  
2. 검색/AI 내러티브 + 엔진 프리뷰  
3. LIVE 데모  
4. What is … (디렉터리 소개)  
5. First Open / 가격 CTA  
6. 동네 업데이트 (LIVE 피드)  
7. 6 AI 엔진 상세  
8. 숫자 통계  
9. 업종 카테고리 (**펫 ONLY**)  
10. 엔진 결과 예시  
11. 업종별 샘플 원고  
12. Why use us / pain points  
13. 사장님 포털 CTA  
14. 공식 파트너  
15. FAQ  
16. Footer (사업자 필드는 `(준비중)` 플레이스홀더)

## 실행 방법

```bash
cd pet-culture-committee   # 또는 F:\반려문화증진위원회
cp .env.example .env.local   # 선택
npm install
npm run dev
```

브라우저: [http://localhost:3000](http://localhost:3000)

프로덕션 빌드:

```bash
npm run build
npm start
```

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- 카피 소스: `lib/copy.ts` (전체 한글 카피는 `COPY.md`)
- 공공데이터 스텁: `lib/public-data.ts`

## 공공데이터 — 사용자가 준비할 것

1. [공공데이터포털](https://www.data.go.kr/) 회원가입 후 **일반/활용신청 인증키** (`PUBLIC_DATA_API_KEY`)
2. 활용할 데이터셋 선정·활용신청 (예시):
   - 전국/지역 **동물병원** 인허가·현황
   - **동물약국** / 동물용의약품 취급
   - 지자체별 **반려동물 관련 영업** (미용·위탁관리·전시 등)
   - (선택) 동물보호센터·유기동물 공고
3. 각 데이터셋의 **OpenAPI 엔드포인트·파라미터·응답 필드** 문서 확보
4. `.env.local`에 키 넣고 `lib/public-data.ts`의 `fetchPetBusinesses`를 실제 호출로 교체

> 사업자등록번호·대표자·주소 등 푸터 필드는 고의로 `(준비중)` 입니다. 실데이터를 넣지 마세요(발명 금지).

## SEO 개선 (구조 유지)

- 응급병원·지역 필터 카피/CTA 추가
- 펫 ONLY 카테고리
- FAQ·메타 keywords에 동물병원·응급 등 반영

## 폴더 메모

- ASCII 경로 미러: `F:\pet-culture-committee` (한글 경로 인코딩 이슈 시)
- 목표 경로: `F:\반려문화증진위원회`
