import type { Subscription } from "./types";

export function getNextPaymentDate(subscription: Subscription): Date {
  const currentDate = new Date();
  const addDate = new Date(subscription.addDate);

  let cycleMonths: number;
  switch (subscription.cycle) {
    case "Monthly":
      cycleMonths = 1;
      break;
    case "Quarterly":
      cycleMonths = 3;
      break;
    case "Yearly":
      cycleMonths = 12;
      break;
    default:
      throw new Error("Invalid cycle type");
  }

  // 计算已经过去了多少个周期
  const monthsDiff =
    (currentDate.getFullYear() - addDate.getFullYear()) * 12 + currentDate.getMonth() - addDate.getMonth();
  const cyclesPassed = Math.floor(monthsDiff / cycleMonths);

  // 计算下一次扣费日期
  const nextPayment = new Date(addDate);
  nextPayment.setMonth(addDate.getMonth() + cyclesPassed * cycleMonths);

  // 如果当前日期已经超过下一次扣费日期，则再加一个周期
  if (currentDate > nextPayment) {
    nextPayment.setMonth(nextPayment.getMonth() + cycleMonths);
  }

  // 保留原始的日期部分（避免时间影响）
  nextPayment.setDate(addDate.getDate());
  nextPayment.setHours(0, 0, 0, 0);

  return nextPayment;
}
