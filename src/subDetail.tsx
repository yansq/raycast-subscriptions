import { ActionPanel, Action, Detail, Icon, useNavigation } from "@raycast/api"
import { useSubList } from "./useSubList"
import { getNextPaymentDate } from "./utils"
import type { Subscription } from "./types"

export default function SubDetail({ sub }: { sub: Subscription }) {
  const subList = useSubList()
  const { pop } = useNavigation();

  const markdown =
    `
# ${sub.name}
#### Price: ${sub.price}
#### Cycle: ${sub.cycle}
#### Add Date: ${sub.addDate.toISOString().slice(0, 10)}
#### Next Payment Date: ${getNextPaymentDate(sub).toISOString().slice(0, 10)}
#### Auto Renew: ${sub.autoRenew}
#### Website: ${sub.website}
`

  return (
    <Detail
      markdown={markdown}
      actions={
        <ActionPanel>
          <Action.OpenInBrowser url={sub.website} />
          <Action
            icon={Icon.Trash}
            title="Remove"
            style={Action.Style.Destructive}
            onAction={() => {
              subList.remove(sub.id)
              pop()
            }}
            shortcut={{ modifiers: ["opt"], key: "r" }}
          />
        </ActionPanel>
      }
    />
  )
}
