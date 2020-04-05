import React, { cloneElement, FC, useState } from "react";
import { Confirm as ConfirmSemantic } from "semantic-ui-react";

export const Confirm: FC<{
  children: JSX.Element;
  content?: string | null;
  confirmButton?: string;
  cancelButton?: string;
  header?: string;
  size?: "mini" | "tiny" | "small" | "large" | "fullscreen";
}> = ({
  children,
  content,
  confirmButton,
  cancelButton,
  header,
  size = "small",
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ConfirmSemantic
        open={open}
        onConfirm={() => {
          if (children.props.onClick) children.props.onClick();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        content={content || null}
        confirmButton={confirmButton}
        cancelButton={cancelButton}
        header={header}
        size={size}
        style={{
          zIndex: 100000,
        }}
      />
      {cloneElement(children, {
        onClick: () => {
          setOpen(true);
        },
      })}
    </>
  );
};
