import { ActionPanel, Action, Icon, List, Color } from "@raycast/api";
import { useSubList } from "./useSubList";
import SubDetail from "./subDetail";
import { getNextPaymentDate } from "./utils";

function isWithinOneWeek(date: Date): boolean {
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数
  return date.getTime() - now.getTime() <= oneWeek;
}

export default function Command() {
  const subList = useSubList();
  const sum = subList.value?.reduce((a, b) => {
    if (b.cycle === "Yearly") {
      return a + b.price / 12;
    } else if (b.cycle === "Quarterly") {
      return a + b.price / 4;
    } else {
      return a + b.price;
    }
  }, 0);

  const colors: Map<string, Color> = new Map();
  subList.value?.forEach((item) => {
    if (item.autoRenew) {
      colors.set(item.id, Color.SecondaryText);
    } else {
      colors.set(item.id, isWithinOneWeek(getNextPaymentDate(item)) ? Color.Red : Color.SecondaryText);
    }
  });

  return (
    <List navigationTitle={`Total: ${(sum ?? 0).toFixed(2)} per month`}>
      {subList.value?.map((item) => (
        <List.Item
          key={item.id}
          title={item.name}
          subtitle={`${item.cycle}`}
          accessories={[
            {
              icon: {
                source: Icon.Calendar,
                tintColor: colors.get(item.id),
              },
            },
            {
              text: {
                value: getNextPaymentDate(item).toISOString().slice(0, 10),
                color: colors.get(item.id),
              },
            },
            {
              icon: {
                source: Icon.Coins,
                tintColor: colors.get(item.id),
              },
            },
            {
              text: {
                value: item.price.toString(),
                color: colors.get(item.id),
              },
            },
          ]}
          actions={
            <ActionPanel>
              <Action.Push title="Show Deatil" target={<SubDetail sub={item} />} />
              <Action
                icon={Icon.Trash}
                title="Remove"
                style={Action.Style.Destructive}
                onAction={() => {
                  subList.remove(item.id);
                }}
                shortcut={{ modifiers: ["opt"], key: "r" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
