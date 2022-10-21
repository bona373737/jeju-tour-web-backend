# jeju-tour-web-backend
- 제주도 여행정보(관광지,숙박,음식점)제공 웹사이트

#### [ 프로젝트 기술스택 및 개발환경 ]
- Frontend : HTML, CSS, SCSS, JS, ReactJS, Redux-toolkit
- Backend :  NodeJS, Express, MyBatis
- DB : MySQL
- 테스트서버 : ubuntu 개인서버컴퓨터 구축
- 배포서버 : 네이버 클라우드

## DB구조
![ERD](https://user-images.githubusercontent.com/73373898/194026809-33fe7928-5f07-4cdd-9e1a-96955ae10158.png)

## API
## [ 기능 : 로그인 ]

---

## [ 기능 : 회원가입 ]

1. 회원 등록
    - URL : /members
    - Method : post
    - Headers : application/json
    - Body
        - userid : string
        - password : string
        - passwordCheck : string
        - username : string
        - birthday : string
        - email : string
    - 응답예시
        
        ```json
        
        ```
        
2. 중복 id 조회
    - URL : /members/ismember
    - Method : get
    - Headers : application/json
    - Body
        - userid : string
    - 응답예시

---

## [ 기능 : 내저장(좋아요 기능) ]

1. 내저장 전체 목록 조회
    - URL : /likes
    - Method : get
    - Headers : application/json
    - Body
        - member_no : int
        - ref_id : int
        - ref_type : string (’P’,’A’,’F’)
    - 응답예시
    
    ```json
    {
    	"rt": 200,
    	"rtmsg": "OK",
    	"pagenation": {
    		"nowPage": 1,
    		"totalCount": 0,
    		"listCount": 10,
    		"totalPage": 1,
    		"groupCount": 5,
    		"totalGroup": 1,
    		"nowGroup": 1,
    		"groupStart": 1,
    		"groupEnd": 1,
    		"prevGroupLastPage": 0,
    		"nextGroupFirstPage": 0,
    		"offset": 0
    	},
    	"item": [
    		{
        "place_no": 60,
        "title": "표선해수욕장",
        "introduction": "너른 백사장이 매력적인 서귀포 동남부 해수욕장",
        "sbst": "총 면적 25만제곱미터, 백사장 16만 제곱미터에 이르는 표선해수욕장은 백사장이 아름다운 해수욕장으로 유명하다. 표선해수욕장의 넓은 모래콥은 썰물시엔 둥근 백사장처럼, 밀물시엔 수심이 낮은 애매랄드빛 원형 호수처럼 보여 경관이 아름답다. 뿐만 아니라 낮은 수심때문에 아이들과 물놀이를 즐기기에도 좋은 해수장이다. 인근 관광지로는 100m거리의 제주민속촌과 차로 5분 거리의 제주허브동산이 있다.",
        "postcode": null,
        "address": "제주특별자치도 서귀포시 표선면 표선리",
        "roadaddress": "제주특별자치도 서귀포시 표선면 표선리",
        "phoneno": "064-760-4992",
        "alltag": "해수욕장,액티비티,커플,맑음,여름,화장실,음료대,유도 및 안내시설,경보 및 피난시설,단독접근가능,단차없음,장애인 화장실,쉬움",
        "tag": "해수욕장,액티비티,커플,맑음,여름,자연경관,체험,레저/체험,해변,물놀이,수상레저",
        "longitude": 126.83810144720462,
        "latitude": 33.32723069299215,
        "reg_date": "2022-07-23T15:00:00.000Z",
        "edit_date": "2022-07-23T15:00:00.000Z",
        "image": "/tourinfo/place60.jpeg",
        "thumbnail": null,
        "like_no": 183
    		}
    		{},
    		{},
    		{},
    		.....
    	],
    	"pubdate": "2022-07-25T02:03:49.838Z"
    }
    ```
    
2. 내저장 추가(좋아요 등록)
    - URL : /likes
    - Method: post
    - Headers : application/json
    - Body :
        - ref_id : int
        - ref_type : string (’P’,’A’,’F’)
    - 응답예시
    
    ```json
    {"rt":200,
     "rtmsg":"OK",
     "item":[
       {"like_no":185,"member_no":47,"ref_id":59,"ref_type":"P"}
      ],
     "pubdate":"2022-10-10T03:08:16.844Z"}
    ```
    
3. 내저장 삭제(좋아요 취소)
    - URL : /likes/:like_no
    - Method : delete
    - Headers : application/json
    - Path Parameters :
        - like_no : int
    - 응답예시
    
    ```json
    {"rt":200,
     "rtmsg":"OK",
     "pubdate":"2022-10-10T03:00:09.816Z"}
    ```
    

---

## [ 기능 : 관광지정보_여행지 ]

1. 여행지 목록 조회
    - URL : /place
    - Method : get
    - Headers : application/json
    - 응답예시
        
        item의 여행지정보 객체의 like_no값은 session에 저장된 member_no가 있고(로그인상태인 경우), 좋아요 등록된 여행지인 경우에만 반환되는 값이다.
        
    
    ```json
    {
    	"rt": 200,
    	"rtmsg": "OK",
    	"pagenation": {
    		"nowPage": 1,
    		"totalCount": 0,
    		"listCount": 10,
    		"totalPage": 1,
    		"groupCount": 5,
    		"totalGroup": 1,
    		"nowGroup": 1,
    		"groupStart": 1,
    		"groupEnd": 1,
    		"prevGroupLastPage": 0,
    		"nextGroupFirstPage": 0,
    		"offset": 0
    	},
    	"item": [
    		{
        "food_no": 60,
        "title": "국수마당",
        "introduction": "신상공원 후문 앞에 국수거리에 있는 국수마당본점",
        "sbst": "제주의 토속음식인 고기국수가 유명한 집이다. 고기국수가 유명한 건 말할 것도 없고, 고기국수를 싫어하는 사람도 즐길 수 있게 콩나물국밥, 몸구, 아강발 등 다양한 메뉴가 있다. 새벽 5까지 영업해서 야식으로도 훌륭하다. 고기국수를 찾는 손님들이 점점 늘어나고 있어서 점심시간에는 대기표를 받을 수도 있다. 매월 11일은 국수 - DAY라서 500원이 할인되는 메뉴도 있으니 참고. 주변 관광지로는 제주도민속자연사박물관, 제주삼성혈 등이 있다.",
        "postcode": null,
        "address": "제주특별자치도 제주시 일도이동 1034-19",
        "roadaddress": "제주특별자치도 제주시 삼성로 65",
        "phoneno": "064-727-6001",
        "alltag": "향토음식,고기국수,콩나물국밥,아강발,몸국,현금결제,카드결제,화장실,흡연구역,편의점,음료대,유도 및 안내시설,경보 및 피난시설,아주 어려움",
        "tag": "향토음식,고기국수,콩나물국밥,아강발,몸국,음식,비빔국수,멸치국수,콩국수,만두",
        "longitude": 126.5322532,
        "latitude": 33.5080638,
        "reg_date": "2016-10-26T01:48:50.000Z",
        "edit_date": "2022-07-29T00:38:32.000Z",
        "image": "tourinfo/food60.jpeg",
        "thumbnail": null,
        "like_no": null
    		}
    		{},
    		{},
    		{},
    		.....
    	],
    	"pubdate": "2022-07-25T02:03:49.838Z"
    }
    ```
    

## [ 기능 : 관광지정보_음식점 ]

1. 음식점 목록 조회
    - URL : /food
    - Method : get
    - Headers : application/json
    - 응답예시
        
        item의 음식점정보 객체의 like_no값은 session에 저장된 member_no가 있고(로그인상태인 경우), 좋아요 등록된 음식점인 경우에만 반환되는 값이다.
        
    
    ```json
    {
    	"rt": 200,
    	"rtmsg": "OK",
    	"pagenation": {
    		"nowPage": 1,
    		"totalCount": 0,
    		"listCount": 10,
    		"totalPage": 1,
    		"groupCount": 5,
    		"totalGroup": 1,
    		"nowGroup": 1,
    		"groupStart": 1,
    		"groupEnd": 1,
    		"prevGroupLastPage": 0,
    		"nextGroupFirstPage": 0,
    		"offset": 0
    	},
    	"item": [
    		{
        "food_no": 60,
        "title": "표선해수욕장",
        "introduction": "너른 백사장이 매력적인 서귀포 동남부 해수욕장",
        "sbst": "총 면적 25만제곱미터, 백사장 16만 제곱미터에 이르는 표선해수욕장은 백사장이 아름다운 해수욕장으로 유명하다. 표선해수욕장의 넓은 모래콥은 썰물시엔 둥근 백사장처럼, 밀물시엔 수심이 낮은 애매랄드빛 원형 호수처럼 보여 경관이 아름답다. 뿐만 아니라 낮은 수심때문에 아이들과 물놀이를 즐기기에도 좋은 해수장이다. 인근 관광지로는 100m거리의 제주민속촌과 차로 5분 거리의 제주허브동산이 있다.",
        "postcode": null,
        "address": "제주특별자치도 서귀포시 표선면 표선리",
        "roadaddress": "제주특별자치도 서귀포시 표선면 표선리",
        "phoneno": "064-760-4992",
        "alltag": "해수욕장,액티비티,커플,맑음,여름,화장실,음료대,유도 및 안내시설,경보 및 피난시설,단독접근가능,단차없음,장애인 화장실,쉬움",
        "tag": "해수욕장,액티비티,커플,맑음,여름,자연경관,체험,레저/체험,해변,물놀이,수상레저",
        "longitude": 126.83810144720462,
        "latitude": 33.32723069299215,
        "reg_date": "2022-07-23T15:00:00.000Z",
        "edit_date": "2022-07-23T15:00:00.000Z",
        "image": "/tourinfo/place60.jpeg",
        "thumbnail": null,
        "like_no": 183
    		}
    		{},
    		{},
    		{},
    		.....
    	],
    	"pubdate": "2022-07-25T02:03:49.838Z"
    }
    ```
    

## [ 기능 : 관광지정보_숙소 ]

1. 숙소 목록 조회
    - URL : /accom
    - Method : get
    - Headers : application/json
    - 응답예시
        
        item의 숙소정보 객체의 like_no값은 session에 저장된 member_no가 있고(로그인상태인 경우), 좋아요 등록된 숙소인 경우에만 반환되는 값이다.
        
    
    ```json
    {
    	"rt": 200,
    	"rtmsg": "OK",
    	"pagenation": {
    		"nowPage": 1,
    		"totalCount": 0,
    		"listCount": 10,
    		"totalPage": 1,
    		"groupCount": 5,
    		"totalGroup": 1,
    		"nowGroup": 1,
    		"groupStart": 1,
    		"groupEnd": 1,
    		"prevGroupLastPage": 0,
    		"nextGroupFirstPage": 0,
    		"offset": 0
    	},
    	"item": [
    		{
        "accom_no": 60,
        "title": "유월그리고열두마루",
        "introduction": "구좌읍 한동리에 위치한 조용하고 단정한 게스트하우스",
        "sbst": "유월, 그리고 열두마루 게스트 하우스는 제주시 구좌읍 한동리에 위치하고 있다.&nbsp;'유월'이라는 게스트하우스와 '열두마루'라는 카페가 함께 운영되는 곳이다.오래된 건물을 리모델링한 게스트룸은 새 건물 못지않은 단정한 모습을 하고 있다.객실로는 '유월'이라는 건물에 4개의 2인실이 있고 또다른 하나의 독채가 있다. 4개의 2인실은 큰 방 2개와 작은 방 2개로 구성되며 독채는 2층의 구조로 2인에서 4인까지 숙박이 가능하다. 계단이 있어 안전상의 이유로 중학생부터 숙박이 가능하다.유월과 독채에는 조리시설이 없으며 취사가 불가능하다. 주전부리정도만 취식이 가능하다.&nbsp;숙박 다음날 아침엔 카페 '열두마루'에서 조식을 이용할 수 있다. 이외에도 간단한 음료와 맥주를 판매하고 있다.또한 이곳에서 직접 구운 쿠키도 맛볼 수 있다. 음악과 다양한 책을 준비해놨으니 편하게 즐기기만 하면 된다.주변 관광지로는 월정해수욕장, 토끼섬, 당처물동굴, 만장굴, 미로공원, 비자림, 용눈이 오름 등이 있으며, 제주 국제공항으로부터 승용차로 약 40분이 소요된다.",
        "postcode": 63359,
        "address": "제주특별자치도 제주시 구좌읍 한동리 982",
        "roadaddress": "제주특별자치도 제주시 구좌읍 한동로1길 38",
        "phoneno": "010-9864-1160",
        "alltag": "휴식 ,현금결제,카드결제,화장실,무료 WIFI,아주 어려움",
        "tag": "휴식,숙소,민박,돌집,조식,농어촌민박,발렛파킹,공공와이파이존",
        "longitude": 126.82546,
        "latitude": 33.535698,
        "reg_date": "2016-11-10T02:04:42.000Z",
        "edit_date": "2022-07-29T00:01:34.000Z",
        "image": "tourinfo/accom60.jpeg",
        "thumbnail": null,
    		"like_no": 183
    		}
    		{},
    		{},
    		{},
    		.....
    	],
    	"pubdate": "2022-07-25T02:03:49.838Z"
    }
    ```
