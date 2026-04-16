import { redirect } from "next/navigation";

import { QuickCreateForm } from "../../../../components/create/quick-create-form";
import { getAuthContext } from "../../../../src/features/auth/server/get-auth-context";
import {
  buildTimerFromPreset,
  createSignedInDraftFromInput,
  encodeGuestTimerSeed,
} from "../../../../src/features/create/server/create-timer-from-preset";

export const dynamic = "force-dynamic";

async function createCircuitTimerAction(formData: FormData) {
  "use server";

  const auth = await getAuthContext();
  const input = buildTimerFromPreset("circuit", formData);

  if (auth.kind === "signed-in") {
    const result = await createSignedInDraftFromInput(auth, input);

    redirect(`/timers/${result.timerId}?notice=${encodeURIComponent(result.notice)}`);
  }

  redirect(
    `/create/custom?seed=${encodeURIComponent(encodeGuestTimerSeed(input))}&notice=${encodeURIComponent("Guest drafts stay temporary until you sign in and save.")}`,
  );
}

export default async function CreateCircuitPage() {
  const auth = await getAuthContext();

  return (
    <QuickCreateForm
      auth={auth}
      eyebrow="Quick Create"
      title="Circuit / Tabata"
      description="Generate a repeating circuit draft with work and recovery blocks across exercises and rounds."
      submitLabel="Create Circuit Draft"
      action={createCircuitTimerAction}
      fields={[
        {
          name: "workSeconds",
          label: "Work seconds",
          helpText: "Length of each exercise effort.",
          defaultValue: 40,
          min: 5,
          max: 600,
        },
        {
          name: "restSeconds",
          label: "Rest seconds",
          helpText: "Recovery after each exercise.",
          defaultValue: 20,
          min: 0,
          max: 600,
        },
        {
          name: "exercises",
          label: "Exercises",
          helpText: "How many work blocks sit inside one round.",
          defaultValue: 5,
          min: 1,
          max: 20,
        },
        {
          name: "rounds",
          label: "Rounds",
          helpText: "How many times to repeat the exercise list.",
          defaultValue: 3,
          min: 1,
          max: 20,
        },
        {
          name: "warmupSeconds",
          label: "Warmup seconds",
          helpText: "Optional warmup before the first exercise.",
          defaultValue: 90,
          min: 0,
          max: 900,
        },
        {
          name: "cooldownSeconds",
          label: "Cooldown seconds",
          helpText: "Optional cooldown after the last round.",
          defaultValue: 60,
          min: 0,
          max: 900,
        },
      ]}
    />
  );
}
