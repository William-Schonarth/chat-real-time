import React, { JSX, JSXElementConstructor } from "react";

export function useContextProvider(
  Provider: keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  component: JSX.Element
): React.ReactElement {
  return <Provider>{component}</Provider>;
}
