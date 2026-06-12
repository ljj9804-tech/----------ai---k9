use("aggDB");
db.sales.insertMany([
  {
    product: "Laptop",
    region: "Asia",
    amount: 1200,
    date: ISODate("2024-02-01"),
  },
  {
    product: "Laptop",
    region: "Europe",
    amount: 1500,
    date: ISODate("2024-02-02"),
  },
  {
    product: "Laptop",
    region: "Asia",
    amount: 800,
    date: ISODate("2024-02-03"),
  },
  {
    product: "Phone",
    region: "Asia",
    amount: 600,
    date: ISODate("2024-02-01"),
  },
  {
    product: "Tablet",
    region: "Asia",
    amount: 900,
    date: ISODate("2024-02-03"),
  },
  {
    product: "Tablet",
    region: "Europe",
    amount: 1100,
    date: ISODate("2024-02-04"),
  },
]);

// Asia 지역의 제품별 총매출을 높은 순으로
use("aggDB");
db.sales.aggregate([
  { $match: { region: "Asia" } }, // 1단계: Asia만
  { $group: { _id: "$product", totalSales: { $sum: "$amount" } } }, // 2단계: 제품별 합계
  { $sort: { totalSales: -1 } }, // 3단계: 내림차순
]);

use("aggDB");
// 필요한 필드만 출력 (_id 숨기고 product, amount만)
db.sales.aggregate([
  { $project: { _id: 0, product: 1, amount: 1, region: 1 } },
]);

use("aggDB");
// 페이지네이션: 3개 건너뛰고 3개만
db.sales.aggregate([{ $skip: 3 }, { $limit: 3 }]);

use("aggDB");
db.orders.insertMany([
  { _id: 1, userId: 101, items: ["apple", "banana"], price: 2, quantity: 3 },
  { _id: 2, userId: 102, items: ["orange", "grape"], price: 5, quantity: 1 },
]);
use("aggDB");
db.members.insertMany([
  { _id: 101, name: "John Doe", email: "john@example.com" },
  { _id: 102, name: "Jane Smith", email: "jane@example.com" },
]);

// items 배열을 개별 문서로 펼침 (apple, banana 각각 한 줄)
use("aggDB");
db.orders.aggregate([{ $unwind: "$items" }]);

// 주문(orders)에 사용자(members) 정보를 조인
use("aggDB");
db.orders.aggregate([
  {
    $lookup: {
      from: "members", // 연결할 컬렉션
      localField: "userId", // orders 쪽 키
      foreignField: "_id", // members 쪽 키
      as: "userInfo", // 결과를 담을 새 필드
    },
  },
]);

// 계산 필드 추가: totalPrice = price * quantity
use("aggDB");
db.orders.aggregate([
  { $addFields: { totalPrice: { $multiply: ["$price", "$quantity"] } } },
]);

// 조건에 맞는 문서 개수
use("aggDB");
db.sales.aggregate([{ $match: { region: "Asia" } }, { $count: "asiaCount" }]);

// 집계 결과를 새 컬렉션에 저장
use("aggDB");
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items", totalSales: { $sum: "$price" } } },
  { $out: "sales_summary" },
]);

use("aggDB");
db.sales_summary.find();

// $facet: 여러 집계를 한 번에 (전체매출 + 인기제품 동시 분석)
use("aggDB");
db.sales.aggregate([
  {
    $facet: {
      totalSales: [{ $group: { _id: null, total: { $sum: "$amount" } } }],
      topProducts: [
        { $group: { _id: "$product", sales: { $sum: "$amount" } } },
        { $sort: { sales: -1 } },
        { $limit: 3 },
      ],
    },
  },
]);

// $bucket: 금액 범위별 그룹화
use("aggDB");
db.sales.aggregate([
  {
    $bucket: {
      groupBy: "$amount",
      boundaries: [0, 800, 1200, 2000], // 0~800, 800~1200, 1200~2000
      default: "Other",
      output: { count: { $sum: 1 }, products: { $push: "$product" } },
    },
  },
]);

// $setWindowFields: 누적 합계(윈도우 함수, SQL window 유사)
use("aggDB");
db.sales.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$region",
      sortBy: { date: -1 },
      output: {
        runningTotal: {
          $sum: "$amount",
          window: { documents: ["unbounded", "current"] },
        },
      },
    },
  },
]);
