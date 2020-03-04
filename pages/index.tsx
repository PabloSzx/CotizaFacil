import { NextPage } from "next";
import { FC } from "react";
import { Icon, Table } from "semantic-ui-react";

import { Box, Button, Divider, Image, Input, Stack } from "@chakra-ui/core";

const Row: FC<{ name: string; price: string; image?: string }> = ({
  name,
  price,
  image = "/static/image_placeholder.png"
}) => {
  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>{price}</Table.Cell>
      <Table.Cell>Sodimac</Table.Cell>
      <Table.Cell textAlign="center">
        <Image width="100px" src={image} />
      </Table.Cell>
    </Table.Row>
  );
};

const Index: NextPage = () => {
  return (
    <Stack>
      <Box>
        <Stack isInline justifyContent="space-around">
          <Box>
            <Input placeholder="martillo..." />
          </Box>
          <Box>
            <Button>Tiendas</Button>
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Divider />
      <Box>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Nombre</Table.HeaderCell>
              <Table.HeaderCell>Precio ($)</Table.HeaderCell>
              <Table.HeaderCell>Tienda</Table.HeaderCell>
              <Table.HeaderCell>Imagen</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            <Row
              name="Ubermann Martillo carpintero 16 Oz acero"
              price="$9.580"
            />
            <Row name="Martillo carpintero 0,68kg Robust" price="$9.190" />
          </Table.Body>
        </Table>
      </Box>
    </Stack>
  );
};

export default Index;
