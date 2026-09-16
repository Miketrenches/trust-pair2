import type { Metadata } from "next";
import { SocialNav, SocialFooter } from "@/components/social/nav";
import { BasketBuilder } from "@/components/social/basket-builder";

export const metadata: Metadata = {
  title: "Create a basket · SOCIAL",
  description:
    "Bundle X handles into a basket and route a token's creator fees to all of them at once.",
};

export default function CreatePage() {
  return (
    <div className="min-h-dvh">
      <SocialNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold">Create a basket</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick the people, set the split. Launch your token at the basket address and
          every creator-fee event pays all of them through X Money.
        </p>
        <div className="mt-8">
          <BasketBuilder />
        </div>
      </main>
      <SocialFooter />
    </div>
  );
}
