use("queryDB");
// 아래 예제는 이 샘플 데이터를 먼저 넣고 실행하세요
db.users.insertMany([
  {
    name: "Kim",
    age: 28,
    city: "Seoul",
    gender: "남성",
    email: "kim@gmail.com",
    tags: ["sports", "music"],
    orders: [1001, 1002, 1003, 1004, 1005],
    score: 85,
    status: "active",
  },
  {
    name: "Lee",
    age: 22,
    city: "Busan",
    gender: "여성",
    email: "lee@yahoo.com",
    tags: ["travel", "food"],
    orders: [2001, 2002, 2003],
    score: 75,
    status: "inactive",
    location: "Korea",
  },
  {
    name: "John Park",
    age: 35,
    city: "Seoul",
    gender: "남성",
    email: "john.park@gmail.com",
    tags: ["music", "sports", "travel"],
    orders: [3001, 3002, 3003, 3004],
    score: 90,
    status: "active",
  },
  {
    name: "Emma",
    age: 20,
    city: "Jeju",
    gender: "여성",
    email: "emma@naver.com",
    tags: ["fashion", "beauty"],
    orders: [7001],
    score: 70,
    status: "inactive",
  },
]);

use("queryDB");
db.users.find({ age: { $gte: 25 } }); // 25 이상

use("queryDB");
db.users.find({ age: { $gte: 20, $lte: 40 } }); // 20~40 사이

use("queryDB");
db.users.find({ age: { $in: [30, 40] } }); // 30 또는 40

use("queryDB");
db.users.find({ name: { $ne: "Lee" } }); // Lee가 아닌

use("queryDB");
db.users.find({ $or: [{ age: 30 }, { city: "Seoul" }] }); // 둘 중 하나

// 배열에 특정 값이 들어있는 문서 (tags 안에 "sports")
use("queryDB");
db.users.find({ tags: "sports" });

// 배열 길이가 정확히 3
use("queryDB");
db.users.find({ tags: { $size: 3 } });

// orders 배열의 마지막 1개만 잘라서 보기
use("queryDB");
db.users.find({}, { orders: { $slice: -1 } });

// 배열 원소가 3개 이상 → 인덱스 2번이 존재하는지로 판단
use("queryDB");
db.users.find({ "tags.2": { $exists: true } });

// location 필드가 있는 문서만
use("queryDB");
db.users.find({ location: { $exists: true } });

// 이름이 "John"으로 시작 (^ = 시작)
use("queryDB");
db.users.find({ name: { $regex: "^John" } });

// 이메일이 @gmail.com으로 끝남 ($ = 끝, \\. = 점 그대로)
use("queryDB");
db.users.find({ email: { $regex: "@gmail\\.com$" } });

// 대소문자 무시 검색: $options "i"
use("queryDB");
db.users.find({ city: { $regex: "seoul", $options: "i" } });

// 1) text 인덱스 생성 (name, email 필드 대상)
use("queryDB");
db.users.createIndex({ name: "text", email: "text" });

// 2) 단어로 전문 검색
use("queryDB");
db.users.find({ $text: { $search: "kim lee" } });

// 인덱스 조회 / 삭제
use("queryDB");
db.users.getIndexes();

use("queryDB");
db.users.dropIndex("name_text_email_text");
