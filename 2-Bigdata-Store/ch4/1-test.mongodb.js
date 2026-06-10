use("indexDB");
db.users.insertMany([
  { name: "Alice", age: 29, city: "Seoul", email: "alice@gmail.com" },
  { name: "Bob", age: 35, city: "Busan", email: "bob@yahoo.com" },
  { name: "Charlie", age: 40, city: "Incheon", email: "charlie@hotmail.com" },
]);

use("indexDB");
db.users.createIndex({ age: 1 }); // 오름차순(1) 단일 인덱스

use("indexDB");
db.users.createIndex({ age: -1 }); // 내림차순(-1)

use("indexDB");
db.users.getIndexes(); // 현재 인덱스 목록

use("indexDB");
db.users.dropIndex("age_1");
// 특정 인덱스 삭제
use("indexDB");
db.users.dropIndexes(); // 모든 인덱스 삭제(_id 제외)

// 복합 인덱스: age, city 두 조건 동시 검색 최적화
use("indexDB");
db.users.createIndex({ age: 1, city: 1 });

// 유니크 인덱스: email 중복 삽입 시 오류(E11000) 발생
use("indexDB");
db.users.createIndex({ email: 1 }, { unique: true });

// 스파스 인덱스: location 필드가 있는 문서만 인덱싱
use("indexDB");
db.users.createIndex({ location: 1 }, { sparse: true });

// 부분 인덱스: age>=30인 문서만 인덱싱 (공간 절약)
use("indexDB");
db.users.createIndex(
  { age: 1 },
  { partialFilterExpression: { age: { $gte: 30 } } },
);

// 100,000건 대량 삽입
use("indexDB");
for (let i = 0; i < 100000; i++) {
  db.products.insertOne({
    name: "Product_" + i,
    category: i % 5 === 0 ? "Electronics" : "Home",
    price: Math.floor(Math.random() * 5000),
  });
}

use("indexDB");
db.products.getIndexes(); // 현재 인덱스 목록

use("indexDB");
db.products.dropIndex("category_1");

// 인덱스 없이 실행 계획 확인 (totalDocsExamined가 큼)
use("indexDB");
db.products.find({ category: "Electronics" }).explain("executionStats");

// 인덱스 생성 후 다시 확인 (totalDocsExamined가 줄고 시간 감소)
use("indexDB");
db.products.createIndex({ category: 1 });

use("indexDB");
db.products.find({ category: "Electronics" }).explain("executionStats");

// 예시 비교: 인덱스 없음 totalDocsExamined 100000 / 적용 후 크게 감소
