import React from "react";
import { Composition } from "remotion";

import { VIDEO_FPS, VIDEO_HEIGHT, VIDEO_META, VIDEO_WIDTH } from "./constants";

import { NewsBreaking, newsBreakingSchema, newsBreakingDefaults } from "./compositions/NewsBreaking";
import {
  SponsorSpotlight,
  sponsorSpotlightSchema,
  sponsorSpotlightDefaults,
} from "./compositions/SponsorSpotlight";
import { EventPreview, eventPreviewSchema, eventPreviewDefaults } from "./compositions/EventPreview";
import { WeeklyRecap, weeklyRecapSchema, weeklyRecapDefaults } from "./compositions/WeeklyRecap";

const common = {
  fps: VIDEO_FPS,
  width: VIDEO_WIDTH,
  height: VIDEO_HEIGHT,
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO_META.news.id}
        component={NewsBreaking}
        durationInFrames={VIDEO_META.news.durationInFrames}
        schema={newsBreakingSchema}
        defaultProps={newsBreakingDefaults}
        {...common}
      />
      <Composition
        id={VIDEO_META.sponsor.id}
        component={SponsorSpotlight}
        durationInFrames={VIDEO_META.sponsor.durationInFrames}
        schema={sponsorSpotlightSchema}
        defaultProps={sponsorSpotlightDefaults}
        {...common}
      />
      <Composition
        id={VIDEO_META.event.id}
        component={EventPreview}
        durationInFrames={VIDEO_META.event.durationInFrames}
        schema={eventPreviewSchema}
        defaultProps={eventPreviewDefaults}
        {...common}
      />
      <Composition
        id={VIDEO_META.recap.id}
        component={WeeklyRecap}
        durationInFrames={VIDEO_META.recap.durationInFrames}
        schema={weeklyRecapSchema}
        defaultProps={weeklyRecapDefaults}
        {...common}
      />
    </>
  );
};

export default RemotionRoot;
