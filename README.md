## 2024-10-15
- 주제, 필드트립, 교보재 회의 진행

- 주제 후보
  1. 취업 정보 서비스
    - 메인 기능
      - 채용공고 정보 기반으로 기업별 채용방 자동 생성
      - 필수 채널 - 기업의 채용 정보방, 잡담방

    - 부가 기능
      - 서류 합격 인증 안된 사용자: 잡담방, 채용 정보방, 자소서 작성기능만 사용가능
      - 자소서 작성 기능 (자소서 문항 제공)
      - 맞춤법 검사, 글자수 세기
      - 면접 스터디 매칭
        - 인성면접 준비를 할때 (pt, cs 등)
          - 1대4로 방이 만들어지면 예상질문이 떠서 다같이 면접 준비 (크아처럼)
          - 아니면 AI랑 1:1로 준비
          - 기업 정보 조사 면스 .. 등 자신이 원하는바에 맞춰서
      - 1대4 자기소개
          - 피드백 쓸 수 있게
          - AI가 피드백 요약
      - 개인 정보 분석
          - 자기소개 할 때 받았던 피드백 포함
          - 같은 기업에 지원하는 지원자들과의 스펙 비교
          - 내가 어디에 지원했고, 합격했고, 탈락했는지 (지라처럼)
      - 공고 즐겨찾기
      - 피드백 저장 → 이걸 기반으로 그래프 화 (못생김 ㅎ→ 글자구름 안할거임)

  2. 알고리즘 스터디 관리 서비스
    - 메인 기능
      - 스터디원 매칭
          - 원하는 유형, 난이도, .. 을 고려해서 필터링
              - ex) bfs 문제 풀거야, 00기업코테가 있어
              - 하루종일 코테만 하고 싶어 / 감 유지 용으로 하고 싶어
      - 백준 연동
          - 유형, 난이도를 토대로 문제 추천
      - 코드 리뷰
          - gpt로 1차 코드리뷰
          - 코멘토 현직자 or 지식인처럼 답변 남기고 채택 되면 포인트 지급
      - 스터디원과 코드
          - 해당 코드를 보면서 채팅할 수 있는 기능
    - 부가 기능
      - 진행상황 공유
          - 제대로 참여하지 않을 경우, 벌금
      - 스터디 기간: 일주일
          - 리셋 후 재매칭
          - 너무 마음에 들어 → 이 스터디 유지하기(선택지)
      - 스터디들끼리 대회 or 스터디원들끼리 대회
          - 대회 1등에게 벌금 몰빵
      - 내 로그 찍기
          - 문제 푸는 시간 체크
          - 많이 푸는 문제 유형 체크
          - 정답률/오답률

## 2024-10-16
- 주제 미팅 진행 및 후보 정리

1. 취업 정보 서비스
  - 자소설닷컴에 채팅방 기능이 있기에 딱히 차별점이 없는 듯 함
  - 컨님 말처럼 AI 면접으로 중점을 두는 것이 좋을 것 같다
  - 키워드가 들어갔는지, 표정이 어떤지, 몸이 움직이는지에 대해 AI가 분석
  - 공지방 → 기업 공지 제공
  - 잡담방
  - 자소설닷컴을 개발하려면 얼마나 걸릴까? 오래 걸린다
    - 자소설닷컴에서 뭘 뺄 것인가?
    - 현재 있는 기능들이 자소설닷컴에 있는 것과 많이 비슷
  - 채용공고 달력만 가져오려고 함
      - 경력인지 신입인지 조건
  - 기능이 너무 많다
    - 자소설닷컴 + 면접스터디를 둘 다 살리기는 시간이 부족할 것 같다
    - 뒤에 거만 가져간다 했을 때는 면접 스터디를 메인으로 가져가는 것이 맞지 않을까?
  - AI 피드백? → AI가 피드백을 요약만 하는걸로 그치는게 아니라 AI도 피드백을 주면 좋을듯
  - 면접 스터디 + 면접 피드백을 살리는 것이 더 좋지 않을까?

2. 백준 알고리즘 스터디 관련 서비스
- 혼자 사용할 순 없나?
  - 혼자 문제 풀고 리뷰 받아도 될 것 같다
- 강제성을 부여하는 것도 좋긴 하지만 유저가 쓰든 안 쓰든 자유롭게 이용할 수 있는 시스템을 주는 것이 좋다
  - 기능이 좋으면 어차피 쓸 사람은 쓴다
- 기존에 나와있는 것보다 더 좋게 만들었으면 좋겠다
- AI가 수준을 판단하여 문제를 추천해줌
  - AI가 맞춤형 알고리즘 문제 추천
      - 안푸는 유형 더 풀게하기
- 약한 유형에 대해 공부를 유도하는 형식으로
- 스터디는 부가 기능으로 하는 것이 좋을 듯
- 알고리즘에서 대회를 한다면 얼마나 대회가 될까?
  - 제대로 되기 힘들 것 같다
- 코치님 의견
  - 강제성 부여보다는 블로그의 기록을 도와준다든가 목표 기업을 선정하면 빈출 유형을 추천해주는 것이 더 좋지 않을까?

## 2024-10-22
![alt text](image.png)
![alt text](image-1.png)
- 요구사항 정의서 작성
- UI/UX 회의 진행

## 2024-10-23
- 프로젝트 기능 명세서 작성
- 피그마 제작
- https://www.figma.com/design/MuUxoBacXZulhQLqVRlFF3/%EB%A9%8D%EC%8A%A4%ED%8C%9F?node-id=0-1&node-type=canvas&t=RJrFb4lwnd6hCT6P-0

## 2024-10-24
- 피그마 제작
- 중간발표 ppt 제작

## 2024-10-25
- 중간발표 진행
- 피그마 제작

## 2024-10-28
- EC2에 도커 설치 및 젠킨스 환경설정
- 백엔드 젠킨스 파이프라인 구축 중