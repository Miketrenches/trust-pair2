"use client";

import { useEffect, useState } from "react";
import { Basket, PRESET_BASKETS, loadUserBaskets } from "@/lib/social";
import { BasketCard } from "@/components/social/basket-card";

export function BasketsGrid() {
  const [userBaskets, setUserBaskets] = useState<Basket[]>([]);

  useEffect(() => {
    setUserBaskets(loadUserBaskets());
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {userBaskets.map((b) => (
        <BasketCard key={b.id} basket={b} />
      ))}
      {PRESET_BASKETS.map((b) => (
        <BasketCard key={b.id} basket={b} />
      ))}
    </div>
  );
}
