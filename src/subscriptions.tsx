import { ActionPanel, Action, Icon, List } from "@raycast/api";
import { useSubList } from "./useSubList";
import SubDetail from "./subDetail";
import { getNextPaymentDate } from "./utils";

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

  return (
    <List navigationTitle={`Total: ${(sum ?? 0).toFixed(2)} per month`}>
      {subList.value?.map((item) => (
        <List.Item
          key={item.id}
          title={item.name}
          subtitle={`${item.cycle} ${getNextPaymentDate(item).toISOString().slice(0, 10)}`}
          accessories={[{ icon: Icon.Coins, text: item.price.toString() }]}
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
