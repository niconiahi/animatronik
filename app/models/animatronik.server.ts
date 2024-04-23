export interface Animatronik {
  id: string
  svg: string
  css: string
}

export async function getAnimatroniks(): Promise<Animatronik[]> {
  return [
    {
      css: "",
      id: "",
      svg: "",
    },
  ]
}

export async function createAnimatronik(
  animatronik: Pick<Animatronik, "css" | "svg" | "id">,
): Promise<Animatronik> {
  // eslint-disable-next-line no-console
  console.log("animatronik =>", animatronik)

  return {
    css: "",
    id: "",
    svg: "",
  }
}
