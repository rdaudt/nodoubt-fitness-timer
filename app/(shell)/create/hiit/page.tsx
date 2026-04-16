import { redirect } from "next/navigation";

import { QuickCreateForm } from "../../../../components/create/quick-create-form";
import { getAuthContext } from "../../../../src/features/auth/server/get-auth-context";
import {
  buildTimerFromPreset,
  createSignedInDraftFromInput,
  encodeGuestTimerSeed,
} from "../../../../src/features/create/server/create-timer-from-preset";

export const dynamic = "force-dynamic";

async function createHiitTimerAction(formData: FormData) {
  "use server";

  const auth = await getAuthContext();
  const input = buildTimerFromPreset("hiit", formData);

  if (auth.kind === "signed-in") {
    const result = await createSignedInDraftFromInput(auth, input);

    redirect(`/timers/${result.timerId}?notice=${encodeURIComponent(result.notice)}`);
  }

  redirect(
    `/create/custom?seed=${encodeURIComponent(encodeGuestTimerSeed(input))}&notice=${encodeURIComponent("Guest drafts stay temporary until you sign in and save.")}`,
  );
}

export default async function CreateHiitPage() {
  const auth = await getAuthContext();

  return (
    <QuickCreateForm
      auth={auth}
      eyebrow="Quick Create"
      title="HIIT"
      description="Set work, rest, and rounds. A valid draft is generated immediately with an auto-created name."
      submitLabel="Create HIIT Draft"
      action={createHiitTimerAction}
      fields={[
        {
          name: "workSeconds",
          label: "Work seconds",
          helpText: "Length of each work interval.",
          defaultValue: 45,
          min: 5,
          max: 600,
        },
        {
          name: "restSeconds",
          label: "Rest seconds",
          helpText: "Recovery between rounds.",
          defaultValue: 15,
          min: 5,
          max: 600,
        },
        {
          name: "rounds",
          label: "Rounds",
          helpText: "How many work intervals to repeat.",
          defaultValue: 8,
          min: 1,
          max: 30,
        },
        {
          name: "warmupSeconds",
          label: "Warmup seconds",
          helpText: "Optional setup block before the first effort.",
          defaultValue: 60,
          min: 0,
          max: 900,
        },
        {
          name: "cooldownSeconds",
          label: "Cooldown seconds",
          helpText: "Optional cooldown at the end of the session.",
          defaultValue: 60,
          min: 0,
          max: 900,
        },
      ]}
    />
  );
}
