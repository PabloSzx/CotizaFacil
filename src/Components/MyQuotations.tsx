import { FC } from "react";
import { Button, ButtonProps, Icon } from "semantic-ui-react";

export const MyQuotations: FC<ButtonProps> = props => {
  return (
    <Button color="black" icon labelPosition="left" {...props}>
      <Icon name="book" />
      Mis cotizaciones
    </Button>
  );
};
