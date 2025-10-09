// builderSetup.ts
import { builder } from '@builder.io/react';

export const initBuilder = () => {
  const apiKey = process.env.REACT_APP_BUILDER_API_KEY;
  if (!apiKey) {
    console.warn("REACT_APP_BUILDER_API_KEY is missing");
    return;
  }
  builder.init(apiKey);
};
