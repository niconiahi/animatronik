export type Animatronik = {
  id: string;
  svg: string;
  css: string;
};

export async function getAnimatroniks(): Promise<Animatronik[]> {
  return [
    {
      css: "",
      id: "",
      svg: "",
    },
  ];
}

export async function createAnimatronik(
  animatronik: Pick<Animatronik, "css" | "svg" | "id">,
): Promise<Animatronik> {
  return {
    css: "",
    id: "",
    svg: "",
  };
}
