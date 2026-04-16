import { redirect } from "next/navigation";

import { QuickCreateForm } from "../../../../components/create/quick-create-form";
import { getAuthContext } from "../../../../src/features/auth/server/get-auth-context";
import {
  buildTimerFromPreset,
  createSignedInDraftFromInput,
  encodeGuestTimerSeed,
} from "../../../../src/features/create/server/create-timer-from-preset";

export const dynamic = "force-dynamic";

async function createRoundTimerAction(formData: FormData) {
  "use server";

  const auth = await getAuthContext();
  const input = buildTimerFromPreset("round", formData);

  if (auth.kind === "signed-in") {
    const result = await createSignedInDraftFromInput(auth, input);

    redirect(`/timers/${result.timerId}?notice=${encodeURIComponent(result.notice)}`);
  }

  redirect(
    `/create/custom?seed=${encodeURIComponent(encodeGuestTimerSeed(input))}&notice=${encodeURIComponent("Guest drafts stay temporary until you sign in and save.")}`,
  );
}

export default async function CreateRoundPage() {
  const auth = await getAuthContext();

  return (
    <QuickCreateForm
      auth={auth}
      eyebrow="Quick Create"
      title="Round"
      description="Create a round-based timer with a default name and a complete interval sequence immediately."
      submitLabel="Create Round Draft"
      action={createRoundTimerAction}
      fields={[
        {
          name: "roundSeconds",
          label: "Round seconds",
          helpText: "Length of each round.",
          defaultValue: 180,
          min: 15,
          max: 1800,
        },
        {
          name: "restSeconds",
          label: "Rest seconds",
          helpText: "Recovery between rounds.",
          defaultValue: 60,
          min: 0,
          max: 900,
        },
        {
          name: "rounds",
          label: "Rounds",
          helpText: "How many rounds to complete.",
          defaultValue: 5,
          min: 1,
          max: 20,
        },
        {
          name: "warmupSeconds",
          label: "Warmup seconds",
          helpText: "Optional warmup before round one.",
          defaultValue: 60,
          min: 0,
          max: 900,
        },
        {
          name: "cooldownSeconds",
          label: "Cooldown seconds",
          helpText: "Optional cooldown after the final round.",
          defaultValue: 60,
          min: 0,
          max: 900,
        },
      ]}
    />
  );
}
