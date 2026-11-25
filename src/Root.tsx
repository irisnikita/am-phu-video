import React from "react";
import { Composition, staticFile, Still } from "remotion";
import { Episode } from "./Episode";
import { Episode2 } from "./Episode2";
import { Thumbnail } from "./Thumbnail";
import { Cover } from "./Cover";
import type { Timeline } from "./types";

type Props = { id: string; timeline?: Timeline };

const load = async ({ props }: { props: Props }) => {
  const res = await fetch(staticFile(`${props.id}/timeline.json`));
  const timeline = (await res.json()) as Timeline;
  return {
    durationInFrames: Math.ceil(timeline.duration * timeline.fps),
    fps: timeline.fps,
    props: { ...props, timeline },
  };
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Short" component={Episode as any} width={1080} height={1920}
      fps={30} durationInFrames={300} defaultProps={{ id: "ep001" }} calculateMetadata={load as any} />
    <Composition id="Short2" component={Episode2 as any} width={1080} height={1920}
      fps={30} durationInFrames={300} defaultProps={{ id: "ep002" }} calculateMetadata={load as any} />
    <Still id="Thumb2" component={Episode2 as any} width={1080} height={1920}
      defaultProps={{ id: "ep002" }} calculateMetadata={load as any} />
    <Still id="Thumb" component={Thumbnail as any} width={1080} height={1920}
      defaultProps={{ id: "ep001" }} calculateMetadata={load as any} />
    <Still id="Cover1" component={Cover as any} width={1080} height={1920}
      defaultProps={{ ep: 1, crime: ["THỨC", "KHUYA"], face: "hon-thuc-khuya" }} />
    <Still id="Cover2" component={Cover as any} width={1080} height={1920}
      defaultProps={{ ep: 2, crime: ["SEEN", "KHÔNG REP"], face: "dv-tron-mat" }} />
  </>
);
