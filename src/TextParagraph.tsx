import React from "react";

type ParagraphProps = {
  children: React.ReactNode;
};

export const TextParagraph = ({ children }: ParagraphProps) => (
  <>
    <p>{children}</p>
  </>
);
