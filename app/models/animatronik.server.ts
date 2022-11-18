import type { Animatronik } from "@prisma/client";
import { prisma } from "~/db.server";

export async function getAnimatroniks() {
  return prisma.animatronik.findMany();
}

export async function createAnimatronik(
  animatronik: Pick<Animatronik, "css" | "svg" | "id">
) {
  return prisma.animatronik.create({ data: animatronik });
}
