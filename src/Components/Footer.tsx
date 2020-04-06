import { Stack, Image, Text, Divider } from "@chakra-ui/core";
import { FC } from "react";
import { Icon } from "semantic-ui-react";

export const Footer: FC = () => {
  return (
    <>
      <Divider width="90%" paddingTop="60px" />

      <Stack
        isInline
        shouldWrapChildren
        flexWrap="wrap"
        width="100%"
        justify="center"
        align="center"
        padding="20px"
      >
        <Text>CotizaFácil</Text>
        <a
          className="icon"
          href="https://github.com/PabloSzx/CotizaFacil"
          target="_blank"
          rel="noopener"
        >
          <Icon size="large" name="github" className="pointer" />
        </a>
        <a
          target="_blank"
          rel="noopener"
          href="https://github.com/PabloSzx/CotizaFacil/blob/master/LICENSE"
        >
          <Image
            maxWidth="50px"
            src="data:image/png;base64,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"
          />
        </a>
      </Stack>
    </>
  );
};
