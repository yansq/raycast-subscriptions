import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { useSubList } from "./useSubList";
import { nanoid } from "nanoid";

import type { Subscription } from "./types";

type SubscriptoinForm = Pick<Subscription, "name" | "addDate" | "cycle" | "website" | "autoRenew"> & {
  price: string;
};

export default function addSubForm() {
  const { pop } = useNavigation();
  const subList = useSubList();

  const { handleSubmit, itemProps } = useForm<SubscriptoinForm>({
    onSubmit(values) {
      const newSub: Subscription = {
        ...values,
        price: Number(values.price),
        id: nanoid(),
      };
      subList.add(newSub);

      showToast({
        style: Toast.Style.Success,
        title: "Success!",
        message: `Subscription ${values.name} created`,
      });
      pop();
    },
    validation: {
      name: FormValidation.Required,
      price: (value) => {
        if (value?.toString().length == 0) {
          return "Price should't be empty!";
        } else if (isNaN(Number(value))) {
          return "Price should be a number!";
        }
      },
    },
  });

  function getToday(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Add Subscription" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField title="Name" {...itemProps.name} />
      <Form.DatePicker id="addDate" title="Added Date" defaultValue={getToday()} />
      <Form.Dropdown id="cycle" title="Cycle">
        <Form.Dropdown.Item value="Monthly" title="Monthly" />
        <Form.Dropdown.Item value="Quarterly" title="Quarterly" />
        <Form.Dropdown.Item value="Yearly" title="Yearly" />
      </Form.Dropdown>
      <Form.TextField title="Price" {...itemProps.price} />
      <Form.Checkbox defaultValue={false} id="autoRenew" title="Auto-renewable" label="" />
      <Form.TextField id="website" title="Website" />
    </Form>
  );
}
