export interface Subscription {
  id: string;
  name: string;
  addDate: Date;
  price: number;
  cycle: "Monthly" | "Quarterly" | "Yearly";
  website: string;
  autoRenew: boolean;
}
