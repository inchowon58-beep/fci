import { redirect } from "next/navigation";

export default async function LegacyBusinessRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/place/${id}`);
}
